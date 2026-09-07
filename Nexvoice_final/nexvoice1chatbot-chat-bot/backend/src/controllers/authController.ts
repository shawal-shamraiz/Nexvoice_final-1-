import type { Request, Response } from 'express';
import { supabaseClient, supabaseAdmin } from '../config/supabase.js';

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const client = supabaseAdmin || supabaseClient;
      if (!client) {
        // Mock mode for local testing without Supabase credentials
        if ((email === 'ahsan@nexvoice.org' || email === 'shawal@nexvoice.org' || email.includes('admin')) && password.length >= 6) {
          const isShawal = email.includes('shawal');
          return res.json({
            token: isShawal ? 'shawal-mock-token' : 'ahsan-mock-token',
            user: {
              id: isShawal ? 'shawal-uuid' : 'ahsan-uuid',
              email,
              full_name: isShawal ? 'Shawal' : 'Ahsan Iqbal',
              role: 'ADMIN',
            },
          });
        }
        return res.status(401).json({ error: 'Invalid admin credentials.' });
      }

      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error || !data.user || !data.session) {
        return res.status(401).json({ error: error?.message || 'Authentication failed.' });
      }

      // Verify ADMIN role from profiles table
      const { data: profile } = await client.from('profiles').select('*').eq('id', data.user.id).maybeSingle();

      if (!profile || profile.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized. Account is not an administrator.' });
      }

      return res.json({
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: profile.full_name || 'Administrator',
          role: 'ADMIN',
        },
      });
    } catch (err) {
      return res.status(500).json({ error: 'Login service failure.' });
    }
  },

  async me(req: Request, res: Response) {
    // Verified by middleware if attached
    return res.json({ status: 'authenticated' });
  },
};
