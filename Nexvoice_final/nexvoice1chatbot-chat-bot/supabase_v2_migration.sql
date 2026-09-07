-- ============================================================
-- NexVoice v2.0 - Database Migration & RLS Security Schema
-- ============================================================

-- 1. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Update Issues Table with Moderation Fields
-- Drop existing constraint if it exists to allow new status types
ALTER TABLE public.issues DROP CONSTRAINT IF EXISTS issues_status_check;

-- Add moderation columns if they do not exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issues' AND column_name='approved_by') THEN
        ALTER TABLE public.issues ADD COLUMN approved_by UUID REFERENCES public.profiles(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issues' AND column_name='approved_at') THEN
        ALTER TABLE public.issues ADD COLUMN approved_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issues' AND column_name='rejected_by') THEN
        ALTER TABLE public.issues ADD COLUMN rejected_by UUID REFERENCES public.profiles(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issues' AND column_name='rejected_at') THEN
        ALTER TABLE public.issues ADD COLUMN rejected_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issues' AND column_name='rejection_reason') THEN
        ALTER TABLE public.issues ADD COLUMN rejection_reason TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issues' AND column_name='removed_by') THEN
        ALTER TABLE public.issues ADD COLUMN removed_by UUID REFERENCES public.profiles(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issues' AND column_name='removed_at') THEN
        ALTER TABLE public.issues ADD COLUMN removed_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issues' AND column_name='removal_reason') THEN
        ALTER TABLE public.issues ADD COLUMN removal_reason TEXT;
    END IF;
END $$;

-- Migrate existing status 'PUBLISHED' -> 'APPROVED'
UPDATE public.issues SET status = 'APPROVED' WHERE status = 'PUBLISHED';

-- Set default status to PENDING_VERIFICATION and add check constraint
ALTER TABLE public.issues ALTER COLUMN status SET DEFAULT 'PENDING_VERIFICATION';
ALTER TABLE public.issues ADD CONSTRAINT issues_status_check 
    CHECK (status IN ('PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'REMOVED', 'REPORTED', 'ARCHIVED'));

-- 3. Create Moderation History Table (Audit Trail)
CREATE TABLE IF NOT EXISTS public.issue_moderation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    action VARCHAR(30) NOT NULL CHECK (action IN ('SUBMITTED', 'APPROVED', 'REJECTED', 'REMOVED', 'RESTORED')),
    admin_id UUID REFERENCES public.profiles(id),
    admin_name TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_moderation_history ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Public can view own profile or admins view all" ON public.profiles;
CREATE POLICY "Public can view own profile or admins view all" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

-- ISSUES POLICIES
DROP POLICY IF EXISTS "Allow public read on issues" ON public.issues;
CREATE POLICY "Public can read approved issues only" ON public.issues
    FOR SELECT USING (status = 'APPROVED' OR public.is_admin());

DROP POLICY IF EXISTS "Allow public insert on issues" ON public.issues;
CREATE POLICY "Allow public insert on issues" ON public.issues
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can update issues" ON public.issues;
CREATE POLICY "Only admins can update issues" ON public.issues
    FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete issues" ON public.issues;
CREATE POLICY "Only admins can delete issues" ON public.issues
    FOR DELETE USING (public.is_admin());

-- ISSUE VERIFICATION POLICIES (Strict Privacy)
DROP POLICY IF EXISTS "Block public read on verification" ON public.issue_verification;
CREATE POLICY "Only admins can view identity documents" ON public.issue_verification
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Allow public insert on verification" ON public.issue_verification;
CREATE POLICY "Allow public insert on verification" ON public.issue_verification
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can update verification" ON public.issue_verification;
CREATE POLICY "Only admins can update verification" ON public.issue_verification
    FOR UPDATE USING (public.is_admin());

-- ISSUE REPORTS POLICIES
DROP POLICY IF EXISTS "Allow public insert on reports" ON public.issue_reports;
CREATE POLICY "Allow public insert on reports" ON public.issue_reports
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can view reports" ON public.issue_reports;
CREATE POLICY "Only admins can view reports" ON public.issue_reports
    FOR SELECT USING (public.is_admin());

-- CONTACT MESSAGES POLICIES
DROP POLICY IF EXISTS "Allow public insert on contact" ON public.contact_messages;
CREATE POLICY "Allow public insert on contact" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Only admins can view contact messages" ON public.contact_messages
    FOR SELECT USING (public.is_admin());

-- MODERATION HISTORY POLICIES
DROP POLICY IF EXISTS "Only admins can view moderation history" ON public.issue_moderation_history;
CREATE POLICY "Only admins can view moderation history" ON public.issue_moderation_history
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can insert moderation history" ON public.issue_moderation_history;
CREATE POLICY "Only admins can insert moderation history" ON public.issue_moderation_history
    FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);
