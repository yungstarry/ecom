/*
  # Create products table and sample data

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `images` (text array)
      - `sizes` (text array)
      - `colors` (text array)
      - `stock` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access
    - Add policy for admin write access
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  images text[] NOT NULL,
  sizes text[] NOT NULL,
  colors text[] NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Insert sample products
INSERT INTO products (name, description, price, category, images, sizes, colors, stock) VALUES
(
  'Classic White Shirt',
  'A timeless white cotton shirt perfect for any occasion. Features a slim fit design and premium cotton fabric.',
  89.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?w=800'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['White'],
  50
),
(
  'Leather Crossbody Bag',
  'Elegant leather crossbody bag with gold hardware. Perfect size for everyday essentials.',
  199.99,
  'accessories',
  ARRAY['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800'],
  ARRAY['One Size'],
  ARRAY['Black', 'Brown', 'Tan'],
  30
),
(
  'Silk Evening Dress',
  'Stunning silk evening dress with a flowing silhouette and subtle shimmer.',
  299.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'https://images.unsplash.com/photo-1583391733956-6c78276eedc7?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Navy', 'Burgundy', 'Emerald'],
  25
);