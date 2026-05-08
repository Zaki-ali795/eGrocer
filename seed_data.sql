-- =============================================================================
-- eGrocer Seed Data
-- =============================================================================
-- Must be run AFTER DDL_file.sql creates all tables.
-- Inserts: Categories → Users/Customers/Sellers/Admins → Addresses →
--          Products → Inventory → Flash Deals → Promo Codes
-- =============================================================================


-- =============================================
-- 1. Categories
-- =============================================
-- Seeded first because Products depend on category_id FK.
-- =============================================
INSERT INTO Categories (category_name, description, image_url, is_active) VALUES
('Fruits & Vegetables', 'Fresh produce from local farms',                 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600', 1),
('Dairy & Eggs',        'Milk, cheese, yogurt, and farm-fresh eggs',      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600', 1),
('Meat & Seafood',      'Fresh and frozen meats and seafood',              'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600', 1),
('Bakery',              'Freshly baked breads, pastries, and cakes',       'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', 1),
('Beverages',           'Juices, tea, coffee, and sparkling water',        'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600', 1),
('Snacks',              'Nuts, chips, chocolate, and healthy snacks',      'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=600', 1);


-- =============================================
-- 2. Users (Base) + Sub-type Tables
-- =============================================
-- Class Table Inheritance: each user gets a row in Users AND in their
-- role-specific sub-table (Customers, Sellers, or Admins).
-- =============================================

-- Admin user
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'admin@egrocer.com')
BEGIN
    INSERT INTO Users (email, password_hash, first_name, last_name, phone, user_type)
    VALUES ('admin@egrocer.com', 'hashedpassword_admin', 'Admin', 'User', '0300-0000001', 'admin');

    DECLARE @AdminId INT = SCOPE_IDENTITY();

    INSERT INTO Admins (admin_id, role_level, department)
    VALUES (@AdminId, 'super', 'Operations');
END

-- Seller user
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'seller@egrocer.com')
BEGIN
    INSERT INTO Users (email, password_hash, first_name, last_name, phone, user_type)
    VALUES ('seller@egrocer.com', 'hashedpassword_seller', 'Ali', 'Khan', '0300-0000002', 'seller');

    DECLARE @SellerId INT = SCOPE_IDENTITY();

    INSERT INTO Sellers (seller_id, store_name, store_description, business_license_number, store_rating, verification_status)
    VALUES (@SellerId, 'FreshMart', 'Premium quality grocery store with farm-fresh produce', 'BL-2024-00123', 4.50, 'verified');
END

-- Customer user (test user)
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'testuser@egrocer.com')
BEGIN
    INSERT INTO Users (email, password_hash, first_name, last_name, phone, user_type)
    VALUES ('testuser@egrocer.com', 'hashedpassword_customer', 'John', 'Doe', '0300-0000003', 'customer');

    DECLARE @CustomerId INT = SCOPE_IDENTITY();

    INSERT INTO Customers (customer_id, loyalty_points)
    VALUES (@CustomerId, 150);
END

-- Second customer
IF NOT EXISTS (SELECT 1 FROM Users WHERE email = 'jane@egrocer.com')
BEGIN
    INSERT INTO Users (email, password_hash, first_name, last_name, phone, user_type)
    VALUES ('jane@egrocer.com', 'hashedpassword_jane', 'Jane', 'Smith', '0300-0000004', 'customer');

    DECLARE @Customer2Id INT = SCOPE_IDENTITY();

    INSERT INTO Customers (customer_id, loyalty_points)
    VALUES (@Customer2Id, 50);
END


-- =============================================
-- 3. Addresses
-- =============================================
-- Seeded after Users because of user_id FK.
-- =============================================
INSERT INTO Addresses (user_id, address_type, full_name, phone, address_line1, address_line2, city, state, postal_code, is_default)
SELECT user_id, 'home', first_name + ' ' + last_name, phone,
       '123 Main Street', 'Apt 4B', 'Lahore', 'Punjab', '54000', 1
FROM Users WHERE email = 'testuser@egrocer.com';

INSERT INTO Addresses (user_id, address_type, full_name, phone, address_line1, address_line2, city, state, postal_code, is_default)
SELECT user_id, 'home', first_name + ' ' + last_name, phone,
       '456 Garden Town', NULL, 'Islamabad', 'ICT', '44000', 1
FROM Users WHERE email = 'jane@egrocer.com';

INSERT INTO Addresses (user_id, address_type, full_name, phone, address_line1, address_line2, city, state, postal_code, is_default)
SELECT user_id, 'work', first_name + ' ' + last_name, phone,
       '789 Blue Area', 'Floor 3', 'Islamabad', 'ICT', '44000', 0
FROM Users WHERE email = 'jane@egrocer.com';


-- =============================================
-- 4. Products
-- =============================================
-- seller_id is set via subquery to reference the actual Sellers table.
-- =============================================

