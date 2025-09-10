/*
  # Complete Social Dating App Database Schema

  1. New Tables
    - `profiles` - User profiles with all personal information
    - `user_photos` - Multiple photos per user
    - `user_interests` - User interests and hobbies
    - `spotify_data` - Spotify integration data
    - `instagram_data` - Instagram integration data
    - `matches` - User matches and compatibility scores
    - `likes` - User likes/passes tracking
    - `events` - Social events and parties
    - `event_attendees` - Event participation tracking
    - `conversations` - Chat conversations
    - `messages` - Chat messages
    - `user_locations` - Real-time location tracking
    - `notifications` - Push notifications
    - `reports` - User reports and safety
    - `blocks` - Blocked users

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    - Implement safety and privacy controls

  3. Features
    - Complete user profiles with verification
    - Advanced matching algorithm data
    - Real-time chat system
    - Event management system
    - Location-based features
    - Safety and reporting system
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 18 AND age <= 100),
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'non-binary', 'other')),
  bio text,
  location_city text,
  location_country text,
  location_coordinates geography(POINT, 4326),
  is_verified boolean DEFAULT false,
  is_online boolean DEFAULT false,
  last_active timestamptz DEFAULT now(),
  looking_for text DEFAULT 'both' CHECK (looking_for IN ('dating', 'friends', 'both')),
  age_range_min integer DEFAULT 18,
  age_range_max integer DEFAULT 50,
  max_distance integer DEFAULT 50,
  interested_in text[] DEFAULT '{}',
  show_distance boolean DEFAULT true,
  show_online_status boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User photos
CREATE TABLE IF NOT EXISTS user_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  is_primary boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- User interests
CREATE TABLE IF NOT EXISTS user_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  interest text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, interest)
);

-- Spotify integration data
CREATE TABLE IF NOT EXISTS spotify_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  spotify_id text,
  access_token text,
  refresh_token text,
  top_artists jsonb DEFAULT '[]',
  top_genres jsonb DEFAULT '[]',
  top_tracks jsonb DEFAULT '[]',
  playlists jsonb DEFAULT '[]',
  recently_played jsonb DEFAULT '[]',
  music_taste_vector vector(100), -- For advanced matching
  last_synced timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Instagram integration data
CREATE TABLE IF NOT EXISTS instagram_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  instagram_id text,
  username text,
  access_token text,
  photos jsonb DEFAULT '[]',
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  bio text,
  last_synced timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Likes/Passes tracking
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  liked_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('like', 'pass', 'super_like')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(liker_id, liked_id)
);

-- Matches
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  compatibility_overall integer DEFAULT 0,
  compatibility_music integer DEFAULT 0,
  compatibility_interests integer DEFAULT 0,
  compatibility_location integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'unmatched', 'blocked')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id != user2_id)
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_type text NOT NULL CHECK (event_type IN ('party', 'casual', 'sports', 'cultural', 'food', 'nightlife', 'other')),
  location_address text NOT NULL,
  location_venue text,
  location_coordinates geography(POINT, 4326),
  event_date date NOT NULL,
  event_time time NOT NULL,
  max_attendees integer,
  age_range_min integer DEFAULT 18,
  age_range_max integer DEFAULT 100,
  is_private boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  photos text[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event attendees
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'interested' CHECK (status IN ('interested', 'going', 'not_going')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  is_slow_chat boolean DEFAULT true,
  slow_chat_delay integer DEFAULT 30, -- minutes
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'event_invite', 'spotify_track')),
  metadata jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  can_reply boolean DEFAULT true,
  next_reply_time timestamptz,
  created_at timestamptz DEFAULT now()
);

-- User locations (for real-time location tracking)
CREATE TABLE IF NOT EXISTS user_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  coordinates geography(POINT, 4326) NOT NULL,
  accuracy float,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('match', 'message', 'like', 'event_invite', 'event_reminder', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reports (safety feature)
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (reason IN ('inappropriate_content', 'harassment', 'fake_profile', 'spam', 'other')),
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at timestamptz DEFAULT now()
);

-- Blocks
CREATE TABLE IF NOT EXISTS blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST (location_coordinates);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON profiles (age);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles (last_active);
CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON user_photos (user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON user_interests (user_id);
CREATE INDEX IF NOT EXISTS idx_likes_liker_id ON likes (liker_id);
CREATE INDEX IF NOT EXISTS idx_likes_liked_id ON likes (liked_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON matches (user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON matches (user2_id);
CREATE INDEX IF NOT EXISTS idx_events_location ON events USING GIST (location_coordinates);
CREATE INDEX IF NOT EXISTS idx_events_date ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees (event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees (user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations (user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_coordinates ON user_locations USING GIST (coordinates);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE spotify_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view other profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User photos policies
CREATE POLICY "Anyone can view user photos" ON user_photos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own photos" ON user_photos FOR ALL TO authenticated USING (auth.uid() = user_id);

-- User interests policies
CREATE POLICY "Anyone can view user interests" ON user_interests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own interests" ON user_interests FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Spotify data policies
CREATE POLICY "Users can view own spotify data" ON spotify_data FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own spotify data" ON spotify_data FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Instagram data policies
CREATE POLICY "Users can view own instagram data" ON instagram_data FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own instagram data" ON instagram_data FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can view likes involving them" ON likes FOR SELECT TO authenticated 
  USING (auth.uid() = liker_id OR auth.uid() = liked_id);
CREATE POLICY "Users can create likes" ON likes FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = liker_id);

-- Matches policies
CREATE POLICY "Users can view their matches" ON matches FOR SELECT TO authenticated 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "System can create matches" ON matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update match status" ON matches FOR UPDATE TO authenticated 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Events policies
CREATE POLICY "Anyone can view active events" ON events FOR SELECT TO authenticated 
  USING (status = 'active' AND (NOT is_private OR creator_id = auth.uid()));
CREATE POLICY "Users can create events" ON events FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own events" ON events FOR UPDATE TO authenticated 
  USING (auth.uid() = creator_id);

-- Event attendees policies
CREATE POLICY "Anyone can view event attendees" ON event_attendees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own event attendance" ON event_attendees FOR ALL TO authenticated 
  USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view their conversations" ON conversations FOR SELECT TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM matches m 
    WHERE m.id = match_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  ));
CREATE POLICY "System can create conversations" ON conversations FOR INSERT TO authenticated WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM conversations c 
    JOIN matches m ON c.match_id = m.id 
    WHERE c.id = conversation_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  ));
CREATE POLICY "Users can send messages in their conversations" ON messages FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM conversations c 
    JOIN matches m ON c.match_id = m.id 
    WHERE c.id = conversation_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  ));

-- User locations policies
CREATE POLICY "Users can view nearby user locations" ON user_locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own location" ON user_locations FOR ALL TO authenticated 
  USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Users can create reports" ON reports FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view own reports" ON reports FOR SELECT TO authenticated 
  USING (auth.uid() = reporter_id);

-- Blocks policies
CREATE POLICY "Users can view own blocks" ON blocks FOR SELECT TO authenticated 
  USING (auth.uid() = blocker_id);
CREATE POLICY "Users can create blocks" ON blocks FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Users can remove own blocks" ON blocks FOR DELETE TO authenticated 
  USING (auth.uid() = blocker_id);

-- Functions for advanced features

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(lat1 float, lon1 float, lat2 float, lon2 float)
RETURNS float AS $$
BEGIN
  RETURN ST_Distance(
    ST_GeogFromText('POINT(' || lon1 || ' ' || lat1 || ')'),
    ST_GeogFromText('POINT(' || lon2 || ' ' || lat2 || ')')
  ) / 1000; -- Convert to kilometers
END;
$$ LANGUAGE plpgsql;

-- Function to get potential matches
CREATE OR REPLACE FUNCTION get_potential_matches(user_id uuid, limit_count integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  name text,
  age integer,
  bio text,
  distance float,
  compatibility_score integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.age,
    p.bio,
    CASE 
      WHEN p.location_coordinates IS NOT NULL AND up.location_coordinates IS NOT NULL
      THEN ST_Distance(p.location_coordinates, up.location_coordinates) / 1000
      ELSE NULL
    END as distance,
    COALESCE(
      (SELECT COUNT(*) * 10 FROM user_interests ui1 
       JOIN user_interests ui2 ON ui1.interest = ui2.interest 
       WHERE ui1.user_id = user_id AND ui2.user_id = p.id), 0
    )::integer as compatibility_score
  FROM profiles p
  CROSS JOIN profiles up
  WHERE up.id = user_id
    AND p.id != user_id
    AND p.age BETWEEN up.age_range_min AND up.age_range_max
    AND up.age BETWEEN p.age_range_min AND p.age_range_max
    AND (p.interested_in = '{}' OR up.gender = ANY(p.interested_in))
    AND (up.interested_in = '{}' OR p.gender = ANY(up.interested_in))
    AND NOT EXISTS (SELECT 1 FROM likes l WHERE l.liker_id = user_id AND l.liked_id = p.id)
    AND NOT EXISTS (SELECT 1 FROM blocks b WHERE (b.blocker_id = user_id AND b.blocked_id = p.id) OR (b.blocker_id = p.id AND b.blocked_id = user_id))
    AND (
      p.location_coordinates IS NULL OR up.location_coordinates IS NULL OR
      ST_Distance(p.location_coordinates, up.location_coordinates) / 1000 <= LEAST(p.max_distance, up.max_distance)
    )
  ORDER BY compatibility_score DESC, distance ASC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a match when two users like each other
CREATE OR REPLACE FUNCTION create_match_if_mutual_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if this is a 'like' action
  IF NEW.action = 'like' THEN
    -- Check if the other user has also liked this user
    IF EXISTS (
      SELECT 1 FROM likes 
      WHERE liker_id = NEW.liked_id 
        AND liked_id = NEW.liker_id 
        AND action = 'like'
    ) THEN
      -- Create a match (ensure user1_id < user2_id for consistency)
      INSERT INTO matches (user1_id, user2_id, created_at)
      VALUES (
        LEAST(NEW.liker_id, NEW.liked_id),
        GREATEST(NEW.liker_id, NEW.liked_id),
        now()
      )
      ON CONFLICT (user1_id, user2_id) DO NOTHING;
      
      -- Create a conversation for the match
      INSERT INTO conversations (match_id, created_at)
      SELECT m.id, now()
      FROM matches m
      WHERE m.user1_id = LEAST(NEW.liker_id, NEW.liked_id)
        AND m.user2_id = GREATEST(NEW.liker_id, NEW.liked_id)
      ON CONFLICT DO NOTHING;
      
      -- Create notifications for both users
      INSERT INTO notifications (user_id, type, title, message, data)
      VALUES 
        (NEW.liker_id, 'match', 'New Match!', 'You have a new match!', jsonb_build_object('match_user_id', NEW.liked_id)),
        (NEW.liked_id, 'match', 'New Match!', 'You have a new match!', jsonb_build_object('match_user_id', NEW.liker_id));
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create matches
CREATE TRIGGER trigger_create_match_on_mutual_like
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_if_mutual_like();

-- Function to update user's last active timestamp
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET last_active = now() WHERE id = auth.uid();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to update last active on various actions
CREATE TRIGGER trigger_update_last_active_on_like
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();

CREATE TRIGGER trigger_update_last_active_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();