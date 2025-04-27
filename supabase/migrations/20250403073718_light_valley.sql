/*
  # Add more products and enhance schema

  1. Changes
    - Add more sample products to cover different categories
    - Add diverse price ranges, sizes, and colors
*/

-- Insert additional products
INSERT INTO products (name, description, price, category, images, sizes, colors, stock) VALUES
(
  'Premium Wool Coat',
  'Luxurious wool blend coat with a modern cut and exceptional warmth. Perfect for cold weather with style.',
  399.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1544736779-4ee395ca222b?w=800', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Camel'],
  35
),(
  'Premium Wool Coat',
  'Luxurious wool blend coat with a modern cut and exceptional warmth. Perfect for cold weather with style.',
  399.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1544736779-4ee395ca222b?w=800', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Camel'],
  35
),(
  'Premium Wool Coat',
  'Luxurious wool blend coat with a modern cut and exceptional warmth. Perfect for cold weather with style.',
  399.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1544736779-4ee395ca222b?w=800', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Camel'],
  35
),(
  'Premium Wool Coat',
  'Luxurious wool blend coat with a modern cut and exceptional warmth. Perfect for cold weather with style.',
  399.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1544736779-4ee395ca222b?w=800', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Camel'],
  35
),(
  'Premium Wool Coat',
  'Luxurious wool blend coat with a modern cut and exceptional warmth. Perfect for cold weather with style.',
  399.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1544736779-4ee395ca222b?w=800', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Camel'],
  35
),(
  'Premium Wool Coat',
  'Luxurious wool blend coat with a modern cut and exceptional warmth. Perfect for cold weather with style.',
  399.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1544736779-4ee395ca222b?w=800', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Camel'],
  35
),(
  'Premium Wool Coat',
  'Luxurious wool blend coat with a modern cut and exceptional warmth. Perfect for cold weather with style.',
  399.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1544736779-4ee395ca222b?w=800', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Camel'],
  35
),(
  'Premium Wool Coat',
  'Luxurious wool blend coat with a modern cut and exceptional warmth. Perfect for cold weather with style.',
  399.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1544736779-4ee395ca222b?w=800', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Camel'],
  35
),
(
  'Designer Sunglasses',
  'Elegant designer sunglasses with UV protection and premium acetate frames.',
  249.99,
  'accessories',
  ARRAY['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', 'https://images.unsplash.com/photo-1565589669579-6b55a2c9b983?w=800'],
  ARRAY['One Size'],
  ARRAY['Black', 'Tortoise', 'Gold'],
  50
),
(
  'Cashmere Sweater',
  'Ultra-soft cashmere sweater with ribbed details and a relaxed fit.',
  299.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Cream', 'Gray', 'Black'],
  40
),
(
  'Leather Oxford Shoes',
  'Hand-crafted leather oxford shoes with Goodyear welted soles.',
  349.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800', 'https://images.unsplash.com/photo-1614252370352-c4c70e01b2c9?w=800'],
  ARRAY['40', '41', '42', '43', '44', '45'],
  ARRAY['Black', 'Brown', 'Burgundy'],
  30
),
(
  'Silk Scarf',
  'Luxurious silk scarf with hand-rolled edges and artistic print.',
  159.99,
  'accessories',
  ARRAY['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800', 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=800'],
  ARRAY['One Size'],
  ARRAY['Multi', 'Blue', 'Red'],
  60
),
(
  'Tailored Blazer',
  'Sophisticated wool blend blazer with modern cut and subtle details.',
  449.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Gray'],
  25
),
(
  'Premium Denim Jeans',
  'High-quality selvedge denim jeans with perfect fit and comfort.',
  199.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'],
  ARRAY['30', '32', '34', '36'],
  ARRAY['Indigo', 'Black', 'Light Wash'],
  45
),
(
  'Leather Wallet',
  'Full-grain leather wallet with multiple card slots and coin pocket.',
  129.99,
  'accessories',
  ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800'],
  ARRAY['One Size'],
  ARRAY['Black', 'Brown', 'Tan'],
  75
),
(
  'Evening Clutch',
  'Elegant evening clutch with gold-tone hardware and chain strap.',
  179.99,
  'accessories',
  ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'],
  ARRAY['One Size'],
  ARRAY['Black', 'Gold', 'Silver'],
  40
),
(
  'Merino Wool Sweater',
  'Fine merino wool sweater with classic design and excellent warmth.',
  189.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800', 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Navy', 'Gray', 'Green'],
  50
),
(
  'Silk Blouse',
  'Elegant silk blouse with subtle details and flowing silhouette.',
  229.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['White', 'Black', 'Blush'],
  35
),
(
  'Leather Belt',
  'Premium leather belt with classic buckle design.',
  89.99,
  'accessories',
  ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
  ARRAY['S', 'M', 'L'],
  ARRAY['Black', 'Brown'],
  60
),
(
  'Cashmere Scarf',
  'Luxuriously soft cashmere scarf with classic design.',
  149.99,
  'accessories',
  ARRAY['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800', 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800'],
  ARRAY['One Size'],
  ARRAY['Gray', 'Camel', 'Black'],
  45
),
(
  'Leather Boots',
  'Premium leather boots with durable construction and classic style.',
  299.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800'],
  ARRAY['36', '37', '38', '39', '40'],
  ARRAY['Black', 'Brown'],
  30
),
(
  'Wool Dress Pants',
  'Tailored wool dress pants with perfect drape and fit.',
  199.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
  ARRAY['30', '32', '34', '36'],
  ARRAY['Gray', 'Navy', 'Black'],
  40
),
(
  'Designer Watch',
  'Elegant designer watch with Swiss movement and sapphire crystal.',
  599.99,
  'accessories',
  ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
  ARRAY['One Size'],
  ARRAY['Silver', 'Gold', 'Rose Gold'],
  20
),
(
  'Silk Dress',
  'Luxurious silk dress with modern cut and elegant design.',
  399.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Black', 'Navy', 'Red'],
  25
),
(
  'Leather Messenger Bag',
  'Premium leather messenger bag with multiple compartments.',
  349.99,
  'accessories',
  ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
  ARRAY['One Size'],
  ARRAY['Brown', 'Black'],
  30
),
(
  'Cashmere Coat',
  'Luxurious cashmere coat with modern silhouette.',
  799.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800', 'https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Camel', 'Black', 'Gray'],
  15
),
),
(
  'Cashmere Coat',
  'Luxurious cashmere coat with modern silhouette.',
  799.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800', 'https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Camel', 'Black', 'Gray'],
  15
),
),
(
  'Cashmere Coat',
  'Luxurious cashmere coat with modern silhouette.',
  799.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800', 'https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Camel', 'Black', 'Gray'],
  15
),
),
(
  'Cashmere Coat',
  'Luxurious cashmere coat with modern silhouette.',
  799.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800', 'https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Camel', 'Black', 'Gray'],
  15
),
),
(
  'Cashmere Coat',
  'Luxurious cashmere coat with modern silhouette.',
  799.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800', 'https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Camel', 'Black', 'Gray'],
  15
),
),
(
  'Cashmere Coat',
  'Luxurious cashmere coat with modern silhouette.',
  799.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800', 'https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Camel', 'Black', 'Gray'],
  15
),
),
(
  'Cashmere Coat',
  'Luxurious cashmere coat with modern silhouette.',
  799.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800', 'https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Camel', 'Black', 'Gray'],
  15
),
),
(
  'Cashmere Coat',
  'Luxurious cashmere coat with modern silhouette.',
  799.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800', 'https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Camel', 'Black', 'Gray'],
  15
),
),
(
  'Cashmere Coat',
  'Luxurious cashmere coat with modern silhouette.',
  799.99,
  'women',
  ARRAY['https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800', 'https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Camel', 'Black', 'Gray'],
  15
),
(
  'Silk Tie',
  'Premium silk tie with classic pattern.',
  89.99,
  'men',
  ARRAY['https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800', 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800'],
  ARRAY['One Size'],
  ARRAY['Navy', 'Burgundy', 'Gray'],
  50
);