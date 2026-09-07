import { IssueRepository } from '../repositories/issueRepository.js';
export const PublicIssueController = {
    async getPublicIssues(req, res) {
        try {
            const issues = await IssueRepository.findPublicIssues();
            return res.json(issues);
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to retrieve public issues.' });
        }
    },
    async getPublicIssueById(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const issue = await IssueRepository.findPublicIssueById(id);
            if (!issue) {
                return res.status(404).json({ error: 'Issue not found or not publicly available.' });
            }
            return res.json(issue);
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to retrieve issue details.' });
        }
    },
    async getSimilarIssues(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const similar = await IssueRepository.getSimilarIssues(id);
            return res.json(similar);
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to find similar issues.' });
        }
    },
    async createIssue(req, res) {
        try {
            const issueData = req.body;
            if (!issueData.title || !issueData.description || !issueData.name || !issueData.institution_name) {
                return res.status(400).json({ error: 'Missing required issue submission fields.' });
            }
            const newIssue = await IssueRepository.createIssue(issueData);
            return res.status(201).json(newIssue);
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to record issue submission.' });
        }
    },
    // REACTIONS
    async getReactions(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const anonymousId = req.query.anonymous_id || req.headers['x-anonymous-id'];
            const reactions = await IssueRepository.getIssueReactions(id, anonymousId);
            return res.json(reactions);
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to retrieve reactions.' });
        }
    },
    async postReaction(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const { reaction_type, anonymous_id } = req.body;
            const validTypes = ['LIKE', 'HEART', 'SAD', 'ANGRY', 'CLAP'];
            if (!reaction_type || !validTypes.includes(reaction_type)) {
                return res.status(400).json({ error: 'Invalid reaction type.' });
            }
            if (!anonymous_id) {
                return res.status(400).json({ error: 'Missing anonymous ID.' });
            }
            const updatedCounts = await IssueRepository.toggleReaction(id, anonymous_id, reaction_type);
            return res.json(updatedCounts);
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to toggle reaction.' });
        }
    },
    // COMMENTS
    async getComments(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const anonymousId = req.query.anonymous_id || req.headers['x-anonymous-id'];
            const comments = await IssueRepository.getIssueComments(id, anonymousId);
            return res.json(comments);
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to retrieve comments.' });
        }
    },
    async postComment(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const { author_name, content } = req.body;
            if (!author_name || !content || content.trim().length === 0) {
                return res.status(400).json({ error: 'Author name and comment content are required.' });
            }
            if (content.length > 500) {
                return res.status(400).json({ error: 'Comment must be 500 characters or fewer.' });
            }
            const comment = await IssueRepository.addComment(id, author_name.trim(), content.trim());
            return res.status(201).json(comment);
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to post comment.' });
        }
    },
    async likeComment(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const { anonymous_id } = req.body;
            if (!anonymous_id) {
                return res.status(400).json({ error: 'Missing anonymous ID.' });
            }
            const result = await IssueRepository.toggleCommentLike(id, anonymous_id);
            return res.json(result);
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to toggle comment like.' });
        }
    },
    async reportComment(req, res) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const { reason, description, anonymous_id } = req.body;
            if (!reason) {
                return res.status(400).json({ error: 'Missing report reason.' });
            }
            await IssueRepository.saveReport({
                comment_id: id,
                reason,
                description,
                reporter_id: anonymous_id || 'anonymous',
            });
            return res.json({ success: true, message: 'Comment report submitted.' });
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to submit comment report.' });
        }
    },
    // REPORTS & CONTACT
    async submitReport(req, res) {
        try {
            const report = req.body;
            if (!report.issue_id || !report.reason) {
                return res.status(400).json({ error: 'Missing report fields.' });
            }
            await IssueRepository.saveReport(report);
            return res.json({ success: true, message: 'Report submitted successfully.' });
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to process report.' });
        }
    },
    async submitContact(req, res) {
        try {
            const contact = req.body;
            if (!contact.name || !contact.email || !contact.message) {
                return res.status(400).json({ error: 'Missing contact form fields.' });
            }
            await IssueRepository.saveContactMessage(contact);
            return res.json({ success: true, message: 'Contact message recorded.' });
        }
        catch (err) {
            return res.status(500).json({ error: 'Failed to process contact message.' });
        }
    },
};
