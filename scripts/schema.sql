-- ═══════════════════════════════════════════════════════════
-- FORM & MEANING — Database Schema
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Memberships (main member table)
CREATE TABLE IF NOT EXISTS memberships (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  discipline TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  portfolio TEXT DEFAULT '',
  paid BOOLEAN DEFAULT FALSE,
  admin_approved BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscribers (email list for non-members)
CREATE TABLE IF NOT EXISTS subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications (legacy — kept for historical data)
CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  portfolio TEXT DEFAULT '',
  role TEXT DEFAULT '',
  why_join TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content (library items: videos, resources, documents)
CREATE TABLE IF NOT EXISTS content (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('conference', 'recording', 'resource')),
  speaker TEXT DEFAULT '',
  day INTEGER,
  mux_playback_id TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  format TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date DATE NOT NULL,
  time TEXT DEFAULT '',
  type TEXT DEFAULT 'Workshop' CHECK (type IN ('Workshop', 'Q&A', 'Masterclass', 'Conference')),
  host TEXT DEFAULT '',
  host_role TEXT DEFAULT '',
  spots INTEGER,
  location TEXT DEFAULT 'Google Meet (link shared after RSVP)',
  topics TEXT[] DEFAULT '{}',
  has_recording BOOLEAN DEFAULT FALSE,
  recording_content_id BIGINT REFERENCES content(id),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE IF NOT EXISTS event_rsvps (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, email)
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  pinned BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- Enable Row Level Security (RLS) 
-- ═══════════════════════════════════════════════════════════

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (our API routes use service role)
-- Authenticated users can read their own membership
CREATE POLICY "Users can read own membership" ON memberships FOR SELECT USING (auth.jwt() ->> 'email' = email);
CREATE POLICY "Service role full access memberships" ON memberships FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access subscribers" ON subscribers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access applications" ON applications FOR ALL USING (auth.role() = 'service_role');

-- Content: authenticated users can read published content
CREATE POLICY "Authenticated users read published content" ON content FOR SELECT USING (auth.role() = 'authenticated' AND status = 'published');
CREATE POLICY "Service role full access content" ON content FOR ALL USING (auth.role() = 'service_role');

-- Events: authenticated users can read
CREATE POLICY "Authenticated users read events" ON events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service role full access events" ON events FOR ALL USING (auth.role() = 'service_role');

-- RSVPs: users can manage their own
CREATE POLICY "Users manage own rsvps" ON event_rsvps FOR ALL USING (auth.jwt() ->> 'email' = email);
CREATE POLICY "Service role full access rsvps" ON event_rsvps FOR ALL USING (auth.role() = 'service_role');

-- Announcements: authenticated can read published
CREATE POLICY "Authenticated users read announcements" ON announcements FOR SELECT USING (auth.role() = 'authenticated' AND status = 'published');
CREATE POLICY "Service role full access announcements" ON announcements FOR ALL USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════
-- Seed initial content (conference videos)
-- ═══════════════════════════════════════════════════════════

INSERT INTO content (title, type, speaker, day, mux_playback_id, status, description) VALUES
  ('The Problem You Were Hired to Solve', 'conference', 'Mannorr', 1, '', 'published', 'The foundational talk. Before you design anything, understand the real problem.'),
  ('Creative Integrity in Practice', 'conference', 'Petra & Thizkid', 2, '', 'published', 'A candid conversation about designing with integrity when the client wants speed.'),
  ('Systems That Scale Your Thinking', 'conference', 'Dexios', 3, '', 'published', 'Building repeatable processes that make your best work your standard work.')
ON CONFLICT DO NOTHING;

INSERT INTO content (title, type, speaker, format, status, description) VALUES
  ('Problem-Solving Framework', 'resource', 'Form & Meaning', 'PDF', 'published', 'Questions that force clarity before execution.'),
  ('Systems Checklist', 'resource', 'Form & Meaning', 'PDF', 'published', 'Document your process so quality becomes repeatable.'),
  ('Leadership Notes', 'resource', 'Form & Meaning', 'PDF', 'published', 'What happens when a creative has to lead.'),
  ('Brand Thinking Workbook', 'resource', 'Form & Meaning', 'PDF', 'draft', 'A workbook for thinking about brands with intention.')
ON CONFLICT DO NOTHING;
