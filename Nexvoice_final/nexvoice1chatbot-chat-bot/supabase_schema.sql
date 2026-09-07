-- ============================================================
-- NexVoice v1.0 - Supabase Database Schema & Storage Setup
-- ============================================================

-- 1. Create Issues Table
CREATE TABLE IF NOT EXISTS public.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_number VARCHAR(20) NOT NULL UNIQUE,
    submission_type VARCHAR(30) NOT NULL CHECK (submission_type IN ('STUDENT', 'INSTITUTION_REPRESENTATIVE')),
    name VARCHAR(150) NOT NULL,
    institution_name VARCHAR(200) NOT NULL,
    education_level VARCHAR(100),
    program VARCHAR(150),
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    student_id VARCHAR(100),
    institution_id VARCHAR(100),
    role VARCHAR(100),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    location VARCHAR(200),
    is_anonymous BOOLEAN DEFAULT true,
    status VARCHAR(30) DEFAULT 'PUBLISHED' CHECK (status IN ('PUBLISHED', 'REPORTED', 'ARCHIVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Issue Verification Table (Private Data)
CREATE TABLE IF NOT EXISTS public.issue_verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    document_path TEXT NOT NULL,
    verification_status VARCHAR(30) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Issue Reports Table
CREATE TABLE IF NOT EXISTS public.issue_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR ISSUES
-- Public can READ published issues
CREATE POLICY "Allow public read on issues" ON public.issues
    FOR SELECT USING (status = 'PUBLISHED' OR status = 'REPORTED');

-- Public can INSERT issues
CREATE POLICY "Allow public insert on issues" ON public.issues
    FOR INSERT WITH CHECK (true);

-- RLS POLICIES FOR ISSUE VERIFICATION (Strict Privacy)
-- Public CANNOT SELECT, UPDATE, or DELETE identity verification details
CREATE POLICY "Block public read on verification" ON public.issue_verification
    FOR SELECT USING (false);

-- Public can INSERT verification details during issue submission
CREATE POLICY "Allow public insert on verification" ON public.issue_verification
    FOR INSERT WITH CHECK (true);

-- RLS POLICIES FOR REPORTS
CREATE POLICY "Allow public insert on reports" ON public.issue_reports
    FOR INSERT WITH CHECK (true);

-- RLS POLICIES FOR CONTACT MESSAGES
CREATE POLICY "Allow public insert on contact" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- STORAGE BUCKET SETUP FOR IDENTITY DOCUMENTS
-- Execute in Supabase SQL editor or Dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('identity-documents', 'identity-documents', false);
