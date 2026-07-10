-- ============================================
-- JobPrep AI — Initial Database Schema
-- ============================================
-- Run this migration in your Supabase SQL Editor.
-- This creates the tables for user profiles and
-- progress tracking. NO resume data is stored.

-- ============================================
-- 1. Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. Prep Sessions
-- ============================================
-- A session is created each time a user submits
-- a job description + context for analysis.
-- NOTE: Resume text is NOT stored here.
CREATE TABLE IF NOT EXISTS prep_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    job_description TEXT NOT NULL,
    user_context TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prep_sessions_user_id
    ON prep_sessions(user_id);

-- ============================================
-- 3. Prep Plans
-- ============================================
-- The structured preparation plan (JSON) generated
-- by the Prep Plan agent.
CREATE TABLE IF NOT EXISTS prep_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES prep_sessions(id) ON DELETE CASCADE,
    plan_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prep_plans_session_id
    ON prep_plans(session_id);

-- ============================================
-- 4. Topic Progress
-- ============================================
-- Tracks per-topic completion status within a plan.
CREATE TYPE topic_status AS ENUM ('not_started', 'in_progress', 'completed');

CREATE TABLE IF NOT EXISTS topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES prep_plans(id) ON DELETE CASCADE,
    topic_key TEXT NOT NULL,
    status topic_status DEFAULT 'not_started',
    updated_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(plan_id, topic_key)
);

CREATE INDEX IF NOT EXISTS idx_topic_progress_plan_id
    ON topic_progress(plan_id);

-- ============================================
-- 5. Updated_at Trigger
-- ============================================
-- Auto-update the updated_at column on row changes.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_topic_progress_updated_at
    BEFORE UPDATE ON topic_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. Row Level Security (placeholder)
-- ============================================
-- RLS will be enabled when auth is configured.
-- For now, tables are accessible via service role key.
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE prep_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE prep_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
