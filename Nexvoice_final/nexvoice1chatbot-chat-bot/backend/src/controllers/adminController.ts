import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { IssueRepository } from '../repositories/issueRepository.js';
import { supabaseClient, supabaseAdmin } from '../config/supabase.js';

export const AdminController = {
  async getDashboardStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await IssueRepository.getAdminDashboardStats();
      return res.json(stats);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch dashboard statistics.' });
    }
  },

  async getAllIssues(req: AuthenticatedRequest, res: Response) {
    try {
      const issues = await IssueRepository.findAllIssuesAdmin();
      return res.json(issues);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch administrative issue ledger.' });
    }
  },

  async getIssueById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const issue = await IssueRepository.findIssueByIdAdmin(id);
      if (!issue) {
        return res.status(404).json({ error: 'Issue record not found.' });
      }
      return res.json(issue);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch issue details.' });
    }
  },

  async getDuplicates(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const duplicates = await IssueRepository.getPotentialDuplicatesAdmin(id);
      return res.json(duplicates);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch duplicate analysis.' });
    }
  },

  async approveIssue(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { note } = req.body;
      const admin = req.user!;
      const timestamp = new Date().toISOString();

      const success = await IssueRepository.updateIssueStatus(id, {
        status: 'APPROVED',
        approved_by: admin.id,
        approved_at: timestamp,
        updated_at: timestamp,
      });

      if (success) {
        await IssueRepository.addModerationHistory({
          issue_id: id,
          action: 'APPROVED',
          admin_id: admin.id,
          admin_name: admin.full_name,
          note: note || 'Approved by administrator.',
        });
        return res.json({ success: true, message: 'Issue approved and published.' });
      }
      return res.status(404).json({ error: 'Issue not found for approval.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to approve issue.' });
    }
  },

  async rejectIssue(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { reason } = req.body;
      const admin = req.user!;
      const timestamp = new Date().toISOString();

      const success = await IssueRepository.updateIssueStatus(id, {
        status: 'REJECTED',
        rejected_by: admin.id,
        rejected_at: timestamp,
        rejection_reason: reason || 'Rejected by administrator.',
        updated_at: timestamp,
      });

      if (success) {
        await IssueRepository.addModerationHistory({
          issue_id: id,
          action: 'REJECTED',
          admin_id: admin.id,
          admin_name: admin.full_name,
          note: reason || 'Rejected submission.',
        });
        return res.json({ success: true, message: 'Issue rejected.' });
      }
      return res.status(404).json({ error: 'Issue not found for rejection.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to reject issue.' });
    }
  },

  async removeIssue(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { reason } = req.body;
      const admin = req.user!;
      const timestamp = new Date().toISOString();

      const success = await IssueRepository.updateIssueStatus(id, {
        status: 'REMOVED',
        removed_by: admin.id,
        removed_at: timestamp,
        removal_reason: reason || 'Removed by administrator.',
        updated_at: timestamp,
      });

      if (success) {
        await IssueRepository.addModerationHistory({
          issue_id: id,
          action: 'REMOVED',
          admin_id: admin.id,
          admin_name: admin.full_name,
          note: reason || 'Removed from public website.',
        });
        return res.json({ success: true, message: 'Issue removed from public display.' });
      }
      return res.status(404).json({ error: 'Issue not found for removal.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to remove issue.' });
    }
  },

  async restoreIssue(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { note } = req.body;
      const admin = req.user!;
      const timestamp = new Date().toISOString();

      const success = await IssueRepository.updateIssueStatus(id, {
        status: 'APPROVED',
        approved_by: admin.id,
        approved_at: timestamp,
        updated_at: timestamp,
      });

      if (success) {
        await IssueRepository.addModerationHistory({
          issue_id: id,
          action: 'RESTORED',
          admin_id: admin.id,
          admin_name: admin.full_name,
          note: note || 'Restored to public display.',
        });
        return res.json({ success: true, message: 'Issue restored to public display.' });
      }
      return res.status(404).json({ error: 'Issue not found for restoration.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to restore issue.' });
    }
  },

  async getModerationHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const history = await IssueRepository.findModerationHistory(id);
      return res.json(history);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch moderation history.' });
    }
  },

  // ADMIN REPORT CENTER
  async getReports(req: AuthenticatedRequest, res: Response) {
    try {
      const reports = await IssueRepository.getAllReportsAdmin();
      return res.json(reports);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch reports.' });
    }
  },

  async updateReportStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { status } = req.body;
      if (!status || !['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid report status.' });
      }
      const admin = req.user!;
      await IssueRepository.updateReportStatusAdmin(id, status, admin.id);
      return res.json({ success: true, message: `Report status updated to ${status}.` });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update report status.' });
    }
  },

  // ADMIN COMMENT MODERATION
  async getAllComments(req: AuthenticatedRequest, res: Response) {
    try {
      const comments = await IssueRepository.getAllCommentsAdmin();
      return res.json(comments);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch comments.' });
    }
  },

  async deleteComment(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const success = await IssueRepository.removeCommentAdmin(id);
      if (success) {
        return res.json({ success: true, message: 'Comment removed.' });
      }
      return res.status(404).json({ error: 'Comment not found.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete comment.' });
    }
  },

  async getContactMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const client = supabaseAdmin || supabaseClient;
      if (client) {
        const { data, error } = await client
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return res.json(data);
      }
      return res.json([]);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch contact messages.' });
    }
  },

  async getProfile(req: AuthenticatedRequest, res: Response) {
    return res.json({
      id: req.user!.id,
      full_name: req.user!.full_name,
      email: req.user!.email,
      role: req.user!.role,
    });
  },

  async updatePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const { password } = req.body;
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }
      const client = supabaseAdmin || supabaseClient;
      if (client) {
        await client.auth.updateUser({ password });
      }
      return res.json({ success: true, message: 'Password updated successfully.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update admin password.' });
    }
  },
};
