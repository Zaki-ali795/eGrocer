-- =============================================
-- Insert Pakistani Products (ID will auto-generate)
-- =============================================
INSERT INTO Categories (category_name, description, image_url, is_active) VALUES
('Pantry','Buy best quality goods','https://walkerwoodworking.com/wp-content/uploads/2025/06/Pantry-storage-hidden-pass-through-Walker-Woodworking-custom-cabinets-dirty-kitchen-kitchen-design-pantry-design.jpg',1),
('Frozen items','Enjoy Frozen items with delicious taste','https://static.vecteezy.com/system/resources/thumbnails/074/446/656/small/frozen-foods-displayed-in-a-commercial-refrigerator-showcasing-colorful-packaging-and-frosty-textures-photo.jpeg',1);
-- BAKERY (category_id = 4)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_active, nutritional_info, is_perishable)
VALUES 
('Barfi', 'Sweet Barfi made with original ghee', 4, 'Local Bakery', 'PK-BAK-001', 'kg', 200.00, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYUbnXPCHEtFKaNB6Hp-8TRAlPlvhcI14n4EUxxs-BfeHHe_rSPPRsyqF9nL9RPyDuvxsKdzDtAsukaWl3zhpd_YJTgjJUGugGYtkuRw&s=10', 1, 'High sugar, ghee based', 1),
('Gulab Jaman', 'Traditional Pakistani sweet made with pure ghee', 4, 'Local Bakery', 'PK-BAK-002', 'kg', 230.00, NULL, 'https://www.cadburydessertscorner.com/hubfs/dc-website-2022/articles/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know.webp', 1, 'High sugar, milk solids', 1),
('Gajar ka Halwa', 'Made with pure organic milk, ghee, and sugar', 4, 'Local Bakery', 'PK-BAK-003', 'kg', 190.00, NULL, 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/11/gajar-halwa-carrot-halwa.jpg', 1, 'Carrot based dessert', 1);

-- DAIRY & EGGS (category_id = 2)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_active, nutritional_info, is_perishable)
VALUES 
('Brown Eggs', 'Brown eggs, good for health and diet', 2, 'Farm Fresh', 'PK-DE-005', 'dozen', 230.00, NULL, 'https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg', 1, 'High protein', 1),
('Olper Milk', 'Full cream milk', 2, 'Olper', 'PK-DE-006', 'litre', 300.00, NULL, 'https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg', 1, 'Rich in calcium', 1),
('Dairy Pure', 'Tea whitener, adds taste to tea', 2, 'Dairy Pure', 'PK-DE-007', 'litre', 250.00, NULL, 'https://static.tossdown.com/images/b2d74299-956d-433d-bab3-7798098f1985.webp', 1, 'Tea whitener', 1);

-- SNACKS (category_id = 6)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_active, nutritional_info, is_perishable)
VALUES 
('Knorr Noodles', 'Noodles for adults and children, ready in 2 minutes', 6, 'Knorr', 'PK-SN-003', 'pack', 60.00, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZrIeLeVGHnxus46rubDJqxodDmVxtlHQ-_g&s', 1, 'Instant noodles', 0),
('Lays Chips', 'Light snack, enjoyable while watching movies', 6, 'Lays', 'PK-SN-004', 'pack', 70.00, NULL, 'https://springs.com.pk/cdn/shop/files/8964002346929.png?v=1747844887', 1, 'Potato chips', 0),
('Slanty (120g)', 'Tangy salted pretzel sticks', 6, 'Slanty', 'PK-SN-005', 'pack', 80.00, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkDgzOoRrtCkAQTUaTpWihJjXLtut2vd8Dng&s', 1, 'Pretzel snack', 0);

-- PANTRY (category_id = 7) - Spices
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_active, nutritional_info, is_perishable)
VALUES 
('Shan Bombay Biryani Masala', 'Premium masala for Bombay Biryani', 7, 'Shan', 'PK-SP-001', 'gram', 100.00, NULL, 'https://arysahulatbazar.pk/wp-content/uploads/2024/05/1119333-1.jpg', 1, 'Spice mix', 0),
('Shan Karahi Masala', 'Authentic masala for chicken/mutton karahi', 7, 'Shan', 'PK-SP-002', 'gram', 120.00, NULL, 'https://www.shanfoods.com/wp-content/uploads/2016/11/karahi-2.png', 1, 'Spice mix', 0),
('Shan Achar Gosht Masala', 'Special masala for pickled meat curry', 7, 'Shan', 'PK-SP-003', 'gram', 120.00, NULL, 'https://media.naheed.pk/catalog/product/cache/2f2d0cb0c5f92580479e8350be94f387/1/1/1119324-1.jpg', 1, 'Spice mix', 0);

-- HOUSEHOLD & CLEANING (category_id = 7)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_active, nutritional_info, is_perishable)
VALUES 
('Crockery Set', 'Common household crockery for daily use', 7, 'Local', 'PK-HH-001', 'set', 600.00, NULL, 'https://m.media-amazon.com/images/I/41kKtm3up9L.jpg', 1, 'Ceramic', 0),
('Harpic', 'Toilet and floor cleaner', 7, 'Harpic', 'PK-CL-001', 'ml', 650.00, NULL, 'https://afzalwholesaler.com/cdn/shop/files/harpic-blue_303caae7-730e-4133-b7fe-105183e748bb.jpg?v=1706011222', 1, 'Cleaning liquid', 0),
('Max Long Bar', 'Lemon dishwashing bar, cleans dishes efficiently', 7, 'Max', 'PK-CL-002', 'gram', 90.00, NULL, 'https://www.box.com.pk:4006/assets/product/dk1wIWkOZp1vClVGxOJQPU3FGDzOyd7P_1727698719711.jpg', 1, 'Dish soap', 0),
('Sirf Excel', 'Premium Unilever laundry detergent', 7, 'Sirf Excel', 'PK-CL-003', 'gram', 90.00, NULL, 'https://www.hkarimbuksh.com/cdn/shop/Product/5_12c50271-24eb-4da5-9375-a23141e214d4_1024x.jpg?v=1630133856', 1, 'Laundry detergent', 0);

