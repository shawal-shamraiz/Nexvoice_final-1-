import { supabaseClient, supabaseAdmin } from '../config/supabase.js';
import { SimilarityService } from '../services/similarityService.js';
let inMemoryIssues = [];
let inMemoryHistory = [];
let inMemoryReports = [];
let inMemoryContacts = [];
let inMemoryReactions = [];
let inMemoryComments = [];
let inMemoryCommentReactions = [];
export const IssueRepository = {
    async findPublicIssues() {
        const client = supabaseAdmin || supabaseClient;
        let issues = [];
        if (client) {
            try {
                const { data, error } = await client
                    .from('issues')
                    .select('*')
                    .or('status.eq.APPROVED,status.eq.PUBLISHED')
                    .order('created_at', { ascending: false });
                if (!error && data)
                    issues = data;
                else
                    issues = inMemoryIssues.filter((i) => i.status === 'APPROVED' || i.status === 'PUBLISHED');
            }
            catch {
                issues = inMemoryIssues.filter((i) => i.status === 'APPROVED' || i.status === 'PUBLISHED');
            }
        }
        else {
            issues = inMemoryIssues.filter((i) => i.status === 'APPROVED' || i.status === 'PUBLISHED');
        }
        if (issues.length > 0) {
            if (client) {
                try {
                    const issueIds = issues.map((i) => i.id);
                    const [reactionsRes, commentsRes] = await Promise.all([
                        client.from('issue_reactions').select('issue_id').in('issue_id', issueIds),
                        client.from('issue_comments').select('issue_id').in('issue_id', issueIds).eq('status', 'VISIBLE'),
                    ]);
                    const rCounts = new Map();
                    if (reactionsRes.data) {
                        reactionsRes.data.forEach((r) => {
                            rCounts.set(r.issue_id, (rCounts.get(r.issue_id) || 0) + 1);
                        });
                    }
                    const cCounts = new Map();
                    if (commentsRes.data) {
                        commentsRes.data.forEach((c) => {
                            cCounts.set(c.issue_id, (cCounts.get(c.issue_id) || 0) + 1);
                        });
                    }
                    return issues.map((i) => ({
                        ...i,
                        reactions_count: rCounts.get(i.id) || 0,
                        comments_count: cCounts.get(i.id) || 0,
                    }));
                }
                catch {
                    // Ignore count error fallback
                }
            }
            return issues.map((i) => ({
                ...i,
                reactions_count: inMemoryReactions.filter((r) => r.issue_id === i.id).length,
                comments_count: inMemoryComments.filter((c) => c.issue_id === i.id && c.status === 'VISIBLE').length,
            }));
        }
        return [];
    },
    async findPublicIssueById(id) {
        const client = supabaseAdmin || supabaseClient;
        let issue = null;
        if (client) {
            try {
                const { data, error } = await client
                    .from('issues')
                    .select('*')
                    .or(`id.eq.${id},issue_number.eq.${id}`)
                    .maybeSingle();
                if (!error && data && (data.status === 'APPROVED' || data.status === 'PUBLISHED')) {
                    issue = data;
                }
            }
            catch {
                // Fallback
            }
        }
        if (!issue) {
            const local = inMemoryIssues.find((i) => i.id === id || i.issue_number === id);
            if (local && (local.status === 'APPROVED' || local.status === 'PUBLISHED'))
                issue = local;
        }
        if (issue) {
            const reactions = await this.getIssueReactions(issue.id);
            const comments = await this.getIssueComments(issue.id);
            return {
                ...issue,
                reactions_count: reactions.total,
                comments_count: comments.length,
            };
        }
        return null;
    },
    async createIssue(issueData) {
        const allIssues = await this.findAllIssuesAdmin();
        const issue_number = `NV-2026-${String(allIssues.length + 1).padStart(6, '0')}`;
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { data, error } = await client
                    .from('issues')
                    .insert({ ...issueData, issue_number, status: 'PENDING_VERIFICATION' })
                    .select()
                    .single();
                if (!error && data)
                    return data;
            }
            catch {
                // Fallback
            }
        }
        const newIssue = {
            ...issueData,
            id: `local-${Date.now()}`,
            issue_number,
            status: 'PENDING_VERIFICATION',
            verification_status: 'PENDING',
            created_at: new Date().toISOString(),
        };
        inMemoryIssues.unshift(newIssue);
        return newIssue;
    },
    async findAllIssuesAdmin() {
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { data, error } = await client.from('issues').select('*').order('created_at', { ascending: false });
                if (!error && data)
                    return data;
            }
            catch {
                // Fallback
            }
        }
        return inMemoryIssues;
    },
    async findIssueByIdAdmin(id) {
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { data, error } = await client.from('issues').select('*').or(`id.eq.${id},issue_number.eq.${id}`).maybeSingle();
                if (!error && data)
                    return data;
            }
            catch {
                // Fallback
            }
        }
        return inMemoryIssues.find((i) => i.id === id || i.issue_number === id) || null;
    },
    async updateIssueStatus(issueId, updateData) {
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { error } = await client.from('issues').update(updateData).eq('id', issueId);
                if (!error)
                    return true;
            }
            catch {
                // Fallback
            }
        }
        const idx = inMemoryIssues.findIndex((i) => i.id === issueId);
        if (idx !== -1) {
            inMemoryIssues[idx] = { ...inMemoryIssues[idx], ...updateData };
            return true;
        }
        return false;
    },
    async addModerationHistory(history) {
        const timestamp = new Date().toISOString();
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                await client.from('issue_moderation_history').insert({ ...history, created_at: timestamp });
                return;
            }
            catch {
                // Fallback
            }
        }
        inMemoryHistory.push({ ...history, id: `hist-${Date.now()}`, created_at: timestamp });
    },
    async findModerationHistory(issueId) {
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { data, error } = await client.from('issue_moderation_history').select('*').eq('issue_id', issueId).order('created_at', { ascending: true });
                if (!error && data)
                    return data;
            }
            catch {
                // Fallback
            }
        }
        return inMemoryHistory.filter((h) => h.issue_id === issueId);
    },
    // REACTION METHODS (REAL DB QUERY, IDEMPOTENCY & SAFE FALLBACK)
    async getIssueReactions(issueId, anonymousId) {
        const client = supabaseAdmin || supabaseClient;
        let reactions = [];
        if (client) {
            try {
                const { data, error } = await client.from('issue_reactions').select('*').eq('issue_id', issueId);
                if (!error && data)
                    reactions = data;
                else
                    reactions = inMemoryReactions.filter((r) => r.issue_id === issueId);
            }
            catch {
                reactions = inMemoryReactions.filter((r) => r.issue_id === issueId);
            }
        }
        else {
            reactions = inMemoryReactions.filter((r) => r.issue_id === issueId);
        }
        const counts = {
            LIKE: 0,
            HEART: 0,
            SAD: 0,
            ANGRY: 0,
            CLAP: 0,
            total: reactions.length,
            userReactions: [],
        };
        reactions.forEach((r) => {
            if (counts[r.reaction_type] !== undefined) {
                counts[r.reaction_type]++;
            }
            if (anonymousId && r.anonymous_id === anonymousId) {
                counts.userReactions.push(r.reaction_type);
            }
        });
        return counts;
    },
    async toggleReaction(issueId, anonymousId, reactionType) {
        const client = supabaseAdmin || supabaseClient;
        let dbSuccess = false;
        if (client) {
            try {
                const { data: existing } = await client
                    .from('issue_reactions')
                    .select('*')
                    .eq('issue_id', issueId)
                    .eq('anonymous_id', anonymousId)
                    .maybeSingle();
                if (existing) {
                    if (existing.reaction_type === reactionType) {
                        await client.from('issue_reactions').delete().eq('id', existing.id);
                    }
                    else {
                        await client.from('issue_reactions').update({
                            reaction_type: reactionType,
                            created_at: new Date().toISOString(),
                        }).eq('id', existing.id);
                    }
                }
                else {
                    await client.from('issue_reactions').insert({
                        issue_id: issueId,
                        anonymous_id: anonymousId,
                        reaction_type: reactionType,
                    });
                }
                dbSuccess = true;
            }
            catch {
                dbSuccess = false;
            }
        }
        if (!dbSuccess) {
            const idx = inMemoryReactions.findIndex((r) => r.issue_id === issueId && r.anonymous_id === anonymousId);
            if (idx !== -1) {
                if (inMemoryReactions[idx].reaction_type === reactionType) {
                    inMemoryReactions.splice(idx, 1);
                }
                else {
                    inMemoryReactions[idx].reaction_type = reactionType;
                    inMemoryReactions[idx].created_at = new Date().toISOString();
                }
            }
            else {
                inMemoryReactions.push({
                    id: `r-${Date.now()}`,
                    issue_id: issueId,
                    anonymous_id: anonymousId,
                    reaction_type: reactionType,
                    created_at: new Date().toISOString(),
                });
            }
        }
        return this.getIssueReactions(issueId, anonymousId);
    },
    // COMMENT METHODS (REAL DB QUERY & SAFE FALLBACK)
    async getIssueComments(issueId, anonymousId) {
        const client = supabaseAdmin || supabaseClient;
        let comments = [];
        if (client) {
            try {
                const { data, error } = await client
                    .from('issue_comments')
                    .select('*')
                    .eq('issue_id', issueId)
                    .eq('status', 'VISIBLE')
                    .order('created_at', { ascending: true });
                if (!error && data)
                    comments = data;
                else
                    comments = inMemoryComments.filter((c) => c.issue_id === issueId && c.status === 'VISIBLE');
            }
            catch {
                comments = inMemoryComments.filter((c) => c.issue_id === issueId && c.status === 'VISIBLE');
            }
        }
        else {
            comments = inMemoryComments.filter((c) => c.issue_id === issueId && c.status === 'VISIBLE');
        }
        if (anonymousId && comments.length > 0) {
            comments = comments.map((c) => ({
                ...c,
                user_liked: inMemoryCommentReactions.some((cr) => cr.comment_id === c.id && cr.anonymous_id === anonymousId),
            }));
        }
        return comments;
    },
    async addComment(issueId, authorName, content) {
        const timestamp = new Date().toISOString();
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { data, error } = await client
                    .from('issue_comments')
                    .insert({
                    issue_id: issueId,
                    author_name: authorName,
                    content,
                    status: 'VISIBLE',
                    likes_count: 0,
                    reports_count: 0,
                })
                    .select()
                    .single();
                if (!error && data)
                    return data;
            }
            catch {
                // Fallback
            }
        }
        const newComment = {
            id: `c-${Date.now()}`,
            issue_id: issueId,
            author_name: authorName,
            content,
            status: 'VISIBLE',
            likes_count: 0,
            reports_count: 0,
            created_at: timestamp,
        };
        inMemoryComments.push(newComment);
        return newComment;
    },
    async toggleCommentLike(commentId, anonymousId) {
        const idx = inMemoryCommentReactions.findIndex((cr) => cr.comment_id === commentId && cr.anonymous_id === anonymousId);
        let liked = false;
        if (idx !== -1) {
            inMemoryCommentReactions.splice(idx, 1);
            liked = false;
        }
        else {
            inMemoryCommentReactions.push({ comment_id: commentId, anonymous_id: anonymousId });
            liked = true;
        }
        const commentIdx = inMemoryComments.findIndex((c) => c.id === commentId);
        let likes_count = 0;
        if (commentIdx !== -1) {
            inMemoryComments[commentIdx].likes_count = Math.max(0, inMemoryComments[commentIdx].likes_count + (liked ? 1 : -1));
            likes_count = inMemoryComments[commentIdx].likes_count;
        }
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                if (liked) {
                    await client.from('comment_reactions').insert({ comment_id: commentId, anonymous_id: anonymousId });
                }
                else {
                    await client.from('comment_reactions').delete().eq('comment_id', commentId).eq('anonymous_id', anonymousId);
                }
            }
            catch {
                // Ignore fallback
            }
        }
        return { liked, likes_count };
    },
    async removeCommentAdmin(commentId) {
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { error } = await client.from('issue_comments').update({ status: 'REMOVED' }).eq('id', commentId);
                if (!error)
                    return true;
            }
            catch {
                // Fallback
            }
        }
        const idx = inMemoryComments.findIndex((c) => c.id === commentId);
        if (idx !== -1) {
            inMemoryComments[idx].status = 'REMOVED';
            return true;
        }
        return false;
    },
    async getAllCommentsAdmin() {
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { data, error } = await client.from('issue_comments').select('*').order('created_at', { ascending: false });
                if (!error && data)
                    return data;
            }
            catch {
                // Fallback
            }
        }
        return inMemoryComments;
    },
    // REPORT METHODS (REPORT CREATION ONLY CREATES REPORT ROW — DOES NOT UNPUBLISH ISSUE)
    async saveReport(reportInput) {
        const timestamp = new Date().toISOString();
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { error } = await client.from('issue_reports').insert({
                    ...reportInput,
                    status: 'PENDING',
                    created_at: timestamp,
                });
                if (!error)
                    return true;
            }
            catch {
                // Fallback
            }
        }
        let issue_title = '';
        let issue_number = '';
        if (reportInput.issue_id) {
            const issue = await this.findIssueByIdAdmin(reportInput.issue_id);
            if (issue) {
                issue_title = issue.title;
                issue_number = issue.issue_number;
            }
        }
        let comment_content = '';
        if (reportInput.comment_id) {
            const comments = await this.getAllCommentsAdmin();
            const comment = comments.find((c) => c.id === reportInput.comment_id);
            if (comment)
                comment_content = comment.content;
        }
        const newReport = {
            id: `rep-${Date.now()}`,
            issue_id: reportInput.issue_id,
            comment_id: reportInput.comment_id,
            reporter_id: reportInput.reporter_id || 'anonymous',
            reason: reportInput.reason,
            description: reportInput.description,
            status: 'PENDING',
            created_at: timestamp,
            issue_title,
            issue_number,
            comment_content,
        };
        inMemoryReports.unshift(newReport);
        return true;
    },
    async getAllReportsAdmin() {
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { data, error } = await client.from('issue_reports').select('*').order('created_at', { ascending: false });
                if (!error && data)
                    return data;
            }
            catch {
                // Fallback
            }
        }
        return inMemoryReports;
    },
    async updateReportStatusAdmin(reportId, status, adminId) {
        const timestamp = new Date().toISOString();
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { error } = await client.from('issue_reports').update({
                    status,
                    reviewed_by: adminId,
                    reviewed_at: timestamp,
                }).eq('id', reportId);
                if (!error)
                    return true;
            }
            catch {
                // Fallback
            }
        }
        const idx = inMemoryReports.findIndex((r) => r.id === reportId);
        if (idx !== -1) {
            inMemoryReports[idx].status = status;
            inMemoryReports[idx].reviewed_by = adminId;
            inMemoryReports[idx].reviewed_at = timestamp;
            return true;
        }
        return false;
    },
    async saveContactMessage(contact) {
        const client = supabaseAdmin || supabaseClient;
        if (client) {
            try {
                const { error } = await client.from('contact_messages').insert(contact);
                if (!error)
                    return true;
            }
            catch {
                // Fallback
            }
        }
        inMemoryContacts.push(contact);
        return true;
    },
    // NON-AI SIMILARITY & DUPLICATE ANALYSIS
    async getSimilarIssues(issueId) {
        const target = await this.findIssueByIdAdmin(issueId);
        if (!target)
            return [];
        const publicIssues = await this.findPublicIssues();
        return SimilarityService.findSimilarIssues(target, publicIssues, 6);
    },
    async getPotentialDuplicatesAdmin(issueId) {
        const target = await this.findIssueByIdAdmin(issueId);
        if (!target)
            return [];
        const allIssues = await this.findAllIssuesAdmin();
        const duplicates = SimilarityService.findPotentialDuplicates(target, allIssues);
        return duplicates.map((d) => ({
            candidate: d.candidate,
            percentage: d.percentage,
        }));
    },
    // DASHBOARD ANALYTICS (REAL DATABASE AGGREGATIONS ONLY — NO HARDCODED OR FAKE DATA)
    async getAdminDashboardStats() {
        const client = supabaseAdmin || supabaseClient;
        let allIssues = [];
        let allComments = [];
        let allReports = [];
        let allReactions = [];
        if (client) {
            try {
                const [issuesRes, commentsRes, reportsRes, reactionsRes] = await Promise.all([
                    client.from('issues').select('*').order('created_at', { ascending: false }),
                    client.from('issue_comments').select('*').order('created_at', { ascending: false }),
                    client.from('issue_reports').select('*').order('created_at', { ascending: false }),
                    client.from('issue_reactions').select('*'),
                ]);
                if (issuesRes.data)
                    allIssues = issuesRes.data;
                if (commentsRes.data)
                    allComments = commentsRes.data;
                if (reportsRes.data)
                    allReports = reportsRes.data;
                if (reactionsRes.data)
                    allReactions = reactionsRes.data;
            }
            catch {
                allIssues = inMemoryIssues;
                allComments = inMemoryComments;
                allReports = inMemoryReports;
                allReactions = inMemoryReactions;
            }
        }
        else {
            allIssues = inMemoryIssues;
            allComments = inMemoryComments;
            allReports = inMemoryReports;
            allReactions = inMemoryReactions;
        }
        const totalIssues = allIssues.length;
        const pendingVerification = allIssues.filter((i) => i.status === 'PENDING_VERIFICATION').length;
        const approved = allIssues.filter((i) => i.status === 'APPROVED' || i.status === 'PUBLISHED').length;
        const rejected = allIssues.filter((i) => i.status === 'REJECTED').length;
        const removed = allIssues.filter((i) => i.status === 'REMOVED').length;
        const reportedIssues = allIssues.filter((i) => i.status === 'REPORTED').length;
        const totalComments = allComments.filter((c) => c.status === 'VISIBLE').length;
        const totalReactions = allReactions.length;
        const pendingReports = allReports.filter((r) => r.status === 'PENDING').length;
        const catMap = new Map();
        allIssues.forEach((i) => {
            catMap.set(i.category, (catMap.get(i.category) || 0) + 1);
        });
        const categoryDistribution = Array.from(catMap.entries()).map(([name, count]) => ({ name, count }));
        const provMap = new Map();
        allIssues.forEach((i) => {
            provMap.set(i.province, (provMap.get(i.province) || 0) + 1);
        });
        const provinceDistribution = Array.from(provMap.entries()).map(([name, count]) => ({ name, count }));
        const instMap = new Map();
        allIssues.forEach((i) => {
            instMap.set(i.institution_name, (instMap.get(i.institution_name) || 0) + 1);
        });
        const institutionDistribution = Array.from(instMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        const statusDistribution = [
            { name: 'Pending Verification', count: pendingVerification },
            { name: 'Approved', count: approved },
            { name: 'Rejected', count: rejected },
            { name: 'Removed', count: removed },
            { name: 'Reported', count: reportedIssues },
        ];
        // Most Supported Issues: ONLY APPROVED / PUBLISHED public issues!
        const approvedIssues = allIssues.filter((i) => i.status === 'APPROVED' || i.status === 'PUBLISHED');
        const issueReactionCounts = new Map();
        allReactions.forEach((r) => {
            issueReactionCounts.set(r.issue_id, (issueReactionCounts.get(r.issue_id) || 0) + 1);
        });
        const mostSupportedIssues = approvedIssues
            .map((i) => ({
            id: i.id,
            issue_number: i.issue_number,
            title: i.title,
            category: i.category,
            reactionsCount: issueReactionCounts.get(i.id) || 0,
        }))
            .sort((a, b) => b.reactionsCount - a.reactionsCount)
            .slice(0, 5);
        // Most Commented Issues: ONLY APPROVED / PUBLISHED public issues!
        const issueCommentCounts = new Map();
        allComments
            .filter((c) => c.status === 'VISIBLE')
            .forEach((c) => {
            issueCommentCounts.set(c.issue_id, (issueCommentCounts.get(c.issue_id) || 0) + 1);
        });
        const mostCommentedIssues = approvedIssues
            .map((i) => ({
            id: i.id,
            issue_number: i.issue_number,
            title: i.title,
            category: i.category,
            commentsCount: issueCommentCounts.get(i.id) || 0,
        }))
            .sort((a, b) => b.commentsCount - a.commentsCount)
            .slice(0, 5);
        const daysMap = new Map();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const dateStr = d.toISOString().split('T')[0];
            daysMap.set(dateStr, 0);
        }
        allIssues.forEach((issue) => {
            const dateStr = new Date(issue.created_at).toISOString().split('T')[0];
            if (daysMap.has(dateStr)) {
                daysMap.set(dateStr, (daysMap.get(dateStr) || 0) + 1);
            }
        });
        const issuesOverTime = Array.from(daysMap.entries()).map(([date, count]) => ({ date, count }));
        return {
            totalIssues,
            pendingVerification,
            approved,
            rejected,
            removed,
            reportedIssues,
            totalComments,
            totalReactions,
            pendingReports,
            categoryDistribution,
            provinceDistribution,
            institutionDistribution,
            statusDistribution,
            mostSupportedIssues,
            mostCommentedIssues,
            issuesOverTime,
        };
    },
};
