/*
  # Initial Schema Setup for RevCulture

  1. Tables
    - users (extends auth.users)
    - posts
    - comments
    - likes
    - saved_posts
    - cars
    - events
    - event_attendees

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  description text,
  photos text[] DEFAULT array[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  caption text NOT NULL,
  images text[] DEFAULT array[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.saved_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('meet', 'race', 'cruise', 'show')),
  date timestamptz NOT NULL,
  location text NOT NULL,
  cover_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security
DO $$ 
BEGIN
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

-- Create policies safely
DO $$ 
BEGIN
  -- Profiles Policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;

  -- Cars Policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cars' AND policyname = 'Cars are viewable by everyone'
  ) THEN
    CREATE POLICY "Cars are viewable by everyone" ON public.cars FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cars' AND policyname = 'Users can insert own cars'
  ) THEN
    CREATE POLICY "Users can insert own cars" ON public.cars FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cars' AND policyname = 'Users can update own cars'
  ) THEN
    CREATE POLICY "Users can update own cars" ON public.cars FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Posts Policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Posts are viewable by everyone'
  ) THEN
    CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Users can insert own posts'
  ) THEN
    CREATE POLICY "Users can insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Users can update own posts'
  ) THEN
    CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Comments Policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Comments are viewable by everyone'
  ) THEN
    CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can insert own comments'
  ) THEN
    CREATE POLICY "Users can insert own comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can update own comments'
  ) THEN
    CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Likes Policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'likes' AND policyname = 'Likes are viewable by everyone'
  ) THEN
    CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'likes' AND policyname = 'Users can insert own likes'
  ) THEN
    CREATE POLICY "Users can insert own likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'likes' AND policyname = 'Users can delete own likes'
  ) THEN
    CREATE POLICY "Users can delete own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- Saved Posts Policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'saved_posts' AND policyname = 'Saved posts are viewable by owner'
  ) THEN
    CREATE POLICY "Saved posts are viewable by owner" ON public.saved_posts FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'saved_posts' AND policyname = 'Users can save posts'
  ) THEN
    CREATE POLICY "Users can save posts" ON public.saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'saved_posts' AND policyname = 'Users can unsave posts'
  ) THEN
    CREATE POLICY "Users can unsave posts" ON public.saved_posts FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- Events Policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Events are viewable by everyone'
  ) THEN
    CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Users can create events'
  ) THEN
    CREATE POLICY "Users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Users can update own events'
  ) THEN
    CREATE POLICY "Users can update own events" ON public.events FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Event Attendees Policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_attendees' AND policyname = 'Event attendees are viewable by everyone'
  ) THEN
    CREATE POLICY "Event attendees are viewable by everyone" ON public.event_attendees FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_attendees' AND policyname = 'Users can attend events'
  ) THEN
    CREATE POLICY "Users can attend events" ON public.event_attendees FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_attendees' AND policyname = 'Users can leave events'
  ) THEN
    CREATE POLICY "Users can leave events" ON public.event_attendees FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS likes_post_id_idx ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS saved_posts_user_id_idx ON public.saved_posts(user_id);
CREATE INDEX IF NOT EXISTS cars_user_id_idx ON public.cars(user_id);
CREATE INDEX IF NOT EXISTS events_date_idx ON public.events(date);
CREATE INDEX IF NOT EXISTS event_attendees_event_id_idx ON public.event_attendees(event_id);