
-- =============================================
-- 1. Users Table (Combined all user types)
-- =============================================
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'admin', 'seller')),
    -- Seller specific fields (NULL for customers/admins)
    store_name VARCHAR(255),
    store_description VARCHAR(MAX),
    business_license_number VARCHAR(100),
    store_rating DECIMAL(3,2) DEFAULT 0,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'suspended')),
    -- Common fields
    loyalty_points INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- =============================================
-- 2. Addresses
-- =============================================
CREATE TABLE Addresses (
    address_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    address_type VARCHAR(20) DEFAULT 'home' CHECK (address_type IN ('home', 'work', 'other')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    is_default BIT DEFAULT 0,
    delivery_instructions VARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Address_User FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- =============================================
-- 3. Categories
-- =============================================
CREATE TABLE Categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    description VARCHAR(MAX),
    parent_category_id INT,
    image_url VARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Category_Parent FOREIGN KEY (parent_category_id) REFERENCES Categories(category_id)
);

-- =============================================
-- 4. Products
-- =============================================
CREATE TABLE Products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description VARCHAR(MAX),
    category_id INT NOT NULL,
    brand VARCHAR(255),
    seller_id INT,
    sku VARCHAR(100) UNIQUE,
    unit VARCHAR(50) NOT NULL DEFAULT 'piece',
    base_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    tax_percentage DECIMAL(5,2) DEFAULT 0,
    image_url VARCHAR(500),
    nutritional_info VARCHAR(MAX),
    is_perishable BIT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Product_Category FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    CONSTRAINT FK_Product_Seller FOREIGN KEY (seller_id) REFERENCES Users(user_id)
);

