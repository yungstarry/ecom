/*
  # Create user cart table

  1. New Tables
    - `user_cart`
      - `user_id` (uuid, primary key)
      - `cart_items` (jsonb)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_cart` table
    - Add policy for authenticated users to manage their own cart
*/

CREATE TABLE IF NOT EXISTS user_cart (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  cart_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_cart ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own cart
CREATE POLICY "Users can manage their own cart"
  ON user_cart
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_cart_user_id ON user_cart(user_id);

-- Add trigger to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_cart_updated_at
    BEFORE UPDATE ON user_cart
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();