-- Fruits & Vegetables (category_id = 1)
INSERT INTO Products (product_name, description, category_id, brand, seller_id, sku, unit, base_price, sale_price, image_url, nutritional_info, is_perishable, is_active) VALUES
('Organic Baby Spinach (300g)',   'Farm-fresh organic spinach',        1, 'FarmFresh',   (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-FV-001', 'bag',    399, 299,  'https://images.unsplash.com/photo-1599660869952-3852916ff82b?w=600', 'High in iron, Rich in vitamins',    1, 1),
('Fresh Carrots Bundle (1kg)',    'Crunchy and sweet fresh carrots',   1, NULL,          (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-FV-002', 'kg',     299, NULL, 'https://images.unsplash.com/photo-1549248581-cf105cd081f8?w=600', 'Beta-carotene rich, Eye health',    1, 1),
('Premium Mixed Greens',          'Superfood blend, antioxidant rich', 1, 'OrganicFarm', (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-FV-003', 'bag',    449, 349,  'https://images.unsplash.com/photo-1687199126330-556bb3c85b2f?w=600', 'Superfood blend, Antioxidants',     1, 1),
('Fresh Tomatoes (500g)',         'Vine-ripened tomatoes',              1, NULL,          (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-FV-004', 'bag',    349, NULL, 'https://images.unsplash.com/photo-1606836484371-483e90c5d19a?w=600', 'Lycopene rich, Vitamin C',          1, 1),
('Organic Sweet Peppers (3pk)',   'Colorful sweet bell peppers',        1, 'GreenLeaf',  (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-FV-005', 'pack',   599, 499,  'https://images.unsplash.com/photo-1573481078935-b9605167e06b?w=600', 'Vitamin packed, Colorful variety',  1, 1),
('Fresh Green Beans (400g)',      'Crisp and tender green beans',       1, NULL,          (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-FV-006', 'bag',    329, NULL, 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?w=600', 'Fiber rich, Low calorie',           1, 1),
('Organic Grape Tomatoes (250g)', 'Sweet, bite-sized tomatoes',         1, 'OrganicFarm',(SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-FV-007', 'punnet', 499, NULL, 'https://images.unsplash.com/photo-1552825896-8059df63a1fb?w=600', 'Sweet flavor, Perfect snacking',    1, 1),
('Fresh Broccoli Crown',          'Nutritious broccoli crown',          1, NULL,          (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-FV-008', 'piece',  279, NULL, 'https://images.unsplash.com/photo-1681782420230-000e854cdbcb?w=600', 'Vitamin K, Calcium source',         1, 1);

-- Dairy & Eggs (category_id = 2)
INSERT INTO Products (product_name, description, category_id, brand, seller_id, sku, unit, base_price, sale_price, image_url, is_perishable, is_active) VALUES
('Full Cream Milk (1L)',          'Fresh pasteurised full cream milk',  2, 'DairyFarm', (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-DE-001', 'litre', 180, NULL, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600', 1, 1),
('Free-Range Eggs (12 pack)',     'Farm fresh free-range eggs',         2, 'FarmFresh', (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-DE-002', 'dozen', 349, 299,  'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600', 1, 1),
('Greek Yogurt (400g)',           'Creamy full-fat Greek yogurt',       2, 'Chobani',   (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-DE-003', 'tub',   299, NULL, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', 1, 1),
('Cheddar Cheese Block (250g)',   'Aged sharp cheddar cheese',          2, 'Kraft',     (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-DE-004', 'block', 499, 449,  'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=600', 1, 1);

-- Bakery (category_id = 4)
INSERT INTO Products (product_name, description, category_id, brand, seller_id, sku, unit, base_price, sale_price, image_url, is_perishable, is_active) VALUES
('Sourdough Bread Loaf',          'Artisan sourdough, freshly baked',   4, 'BreadCo',    (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-BK-001', 'loaf', 399, NULL, 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=600', 1, 1),
('Whole Wheat Bread',             'Healthy whole wheat sandwich bread',  4, 'Wonderbread',(SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-BK-002', 'loaf', 299, 249,  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', 1, 1),
('Croissants (4 pack)',            'Buttery flaky croissants',           4, 'BreadCo',    (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-BK-003', 'pack', 449, NULL, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600', 1, 1);

-- Beverages (category_id = 5)
INSERT INTO Products (product_name, description, category_id, brand, seller_id, sku, unit, base_price, sale_price, image_url, is_perishable, is_active) VALUES
('Orange Juice (1L)',             'Freshly squeezed orange juice',       5, 'TropicJuice',(SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-BV-001', 'litre', 249, 199,  'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600', 1, 1),
('Sparkling Water (6 pack)',      'Natural sparkling mineral water',     5, 'Perrier',    (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-BV-002', 'pack',  399, NULL, 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600', 0, 1),
('Green Tea (20 bags)',           'Premium Japanese green tea',          5, 'Lipton',     (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-BV-003', 'box',   299, 249,  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', 0, 1);

-- Snacks (category_id = 6)
INSERT INTO Products (product_name, description, category_id, brand, seller_id, sku, unit, base_price, sale_price, image_url, is_perishable, is_active) VALUES
('Mixed Nuts (250g)',             'Premium roasted mixed nuts',          6, 'NutFarm',    (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-SN-001', 'bag', 549, 499,  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', 0, 1),
('Dark Chocolate Bar (100g)',     'Rich 70% dark chocolate',             6, 'Lindt',      (SELECT seller_id FROM Sellers WHERE store_name = 'FreshMart'), 'SKU-SN-002', 'bar', 299, NULL, 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=600', 0, 1);


-- =============================================
-- 5. Inventory (auto-seed for all products)
-- =============================================
INSERT INTO Inventory (product_id, quantity_in_stock, reorder_level)
SELECT p.product_id,
       FLOOR(RAND(CHECKSUM(NEWID())) * 100 + 10),
       10
FROM Products p
LEFT JOIN Inventory i ON p.product_id = i.product_id
WHERE i.inventory_id IS NULL;


-- =============================================
-- 6. Flash Deals (created by admin)
-- =============================================
-- created_by now references Admins(admin_id), so we look up the admin.
-- =============================================
INSERT INTO FlashDeals (deal_name, description, product_id, discount_percentage, deal_price, start_datetime, end_datetime, max_quantity, sold_quantity, is_active, created_by)
VALUES
    ('Organic Spinach Deal',  'Fresh crisp spinach',           1, 20.00, 319.20, GETDATE(), DATEADD(hour, 4, GETDATE()), 50, 15, 1, (SELECT TOP 1 admin_id FROM Admins)),
    ('Carrots Super Deal',    'Premium fresh carrots',         2, 30.00, 209.30, GETDATE(), DATEADD(hour, 2, GETDATE()), 30, 22, 1, (SELECT TOP 1 admin_id FROM Admins)),
    ('Mixed Greens Special',  'Locally sourced mixed greens',  3, 15.00, 381.65, GETDATE(), DATEADD(hour, 6, GETDATE()), 40,  5, 1, (SELECT TOP 1 admin_id FROM Admins));


-- =============================================
-- 7. Promo Codes (created by admin)
-- =============================================
INSERT INTO PromoCodes (code, description, discount_type, discount_value, minimum_order_amount, max_discount_amount, usage_limit, used_count, valid_from, valid_until, is_active, created_by)
VALUES
    ('WELCOME10', 'Welcome discount for new customers', 'percentage', 10.00, 500, 200, 100, 12, GETDATE(), DATEADD(month, 1, GETDATE()), 1, (SELECT TOP 1 admin_id FROM Admins)),
    ('FLAT50',    'Flat Rs. 50 off on orders above 1000', 'fixed_amount', 50.00, 1000, NULL, 50, 5, GETDATE(), DATEADD(month, 1, GETDATE()), 1, (SELECT TOP 1 admin_id FROM Admins));


-- =============================================
-- 8. Sample Order + Delivery (demonstrates SRP split)
-- =============================================
-- Order holds financial data; Delivery holds logistics data.
-- This demonstrates the clean separation — one INSERT for each concern.
-- =============================================
DECLARE @TestCustomerId INT = (SELECT TOP 1 customer_id FROM Customers);
DECLARE @TestAddressId INT = (SELECT TOP 1 address_id FROM Addresses WHERE user_id = @TestCustomerId);
DECLARE @TestPromoId INT = (SELECT TOP 1 promo_id FROM PromoCodes WHERE code = 'WELCOME10');

-- Insert the order (commercial/financial only — no delivery details here)
INSERT INTO Orders (order_number, customer_id, billing_address_id, promo_id, subtotal, discount_amount, tax_amount, order_status, payment_status, payment_method)
VALUES ('ORD-2024-0001', @TestCustomerId, @TestAddressId, @TestPromoId, 1247.00, 124.70, 56.12, 'confirmed', 'paid', 'digital_wallet');

DECLARE @TestOrderId INT = SCOPE_IDENTITY();

-- Insert the delivery (logistics only — no pricing or payment info here)
INSERT INTO Deliveries (order_id, shipping_address_id, delivery_fee, delivery_status, delivery_instructions, estimated_delivery_date)
VALUES (@TestOrderId, @TestAddressId, 99.00, 'pending', 'Ring the bell twice', DATEADD(day, 2, GETDATE()));

-- Insert order items
INSERT INTO OrderItems (order_id, product_id, seller_id, quantity, unit_price, tax_percentage)
VALUES
    (@TestOrderId, 1, (SELECT TOP 1 seller_id FROM Sellers), 2, 299.00, 5.00),
    (@TestOrderId, 9, (SELECT TOP 1 seller_id FROM Sellers), 1, 180.00, 5.00),
    (@TestOrderId, 14, (SELECT TOP 1 seller_id FROM Sellers), 1, 399.00, 5.00);


PRINT 'eGrocer seed data inserted successfully!';
GO
