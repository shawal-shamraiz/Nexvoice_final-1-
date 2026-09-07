-- ============================================================
-- NexVoice v3.0 - Database Migration & RLS Security Schema
-- ============================================================

-- 1. Create Issue Reactions Table
CREATE TABLE IF NOT EXISTS public.issue_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    anonymous_id VARCHAR(100) NOT NULL,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('LIKE', 'HEART', 'SAD', 'ANGRY', 'CLAP')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_issue_user_reaction UNIQUE (issue_id, anonymous_id, reaction_type)
);

-- 2. Create Issue Comments Table
CREATE TABLE IF NOT EXISTS public.issue_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    author_name VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'VISIBLE' CHECK (status IN ('VISIBLE', 'HIDDEN', 'REMOVED')),
    likes_count INT DEFAULT 0,
    reports_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Comment Reactions Table
CREATE TABLE IF NOT EXISTS public.comment_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES public.issue_comments(id) ON DELETE CASCADE,
    anonymous_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_comment_user_reaction UNIQUE (comment_id, anonymous_id)
);

-- 4. Update / Create Content Reports Table
-- Ensure issue_reports table supports both issues and comments, and moderation status
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issue_reports' AND column_name='comment_id') THEN
        ALTER TABLE public.issue_reports ADD COLUMN comment_id UUID REFERENCES public.issue_comments(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issue_reports' AND column_name='reporter_id') THEN
        ALTER TABLE public.issue_reports ADD COLUMN reporter_id VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issue_reports' AND column_name='status') THEN
        ALTER TABLE public.issue_reports ADD COLUMN status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issue_reports' AND column_name='reviewed_by') THEN
        ALTER TABLE public.issue_reports ADD COLUMN reviewed_by UUID REFERENCES public.profiles(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='issue_reports' AND column_name='reviewed_at') THEN
        ALTER TABLE public.issue_reports ADD COLUMN reviewed_at TIMESTAMPTZ;
    END IF;
END $$;

-- Make issue_id nullable if reporting a comment specifically
ALTER TABLE public.issue_reports ALTER COLUMN issue_id DROP NOT NULL;

-- 5. Create Issue Similarities & Duplicates Tables
CREATE TABLE IF NOT EXISTS public.issue_similarities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    similar_issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_issue_similarity_pair UNIQUE (issue_id, similar_issue_id)
);

CREATE TABLE IF NOT EXISTS public.issue_duplicates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    potential_duplicate_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    duplicate_score FLOAT NOT NULL,
    review_status VARCHAR(30) DEFAULT 'PENDING' CHECK (review_status IN ('PENDING', 'CONFIRMED', 'DISMISSED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_issue_duplicate_pair UNIQUE (issue_id, potential_duplicate_id)
);

-- Enable RLS on new tables
ALTER TABLE public.issue_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_similarities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_duplicates ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR REACTIONS
DROP POLICY IF EXISTS "Allow public read on reactions" ON public.issue_reactions;
CREATE POLICY "Allow public read on reactions" ON public.issue_reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert reactions" ON public.issue_reactions;
CREATE POLICY "Allow public insert reactions" ON public.issue_reactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete own reactions" ON public.issue_reactions;
CREATE POLICY "Allow public delete own reactions" ON public.issue_reactions FOR DELETE USING (true);

-- RLS POLICIES FOR COMMENTS
DROP POLICY IF EXISTS "Allow public read on visible comments" ON public.issue_comments;
CREATE POLICY "Allow public read on visible comments" ON public.issue_comments
    FOR SELECT USING (status = 'VISIBLE' OR public.is_admin());

DROP POLICY IF EXISTS "Allow public insert comments" ON public.issue_comments;
CREATE POLICY "Allow public insert comments" ON public.issue_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can update comments" ON public.issue_comments;
CREATE POLICY "Only admins can update comments" ON public.issue_comments FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete comments" ON public.issue_comments;
CREATE POLICY "Only admins can delete comments" ON public.issue_comments FOR DELETE USING (public.is_admin());

-- RLS POLICIES FOR COMMENT REACTIONS
DROP POLICY IF EXISTS "Allow public read on comment reactions" ON public.comment_reactions;
CREATE POLICY "Allow public read on comment reactions" ON public.comment_reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert comment reactions" ON public.comment_reactions;
CREATE POLICY "Allow public insert comment reactions" ON public.comment_reactions FOR INSERT WITH CHECK (true);

-- RLS POLICIES FOR SIMILARITIES & DUPLICATES
DROP POLICY IF EXISTS "Allow public read on similarities" ON public.issue_similarities;
CREATE POLICY "Allow public read on similarities" ON public.issue_similarities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can view duplicates" ON public.issue_duplicates;
CREATE POLICY "Only admins can view duplicates" ON public.issue_duplicates FOR SELECT USING (public.is_admin());
