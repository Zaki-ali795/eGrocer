-- Fix: add SKUs to avoid UNIQUE constraint on sku column
-- Fruits & Vegetables (category_id = 1)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, nutritional_info, is_perishable, is_active) VALUES
('Organic Baby Spinach (300g)',  'Farm-fresh organic spinach',         1, 'FarmFresh',  'SKU-FV-001', 'bag',   399, 299, 'https://images.unsplash.com/photo-1599660869952-3852916ff82b?w=600', 'High in iron, Rich in vitamins', 1, 1),
('Fresh Carrots Bundle (1kg)',   'Crunchy and sweet fresh carrots',    1, NULL,         'SKU-FV-002', 'kg',    299, NULL,'https://images.unsplash.com/photo-1549248581-cf105cd081f8?w=600', 'Beta-carotene rich, Eye health', 1, 1),
('Premium Mixed Greens',         'Superfood blend, antioxidant rich',  1, 'OrganicFarm','SKU-FV-003', 'bag',   449, 349,'https://images.unsplash.com/photo-1687199126330-556bb3c85b2f?w=600', 'Superfood blend, Antioxidants', 1, 1),
('Fresh Tomatoes (500g)',        'Vine-ripened tomatoes',               1, NULL,         'SKU-FV-004', 'bag',   349, NULL,'https://images.unsplash.com/photo-1606836484371-483e90c5d19a?w=600', 'Lycopene rich, Vitamin C', 1, 1),
('Organic Sweet Peppers (3pk)', 'Colorful sweet bell peppers',         1, 'GreenLeaf',  'SKU-FV-005', 'pack',  599, 499,'https://images.unsplash.com/photo-1573481078935-b9605167e06b?w=600', 'Vitamin packed, Colorful variety', 1, 1),
('Fresh Green Beans (400g)',    'Crisp and tender green beans',         1, NULL,         'SKU-FV-006', 'bag',   329, NULL,'https://images.unsplash.com/photo-1748342319942-223b99937d4e?w=600', 'Fiber rich, Low calorie', 1, 1),
('Organic Grape Tomatoes (250g)','Sweet, bite-sized tomatoes',         1, 'OrganicFarm','SKU-FV-007', 'punnet',499, NULL,'https://images.unsplash.com/photo-1552825896-8059df63a1fb?w=600', 'Sweet flavor, Perfect snacking', 1, 1),
('Fresh Broccoli Crown',         'Nutritious broccoli crown',          1, NULL,         'SKU-FV-008', 'piece', 279, NULL,'https://images.unsplash.com/photo-1681782420230-000e854cdbcb?w=600', 'Vitamin K, Calcium source', 1, 1);

-- Dairy & Eggs (category_id = 2)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_perishable, is_active) VALUES
('Full Cream Milk (1L)',         'Fresh pasteurised full cream milk',  2, 'DairyFarm', 'SKU-DE-001', 'litre', 180, NULL,'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600', 1, 1),
('Free-Range Eggs (12 pack)',    'Farm fresh free-range eggs',         2, 'FarmFresh', 'SKU-DE-002', 'dozen', 349, 299, 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600', 1, 1),
('Greek Yogurt (400g)',          'Creamy full-fat Greek yogurt',       2, 'Chobani',   'SKU-DE-003', 'tub',   299, NULL,'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', 1, 1),
('Cheddar Cheese Block (250g)', 'Aged sharp cheddar cheese',           2, 'Kraft',     'SKU-DE-004', 'block', 499, 449, 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=600', 1, 1);

-- Bakery (category_id = 4)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_perishable, is_active) VALUES
('Sourdough Bread Loaf',         'Artisan sourdough, freshly baked',   4, 'BreadCo',   'SKU-BK-001', 'loaf',  399, NULL,'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=600', 1, 1),
('Whole Wheat Bread',            'Healthy whole wheat sandwich bread',  4, 'Wonderbread','SKU-BK-002','loaf',  299, 249, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', 1, 1),
('Croissants (4 pack)',           'Buttery flaky croissants',           4, 'BreadCo',   'SKU-BK-003', 'pack',  449, NULL,'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600', 1, 1);

-- Beverages (category_id = 5)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_perishable, is_active) VALUES
('Orange Juice (1L)',            'Freshly squeezed orange juice',       5, 'TropicJuice','SKU-BV-001','litre', 249, 199, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600', 1, 1),
('Sparkling Water (6 pack)',     'Natural sparkling mineral water',     5, 'Perrier',   'SKU-BV-002', 'pack',  399, NULL,'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600', 0, 1),
('Green Tea (20 bags)',          'Premium Japanese green tea',          5, 'Lipton',    'SKU-BV-003', 'box',   299, 249, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', 0, 1);

-- Snacks (category_id = 6)
INSERT INTO Products (product_name, description, category_id, brand, sku, unit, base_price, sale_price, image_url, is_perishable, is_active) VALUES
('Mixed Nuts (250g)',            'Premium roasted mixed nuts',          6, 'NutFarm',   'SKU-SN-001', 'bag',   549, 499,'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', 0, 1),
('Dark Chocolate Bar (100g)',    'Rich 70% dark chocolate',             6, 'Lindt',     'SKU-SN-002', 'bar',   299, NULL,'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=600', 0, 1);

-- =============================================
-- Seed: Inventory for all products without one
-- =============================================
INSERT INTO Inventory (product_id, quantity_in_stock, reorder_level)
SELECT p.product_id,
       FLOOR(RAND(CHECKSUM(NEWID())) * 100 + 10),
       10
FROM Products p
LEFT JOIN Inventory i ON p.product_id = i.product_id
WHERE i.inventory_id IS NULL;

-- =============================================
-- Seed: Dummy User and Address for Order Testing
-- =============================================
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'testuser@egrocer.com')
BEGIN
    INSERT INTO Users (email, password_hash, first_name, last_name, phone, user_type)
    VALUES ('testuser@egrocer.com', 'dummyhash123', 'John', 'Doe', '1234567890', 'customer');

    DECLARE @NewUserId INT = SCOPE_IDENTITY();

    INSERT INTO Addresses (user_id, address_type, full_name, phone, address_line1, city, state, postal_code, is_default)
    VALUES (@NewUserId, 'home', 'John Doe', '0300-1234567', '123 Main Street', 'Apt 4B', 'Lahore', 'Punjab', '54000', 1);

-- =============================================
-- Flash Deals
-- =============================================
INSERT INTO FlashDeals (deal_name, description, product_id, discount_percentage, deal_price, start_datetime, end_datetime, max_quantity, sold_quantity, is_active, created_by)
VALUES
    ('Organic Apples Deal', 'Fresh crisp apples', 1, 20.00, 239.20, GETDATE(), DATEADD(hour, 4, GETDATE()), 50, 15, 1, 1),
    ('Avocado Super Deal', 'Premium imported avocados', 2, 30.00, 629.30, GETDATE(), DATEADD(hour, 2, GETDATE()), 30, 22, 1, 1),
    ('Spinach Fresh Cut', 'Locally sourced spinach', 3, 15.00, 339.15, GETDATE(), DATEADD(hour, 6, GETDATE()), 40, 5, 1, 1);

END

PRINT 'Products and inventory seeded successfully!';