-- =============================================
-- 5. Inventory
-- =============================================
CREATE TABLE Inventory (
    inventory_id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    quantity_in_stock INT NOT NULL DEFAULT 0,
    reorder_level INT DEFAULT 10,
    last_restocked_date DATETIME,
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Inventory_Product FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- =============================================
-- 6. Flash Deals (Fixed - removed computed column with subquery)
-- =============================================
CREATE TABLE FlashDeals (
    deal_id INT IDENTITY(1,1) PRIMARY KEY,
    deal_name VARCHAR(255) NOT NULL,
    description VARCHAR(MAX),
    product_id INT NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL,
    deal_price DECIMAL(10,2), -- Will be calculated in application layer
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    max_quantity INT NOT NULL,
    sold_quantity INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_FlashDeal_Product FOREIGN KEY (product_id) REFERENCES Products(product_id),
    CONSTRAINT FK_FlashDeal_Admin FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

-- =============================================
-- 7. Promo Codes
-- =============================================
CREATE TABLE PromoCodes (
    promo_id INT IDENTITY(1,1) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(MAX),
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    valid_from DATETIME NOT NULL,
    valid_until DATETIME NOT NULL,
    is_active BIT DEFAULT 1,
    created_by INT,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Promo_Admin FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

-- =============================================
-- 8. Cart
-- =============================================
CREATE TABLE Cart (
    cart_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Cart_User FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- =============================================
-- 9. Cart Items
-- =============================================
CREATE TABLE CartItems (
    cart_item_id INT IDENTITY(1,1) PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    is_saved_for_later BIT DEFAULT 0,
    added_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_CartItem_Cart FOREIGN KEY (cart_id) REFERENCES Cart(cart_id) ON DELETE CASCADE,
    CONSTRAINT FK_CartItem_Product FOREIGN KEY (product_id) REFERENCES Products(product_id),
    CONSTRAINT UQ_Cart_Product UNIQUE (cart_id, product_id)
);

-- =============================================
-- 10. Wishlist
-- =============================================
CREATE TABLE Wishlists (
    wishlist_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Wishlist_User FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_Wishlist_Product FOREIGN KEY (product_id) REFERENCES Products(product_id),
    CONSTRAINT UQ_Wishlist_User_Product UNIQUE (user_id, product_id)
);

-- =============================================
-- 11. Product Requests (Customer)
-- =============================================
CREATE TABLE ProductRequests (
    request_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description VARCHAR(MAX),
    category_id INT,
    quantity INT NOT NULL DEFAULT 1,
    max_budget DECIMAL(10,2),
    request_status VARCHAR(20) DEFAULT 'open' CHECK (request_status IN ('open', 'closed', 'fulfilled')),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_ProductRequest_Customer FOREIGN KEY (customer_id) REFERENCES Users(user_id),
    CONSTRAINT FK_ProductRequest_Category FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- =============================================
-- 12. Seller Bids on Requests
-- =============================================
CREATE TABLE ProductRequestBids (
    bid_id INT IDENTITY(1,1) PRIMARY KEY,
    request_id INT NOT NULL,
    seller_id INT NOT NULL,
    product_id INT,
    bid_price DECIMAL(10,2) NOT NULL,
    estimated_delivery_days INT,
    bid_status VARCHAR(20) DEFAULT 'pending' CHECK (bid_status IN ('pending', 'accepted', 'rejected')),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Bid_Request FOREIGN KEY (request_id) REFERENCES ProductRequests(request_id) ON DELETE CASCADE,
    CONSTRAINT FK_Bid_Seller FOREIGN KEY (seller_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Bid_Product FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- =============================================
-- 13. Orders
-- =============================================
CREATE TABLE Orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    shipping_address_id INT NOT NULL,
    billing_address_id INT NOT NULL,
    promo_id INT,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash_on_delivery', 'credit_card', 'debit_card', 'digital_wallet', 'bank_transfer')),
    delivery_instructions VARCHAR(MAX),
    estimated_delivery_date DATETIME,
    actual_delivery_date DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Order_User FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Order_ShippingAddress FOREIGN KEY (shipping_address_id) REFERENCES Addresses(address_id),
    CONSTRAINT FK_Order_BillingAddress FOREIGN KEY (billing_address_id) REFERENCES Addresses(address_id),
    CONSTRAINT FK_Order_Promo FOREIGN KEY (promo_id) REFERENCES PromoCodes(promo_id)
);

-- =============================================
-- 14. Order Items
-- =============================================
CREATE TABLE OrderItems (
    order_item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    seller_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_percentage DECIMAL(5,2) DEFAULT 0,
    deal_discount DECIMAL(10,2) DEFAULT 0,
    is_out_of_stock_alternative BIT DEFAULT 0,
    original_product_id INT,
    CONSTRAINT FK_OrderItem_Order FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItem_Product FOREIGN KEY (product_id) REFERENCES Products(product_id),
    CONSTRAINT FK_OrderItem_Seller FOREIGN KEY (seller_id) REFERENCES Users(user_id),
    CONSTRAINT FK_OrderItem_OriginalProduct FOREIGN KEY (original_product_id) REFERENCES Products(product_id)
);

-- =============================================
-- 15. Order Status History
-- =============================================
CREATE TABLE OrderStatusHistory (
    status_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(MAX),
    updated_by INT,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_StatusHistory_Order FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    CONSTRAINT FK_StatusHistory_User FOREIGN KEY (updated_by) REFERENCES Users(user_id)
);

-- =============================================
-- 16. Invoices
-- =============================================
CREATE TABLE Invoices (
    invoice_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_breakdown VARCHAR(MAX), -- JSON with tax details
    discount_breakdown VARCHAR(MAX), -- JSON with discount details
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(100),
    invoice_url VARCHAR(500),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Invoice_Order FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- =============================================
-- 17. Digital Wallets
-- =============================================
CREATE TABLE DigitalWallets (
    wallet_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Wallet_User FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- =============================================
-- 18. Wallet Transactions
-- =============================================
CREATE TABLE WalletTransactions (
    transaction_id INT IDENTITY(1,1) PRIMARY KEY,
    wallet_id INT NOT NULL,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('credit', 'debit', 'refund', 'topup')),
    amount DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    reference_id INT,
    description VARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_WalletTransaction_Wallet FOREIGN KEY (wallet_id) REFERENCES DigitalWallets(wallet_id) ON DELETE CASCADE
);

-- =============================================
-- 19. Payment Transactions
-- =============================================
CREATE TABLE PaymentTransactions (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    gateway VARCHAR(50) NOT NULL, -- 'stripe', 'jazzcash', 'easypaisa', 'cod'
    transaction_reference VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    tax_benefit_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_PaymentTransaction_Order FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- =============================================
-- 20. Notifications
-- =============================================
CREATE TABLE Notifications (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(MAX) NOT NULL,
    reference_id INT,
    is_read BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Notification_User FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
GO

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX IX_Users_Email ON Users(email);
CREATE INDEX IX_Products_Category ON Products(category_id);
CREATE INDEX IX_Products_Seller ON Products(seller_id);
CREATE INDEX IX_Orders_User ON Orders(user_id);
CREATE INDEX IX_Orders_Status ON Orders(order_status);
CREATE INDEX IX_CartItems_Cart ON CartItems(cart_id);
CREATE INDEX IX_Inventory_Product ON Inventory(product_id);
CREATE INDEX IX_FlashDeals_DateRange ON FlashDeals(start_datetime, end_datetime);
CREATE INDEX IX_PaymentTransactions_Order ON PaymentTransactions(order_id);
CREATE INDEX IX_Notifications_User ON Notifications(user_id, is_read);
GO

-- =============================================
-- Triggers
-- =============================================
CREATE TRIGGER TR_Orders_StatusHistory
ON Orders
AFTER UPDATE
AS
BEGIN
    IF UPDATE(order_status)
    BEGIN
        INSERT INTO OrderStatusHistory (order_id, status, created_at)
        SELECT order_id, order_status, GETDATE()
        FROM inserted
    END
END
GO

CREATE TRIGGER TR_Products_UpdatedAt
ON Products
AFTER UPDATE
AS
BEGIN
    UPDATE Products
    SET updated_at = GETDATE()
    WHERE product_id IN (SELECT product_id FROM inserted)
END
GO

PRINT 'eGrocer Database Schema Created Successfully! (20 Tables)'
GO