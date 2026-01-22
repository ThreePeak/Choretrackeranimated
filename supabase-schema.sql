-- Supabase Database Schema for Chore Tracker App
-- Run this in your Supabase SQL Editor: https://nakodrfbtvjelfvrdchd.supabase.co

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Members table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    avatar TEXT,
    bio TEXT,
    preferred_chores TEXT[],
    skill_levels JSONB DEFAULT '{}',
    total_xp INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chores table
CREATE TABLE chores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT,
    xp INTEGER NOT NULL DEFAULT 10,
    est_minutes INTEGER NOT NULL DEFAULT 30,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert', 'master')),
    skill TEXT CHECK (skill IN ('cleaning', 'cooking', 'maintenance', 'pet-care', 'outdoor')),
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chore completion logs
CREATE TABLE chore_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chore_id UUID REFERENCES chores(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    is_manual BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Member achievements
CREATE TABLE member_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    progress DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(member_id, achievement_id)
);

-- Create indexes for performance
CREATE INDEX idx_chore_logs_member ON chore_logs(member_id);
CREATE INDEX idx_chore_logs_chore ON chore_logs(chore_id);
CREATE INDEX idx_chore_logs_timestamp ON chore_logs(timestamp DESC);
CREATE INDEX idx_member_achievements_member ON member_achievements(member_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chores_updated_at BEFORE UPDATE ON chores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully! Tables: members, chores, chore_logs, member_achievements';
END $$;
