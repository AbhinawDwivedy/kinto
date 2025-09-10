/*
  # Complete Dating App Schema - No Restrictions

  1. Core Tables
    - Enhanced profiles with all dating app features
    - Advanced matching system
    - Real-time features
    - Media handling
    - Safety features

  2. Advanced Features
    - Video profiles
    - Voice messages
    - Story system
    - Advanced filters
    - Premium features
    - Boost system
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Profiles table with all features
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 18),
  gender text NOT NULL,
  bio text,
  height integer, -- in cm
  education text,
  job_title text,
  company text,
  school text,
  location_city text,
  location_country text,
  location_coordinates geography(POINT),
  looking_for text DEFAULT 'both', -- dating, friends, both
  relationship_status text DEFAULT 'single',
  children text DEFAULT 'none', -- none, have, want, dont_want
  smoking text DEFAULT 'never', -- never, socially, regularly
  drinking text DEFAULT 'socially', -- never, socially, regularly
  religion text,
  political_views text,
  languages text[],
  
  -- Preferences
  age_range_min integer DEFAULT 18,
  age_range_max integer DEFAULT 50,
  max_distance integer DEFAULT 50,
  interested_in text[] DEFAULT '{}',
  
  -- Premium features
  is_premium boolean DEFAULT false,
  premium_expires_at timestamptz,
  boost_expires_at timestamptz,
  super_likes_remaining integer DEFAULT 1,
  
  -- Verification
  is_verified boolean DEFAULT false,
  is_online boolean DEFAULT false,
  last_active timestamptz DEFAULT now(),
  
  -- Privacy
  show_distance boolean DEFAULT true,
  show_age boolean DEFAULT true,
  show_online_status boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User photos with advanced features
CREATE TABLE IF NOT EXISTS user_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  is_primary boolean DEFAULT false,
  order_index integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Video profiles
CREATE TABLE IF NOT EXISTS user_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  video_url text NOT NULL,
  thumbnail_url text,
  duration integer, -- in seconds
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User interests and hobbies
CREATE TABLE IF NOT EXISTS user_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  interest text NOT NULL,
  category text, -- music, sports, travel, food, etc.
  created_at timestamptz DEFAULT now()
);

-- Spotify integration
CREATE TABLE IF NOT EXISTS spotify_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  spotify_id text UNIQUE,
  access_token text,
  refresh_token text,
  top_artists text[],
  top_genres text[],
  top_tracks text[],
  playlists jsonb,
  recently_played text[],
  last_synced timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Instagram integration
CREATE TABLE IF NOT EXISTS instagram_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  instagram_username text,
  access_token text,
  photos text[],
  followers_count integer,
  following_count integer,
  last_synced timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Advanced matching system
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  liked_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL, -- like, pass, super_like
  is_boost boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(liker_id, liked_id)
);

-- Matches with compatibility scores
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  compatibility_score integer DEFAULT 0,
  music_compatibility integer DEFAULT 0,
  interests_compatibility integer DEFAULT 0,
  location_compatibility integer DEFAULT 0,
  status text DEFAULT 'active', -- active, unmatched, blocked
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  is_slow_chat boolean DEFAULT false,
  slow_chat_delay integer DEFAULT 30, -- minutes
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Messages with advanced features
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text,
  message_type text DEFAULT 'text', -- text, image, voice, video, gif, sticker
  media_url text,
  is_read boolean DEFAULT false,
  next_reply_time timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Events system
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_type text NOT NULL, -- party, casual, sports, cultural, food, nightlife
  location_address text NOT NULL,
  location_venue text,
  location_coordinates geography(POINT),
  event_date date NOT NULL,
  event_time time NOT NULL,
  max_attendees integer,
  age_range_min integer DEFAULT 18,
  age_range_max integer DEFAULT 100,
  is_private boolean DEFAULT false,
  status text DEFAULT 'active', -- active, cancelled, completed
  tags text[],
  photos text[],
  created_at timestamptz DEFAULT now()
);

-- Event attendees
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'interested', -- interested, going, not_going
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Stories system (like Instagram/Snapchat)
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  media_url text NOT NULL,
  media_type text NOT NULL, -- image, video
  caption text,
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Story views
CREATE TABLE IF NOT EXISTS story_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  viewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(story_id, viewer_id)
);

-- User locations for real-time tracking
CREATE TABLE IF NOT EXISTS user_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  coordinates geography(POINT) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Notifications system
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL, -- match, message, like, super_like, event_invite
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reports and safety
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending', -- pending, reviewed, resolved
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

-- Premium features tracking
CREATE TABLE IF NOT EXISTS premium_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  feature_type text NOT NULL, -- premium, boost, super_likes
  amount decimal(10,2),
  currency text DEFAULT 'USD',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Dating prompts/questions
CREATE TABLE IF NOT EXISTS dating_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt text NOT NULL,
  category text, -- personality, lifestyle, fun, deep
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User prompt responses
CREATE TABLE IF NOT EXISTS user_prompt_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id uuid REFERENCES dating_prompts(id) ON DELETE CASCADE,
  response text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST (location_coordinates);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON profiles (age);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles (last_active);
CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON user_photos (user_id);
CREATE INDEX IF NOT EXISTS idx_user_photos_primary ON user_photos (user_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_likes_liker ON likes (liker_id);
CREATE INDEX IF NOT EXISTS idx_likes_liked ON likes (liked_id);
CREATE INDEX IF NOT EXISTS idx_matches_users ON matches (user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_events_location ON events USING GIST (location_coordinates);
CREATE INDEX IF NOT EXISTS idx_events_date ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_stories_user_active ON stories (user_id, is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications (user_id, is_read);

-- Insert sample dating prompts
INSERT INTO dating_prompts (prompt, category) VALUES
('What''s your idea of a perfect first date?', 'lifestyle'),
('If you could have dinner with anyone, who would it be?', 'fun'),
('What''s something you''re passionate about?', 'personality'),
('What''s your biggest goal right now?', 'deep'),
('What''s your favorite way to spend a weekend?', 'lifestyle'),
('What''s something that always makes you laugh?', 'fun'),
('What''s a skill you''d love to learn?', 'personality'),
('What''s your love language?', 'deep'),
('What''s your go-to karaoke song?', 'fun'),
('What''s something you''re proud of?', 'personality');

-- Advanced matching function
CREATE OR REPLACE FUNCTION get_potential_matches(
  user_id uuid,
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  age integer,
  distance numeric,
  compatibility_score integer,
  photos text[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.age,
    COALESCE(
      ST_Distance(
        up.location_coordinates,
        (SELECT location_coordinates FROM profiles WHERE profiles.id = user_id)
      ) / 1000, -- Convert to kilometers
      999999
    ) as distance,
    COALESCE(
      (
        -- Music compatibility (40%)
        CASE 
          WHEN sd1.top_genres IS NOT NULL AND sd2.top_genres IS NOT NULL THEN
            (array_length(sd1.top_genres & sd2.top_genres, 1) * 40 / GREATEST(array_length(sd1.top_genres, 1), 1))
          ELSE 0
        END +
        -- Interest compatibility (35%)
        CASE 
          WHEN ui1.interests IS NOT NULL AND ui2.interests IS NOT NULL THEN
            (array_length(ui1.interests & ui2.interests, 1) * 35 / GREATEST(array_length(ui1.interests, 1), 1))
          ELSE 0
        END +
        -- Location compatibility (25%)
        CASE 
          WHEN up.location_coordinates IS NOT NULL THEN
            GREATEST(0, 25 - (ST_Distance(up.location_coordinates, user_loc.location_coordinates) / 1000 / 2))
          ELSE 0
        END
      ), 0
    )::integer as compatibility_score,
    COALESCE(
      array_agg(ph.photo_url ORDER BY ph.is_primary DESC, ph.order_index),
      '{}'::text[]
    ) as photos
  FROM profiles p
  LEFT JOIN profiles up ON up.id = user_id
  LEFT JOIN user_locations user_loc ON user_loc.user_id = user_id AND user_loc.is_active = true
  LEFT JOIN spotify_data sd1 ON sd1.user_id = p.id
  LEFT JOIN spotify_data sd2 ON sd2.user_id = user_id
  LEFT JOIN (
    SELECT user_id, array_agg(interest) as interests
    FROM user_interests
    GROUP BY user_id
  ) ui1 ON ui1.user_id = p.id
  LEFT JOIN (
    SELECT user_id, array_agg(interest) as interests
    FROM user_interests
    GROUP BY user_id
  ) ui2 ON ui2.user_id = user_id
  LEFT JOIN user_photos ph ON ph.user_id = p.id
  WHERE p.id != user_id
    AND p.id NOT IN (
      SELECT liked_id FROM likes WHERE liker_id = user_id
      UNION
      SELECT blocked_id FROM blocks WHERE blocker_id = user_id
      UNION
      SELECT blocker_id FROM blocks WHERE blocked_id = user_id
    )
    AND p.age BETWEEN 
      (SELECT age_range_min FROM profiles WHERE id = user_id) AND 
      (SELECT age_range_max FROM profiles WHERE id = user_id)
    AND (
      SELECT interested_in FROM profiles WHERE id = user_id
    ) @> ARRAY[p.gender]
    AND p.interested_in @> ARRAY[(SELECT gender FROM profiles WHERE id = user_id)]
  GROUP BY p.id, p.name, p.age, up.location_coordinates, user_loc.location_coordinates, sd1.top_genres, sd2.top_genres, ui1.interests, ui2.interests
  ORDER BY compatibility_score DESC, distance ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to create matches when mutual like occurs
CREATE OR REPLACE FUNCTION check_and_create_match()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this creates a mutual like
  IF EXISTS (
    SELECT 1 FROM likes 
    WHERE liker_id = NEW.liked_id 
    AND liked_id = NEW.liker_id 
    AND action = 'like'
  ) THEN
    -- Create match
    INSERT INTO matches (user1_id, user2_id, created_at)
    VALUES (
      LEAST(NEW.liker_id, NEW.liked_id),
      GREATEST(NEW.liker_id, NEW.liked_id),
      now()
    )
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
    
    -- Create conversation
    INSERT INTO conversations (match_id, created_at)
    SELECT m.id, now()
    FROM matches m
    WHERE (m.user1_id = LEAST(NEW.liker_id, NEW.liked_id) AND m.user2_id = GREATEST(NEW.liker_id, NEW.liked_id))
    ON CONFLICT DO NOTHING;
    
    -- Create notifications for both users
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES 
      (NEW.liker_id, 'match', 'New Match!', 'You have a new match!', jsonb_build_object('user_id', NEW.liked_id)),
      (NEW.liked_id, 'match', 'New Match!', 'You have a new match!', jsonb_build_object('user_id', NEW.liker_id));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic match creation
DROP TRIGGER IF EXISTS trigger_check_match ON likes;
CREATE TRIGGER trigger_check_match
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION check_and_create_match();

-- Function to clean up expired stories
CREATE OR REPLACE FUNCTION cleanup_expired_stories()
RETURNS void AS $$
BEGIN
  UPDATE stories 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
END;
$$ LANGUAGE plpgsql;