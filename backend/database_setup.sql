-- Run this in your Supabase SQL Editor to create the MVP shipments table

CREATE TABLE shipments (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  status text NOT NULL DEFAULT 'On Schedule',
  eta text NOT NULL,
  carrier text NOT NULL,
  sla text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security so companies can only see their own shipments
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own shipments" ON shipments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shipments" ON shipments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shipments" ON shipments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shipments" ON shipments
  FOR DELETE USING (auth.uid() = user_id);

-- Insert some dummy data for testing (Replace the user_id with your actual Supabase auth.users UUID after you sign up in the UI)
-- INSERT INTO shipments (id, user_id, origin, destination, status, eta, carrier, sla) 
-- VALUES ('SO-9999', 'YOUR-UUID-HERE', 'Shanghai Port, CN', 'Long Beach, CA', 'On Schedule', 'Jun 12', 'Maersk', '$18,500');