-- MEAT & SEAFOOD (category_id = 3)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_active, nutritional_info, is_perishable)
VALUES 
('Mutton (1 kg)', 'Halal mutton with no unnecessary additives', 3, 'Local Butcher', 'PK-MT-001', 'kg', 2000.00, NULL, 'https://www.tayyib.pk/cdn/shop/Product/deluxe-mutton-mix-1-kg-234136.jpg?v=1746270268&width=480', 1, 'High protein', 1),
('Chicken (1 kg)', 'Halal chicken dismantled by experts', 3, 'K&N''s', 'PK-MT-002', 'kg', 800.00, NULL, 'https://images.immediate.co.uk/production/volatile/sites/30/2025/06/Step-2-79305f0.jpg?quality=90&fit=700,466', 1, 'Lean protein', 1),
('Beef (500g)', 'Halal beef', 3, 'Local Butcher', 'PK-MT-003', '500g', 800.00, NULL, 'https://www.dukeshill.co.uk/cdn/shop/files/Diced_Beef.png?v=1740006211', 1, 'High iron', 1);

-- FROZEN FOODS (category_id = 8)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_active, nutritional_info, is_perishable)
VALUES 
('Crispy Chicken Strips', 'Halal boneless chicken strips with spices', 8, 'Sabroso', 'PK-FZ-001', 'kg', 1500.00, NULL, 'https://shopsabroso.pk/cdn/shop/files/Crispy-Chicken-Strips-copy_eab1fc73-eca0-4292-ad86-305ed1499228.jpg?v=1721731097', 1, 'Chicken, wheat flour, spices', 1),
('Gola Kabab', 'Halal chicken kababs with mint and ginger', 8, 'Sabroso', 'PK-FZ-002', 'kg', 1000.00, NULL, 'https://shopsabroso.pk/cdn/shop/files/Gola-copy_a552d1c7-136e-4431-bec6-b37f1be5e7f0.jpg?v=1721731017', 1, 'Chicken kababs', 1),
('Shami Kabab', 'Halal chicken shami kababs', 8, 'Sabroso', 'PK-FZ-003', 'kg', 900.00, NULL, 'https://shopsabroso.pk/cdn/shop/files/8964001541486.jpg?v=1729594436', 1, 'Chicken kababs', 1);

-- FRUITS & VEGETABLES (category_id = 1)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_active, nutritional_info, is_perishable)
VALUES 
('Kinnow (Mandarin)', 'Fresh Pakistani kinnow, sweet and juicy', 1, 'Local Farm', 'PK-FV-009', 'kg', 150.00, NULL, 'https://example.com/kinnow.jpg', 1, 'Rich in Vitamin C', 1),
('Kashmiri Apples', 'Crisp red Kashmiri apples', 1, 'Kashmir', 'PK-FV-010', 'kg', 250.00, NULL, 'https://example.com/apples.jpg', 1, 'High fiber', 1),
('Bananas', 'Ripe yellow bananas', 1, 'Local', 'PK-FV-011', 'dozen', 120.00, NULL, 'https://example.com/bananas.jpg', 1, 'Rich in potassium', 1),
('Potatoes', 'Fresh white potatoes', 1, 'Local', 'PK-FV-012', 'kg', 80.00, NULL, 'https://example.com/potatoes.jpg', 1, 'High carbohydrates', 1),
('Onions', 'Fresh red onions', 1, 'Local', 'PK-FV-013', 'kg', 100.00, NULL, 'https://example.com/onions.jpg', 1, 'Low calorie', 1),
('Tomatoes', 'Ripe red tomatoes', 1, 'Local', 'PK-FV-014', 'kg', 120.00, NULL, 'https://example.com/tomatoes.jpg', 1, 'Rich in lycopene', 1);
--------------------------------------

