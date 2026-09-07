import { Router } from 'express';
import { PublicIssueController } from '../controllers/publicController.js';
import { AdminController } from '../controllers/adminController.js';
import { AuthController } from '../controllers/authController.js';
import { ChatbotController } from '../controllers/chatbotController.js';
import { requireAdminAuth } from '../middleware/auth.js';
const router = Router();
// Auth Routes
router.post('/auth/login', AuthController.login);
// Public Routes (User App)
router.get('/issues', PublicIssueController.getPublicIssues);
router.get('/issues/:id', PublicIssueController.getPublicIssueById);
router.get('/issues/:id/similar', PublicIssueController.getSimilarIssues);
router.post('/issues', PublicIssueController.createIssue);
router.post('/reports', PublicIssueController.submitReport);
router.post('/contact', PublicIssueController.submitContact);
router.post('/chat', ChatbotController.chat);
// Reactions Routes
router.get('/issues/:id/reactions', PublicIssueController.getReactions);
router.post('/issues/:id/reactions', PublicIssueController.postReaction);
// Comments Routes
router.get('/issues/:id/comments', PublicIssueController.getComments);
router.post('/issues/:id/comments', PublicIssueController.postComment);
router.post('/comments/:id/like', PublicIssueController.likeComment);
router.post('/comments/:id/report', PublicIssueController.reportComment);
// Admin Routes (Protected by requireAdminAuth middleware)
router.get('/admin/dashboard', requireAdminAuth, AdminController.getDashboardStats);
router.get('/admin/issues', requireAdminAuth, AdminController.getAllIssues);
router.get('/admin/issues/:id', requireAdminAuth, AdminController.getIssueById);
router.get('/admin/issues/:id/duplicates', requireAdminAuth, AdminController.getDuplicates);
router.post('/admin/issues/:id/approve', requireAdminAuth, AdminController.approveIssue);
router.post('/admin/issues/:id/reject', requireAdminAuth, AdminController.rejectIssue);
router.post('/admin/issues/:id/remove', requireAdminAuth, AdminController.removeIssue);
router.post('/admin/issues/:id/restore', requireAdminAuth, AdminController.restoreIssue);
router.get('/admin/issues/:id/history', requireAdminAuth, AdminController.getModerationHistory);
// Admin Reports Center
router.get('/admin/reports', requireAdminAuth, AdminController.getReports);
router.post('/admin/reports/:id/status', requireAdminAuth, AdminController.updateReportStatus);
// Admin Comments Moderation
router.get('/admin/comments', requireAdminAuth, AdminController.getAllComments);
router.delete('/admin/comments/:id', requireAdminAuth, AdminController.deleteComment);
// Admin Contact Messages Inbox
router.get('/admin/contact-messages', requireAdminAuth, AdminController.getContactMessages);
// Admin Profile
router.get('/admin/profile', requireAdminAuth, AdminController.getProfile);
router.put('/admin/profile/password', requireAdminAuth, AdminController.updatePassword);
export default router;