INSERT INTO Inventory (product_id, quantity_in_stock, reorder_level, last_restocked_date)
SELECT product_id, 500, 50, GETDATE()
FROM Products 
WHERE product_id NOT IN (SELECT product_id FROM Inventory);
-------------------------------
--correcting images
update Products
set image_url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoHi0tpxjgSZvS5QkPC16xLs0v-DaliFoftQ&s'
where product_id=38
-----
update Products
set image_url='https://media.post.rvohealth.io/wp-content/uploads/2020/09/Do_Apples_Affect_Diabetes_and_Blood_Sugar_Levels-732x549-thumbnail-1-732x549.jpg'
where product_id=37
--------------
update Products
set image_url='https://qne.com.pk/cdn/shop/files/orgsize_21091WhatsApp_20Image_202024-07-15_20at_2011.55.33_20AM.jpg?v=1752236124'
where product_id=25
-----------
update Products
set image_url='https://cdn.mos.cms.futurecdn.net/iC7HBvohbJqExqvbKcV3pP.jpg'
where product_id=39
----------
update Products
set image_url='https://images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg'
where product_id=41
---------
update Products
set image_url='https://cdn.britannica.com/24/174524-050-A851D3F2/Oranges.jpg'
where product_id=36
--------------

update Products
set image_url='https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/article_thumbnails/BigBead/onions_bigbead/1800x1200_onions_bigbead.jpg'
where product_id=40

update Products
set image_url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqBGIu8TIaGrdDHacYLQYwxOoHjNRGkBlYXQ&s'
where product_id=32
-- =============================================
-- Flash Deals with EXISTING Product IDs (1-62)
-- =============================================

INSERT INTO FlashDeals (deal_name, description, product_id, discount_percentage, deal_price, start_datetime, end_datetime, max_quantity, sold_quantity, is_active, created_by, created_at)
VALUES 
-- 1. Bakery Deal - Barfi (product_id = 29) ? EXISTS
('Sweet Treats Sale', 'Enjoy 30% off on traditional Barfi', 29, 30.00, 140.00, GETDATE(), DATEADD(day, 7, GETDATE()), 100, 0, 1, 1, GETDATE()),

-- 2. Dairy Deal - Brown Eggs (product_id = 44) ? EXISTS
('Dairy Delight', 'Fresh brown eggs at special price', 44, 15.00, 195.50, GETDATE(), DATEADD(day, 7, GETDATE()), 200, 0, 1, 1, GETDATE()),

-- 3. Snacks Deal - Knorr Noodles (product_id = 47) ? EXISTS
('Snack Lovers', 'Knorr noodles at 25% discount', 47, 25.00, 45.00, GETDATE(), DATEADD(day, 15, GETDATE()), 500, 0, 1, 1, GETDATE()),

-- 4. Spices Deal - Shan Bombay Biryani (product_id = 50) ? EXISTS
('Shan Biryani Festival', 'Bombay Biryani masala on sale', 50, 20.00, 80.00, GETDATE(), DATEADD(day, 15, GETDATE()), 200, 0, 1, 1, GETDATE()),

-- 5. Meat Deal - Chicken (product_id = 58) ? EXISTS
('Fresh Chicken Offer', 'Halal chicken at best price', 58, 15.00, 680.00, GETDATE(), DATEADD(day, 5, GETDATE()), 100, 0, 1, 1, GETDATE()),

-- 6. Frozen Deal - Crispy Chicken Strips (product_id = 60) ? EXISTS
('Frozen Special', 'Crispy chicken strips 25% off', 60, 25.00, 1125.00, GETDATE(), DATEADD(day, 14, GETDATE()), 80, 0, 1, 1, GETDATE()),

-- 7. Another Snack Deal - Lays Chips (product_id = 48) ? EXISTS
('Chips Mania', 'Lays chips at 20% off', 48, 20.00, 56.00, GETDATE(), DATEADD(day, 10, GETDATE()), 300, 0, 1, 1, GETDATE()),

-- 8. Cleaning Deal - Harpic (product_id = 54) ? EXISTS
('Home Cleaning Offer', 'Harpic toilet cleaner 15% off', 54, 15.00, 552.50, GETDATE(), DATEADD(day, 12, GETDATE()), 150, 0, 1, 1, GETDATE());