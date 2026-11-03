-- ============================================================
-- Smart Printing Shop - Oracle schema
-- Built from the ER/schema diagram + the queries in index.js.
-- Run as the app user (printapp), e.g.:
--   sqlplus printapp/PrintPass123@//localhost:1521/XEPDB1 @schema.sql
-- ============================================================
SET DEFINE OFF
SET SQLBLANKLINES ON

-- ---------- Object type used by SHOPOWNER.shop_owner_name ----------
-- index.js inserts NameObj(:firstname, :lastname) and reads
-- TREAT(shop_owner_name AS NAMEOBJ).FIRSTNAME / .LASTNAME
CREATE OR REPLACE TYPE NameObj AS OBJECT (
  FirstName VARCHAR2(50),
  LastName  VARCHAR2(50)
);
/

-- ---------- CUSTOMERS ----------
CREATE TABLE customers (
  cust_id    VARCHAR2(20)  PRIMARY KEY,
  cust_name  VARCHAR2(100) NOT NULL,
  cust_phone VARCHAR2(20),
  cust_email VARCHAR2(120) NOT NULL UNIQUE,
  cust_pass  VARCHAR2(200) NOT NULL
);

-- (in the diagram; the app stores the phone in CUSTOMERS.cust_phone)
CREATE TABLE customer_phone (
  customer_phone_no VARCHAR2(20) PRIMARY KEY,
  cust_id           VARCHAR2(20) NOT NULL REFERENCES customers(cust_id) ON DELETE CASCADE
);

-- ---------- SHOP ----------
CREATE TABLE shop (
  shop_id                VARCHAR2(20)  PRIMARY KEY,
  shop_name              VARCHAR2(120) NOT NULL,
  shop_location_district VARCHAR2(80),
  shop_location_city     VARCHAR2(80),
  shop_location_area     VARCHAR2(80),
  shop_active_hours      VARCHAR2(100),
  shop_image             BLOB,
  order_queue            NUMBER DEFAULT 0
);

-- ---------- SHOPOWNER ----------
-- shop_id is NULL at sign-up; it is filled in after the owner creates a shop.
CREATE TABLE shopowner (
  shop_owner_id    VARCHAR2(30) PRIMARY KEY,
  shop_owner_name  NameObj,
  shop_owner_email VARCHAR2(120) NOT NULL UNIQUE,
  shop_owner_pass  VARCHAR2(200) NOT NULL,
  shop_id          VARCHAR2(20) REFERENCES shop(shop_id) ON DELETE SET NULL
);

-- index.js: INSERT INTO ShopOwnerPhone VALUES (:shop_owner_id, :phone)  -> column order matters
CREATE TABLE shopownerphone (
  shop_owner_id       VARCHAR2(30) NOT NULL REFERENCES shopowner(shop_owner_id) ON DELETE CASCADE,
  shop_owner_phone_no VARCHAR2(20) NOT NULL,
  PRIMARY KEY (shop_owner_id, shop_owner_phone_no)
);

-- ---------- SERVICE ----------
CREATE TABLE service (
  service_id                    VARCHAR2(20)  PRIMARY KEY,
  service_name                  VARCHAR2(100) NOT NULL,
  service_charge_per_unit       NUMBER(10,2)  NOT NULL,
  estimated_time_in_min_required NUMBER,
  service_availability          VARCHAR2(30)
);

-- ---------- PROVIDES (shop <-> service) ----------
-- DELETE /api/shops/:id deletes the services BEFORE the provides rows,
-- so provides must cascade from service.
CREATE TABLE provides (
  shop_id    VARCHAR2(20) NOT NULL REFERENCES shop(shop_id)       ON DELETE CASCADE,
  service_id VARCHAR2(20) NOT NULL REFERENCES service(service_id) ON DELETE CASCADE,
  PRIMARY KEY (shop_id, service_id)
);

-- ---------- ORDERS ----------
CREATE TABLE orders (
  order_id            VARCHAR2(20) PRIMARY KEY,
  order_document      BLOB,
  order_status        VARCHAR2(20) DEFAULT 'QUEUED',
  order_priority      VARCHAR2(10) DEFAULT 'Normal',
  order_amount        NUMBER(10,2),
  order_delivery_time DATE,
  order_date          DATE DEFAULT SYSDATE,
  cust_id             VARCHAR2(20) NOT NULL REFERENCES customers(cust_id)
);

-- ---------- CONTAINS (order <-> service) ----------
-- Deliberately NO foreign keys here: DELETE /api/orders/:id removes the order
-- first and the contains row afterwards, and checks that this later delete
-- affected a row. A FK (or ON DELETE CASCADE) would break that logic.
CREATE TABLE contains (
  service_id VARCHAR2(20) NOT NULL,
  order_id   VARCHAR2(20) NOT NULL,
  PRIMARY KEY (service_id, order_id)
);
CREATE INDEX contains_order_idx ON contains(order_id);

-- ---------- PAYMENT ----------
-- No FK on order_id for the same reason: the payment row must survive the order
-- delete, because the app then marks it CANCELED by payment_transfer_id.
CREATE TABLE payment (
  payment_transfer_id VARCHAR2(100) PRIMARY KEY,
  payment_date        DATE DEFAULT SYSDATE,
  payment_amount      NUMBER(10,2),
  payment_status      VARCHAR2(20) DEFAULT 'PENDING',
  order_id            VARCHAR2(20)
);
CREATE INDEX payment_order_idx ON payment(order_id);

-- ---------- REVIEW / GIVES (in the diagram; not used by the current API) ----------
CREATE TABLE review (
  review_id      VARCHAR2(20) PRIMARY KEY,
  review_date    DATE DEFAULT SYSDATE,
  review_rating  NUMBER(2,1),
  review_comment VARCHAR2(1000),
  cust_id        VARCHAR2(20) REFERENCES customers(cust_id) ON DELETE CASCADE
);

CREATE TABLE gives (
  shop_id   VARCHAR2(20) NOT NULL REFERENCES shop(shop_id)         ON DELETE CASCADE,
  cust_id   VARCHAR2(20) NOT NULL REFERENCES customers(cust_id)    ON DELETE CASCADE,
  review_id VARCHAR2(20) NOT NULL REFERENCES review(review_id)     ON DELETE CASCADE,
  PRIMARY KEY (shop_id, cust_id, review_id)
);

-- ---------- VIEW used by GET /api/orders ----------
-- The API filters it with cust_id / shop_id / order_status.
-- order_document (BLOB) is left out to keep list responses small;
-- GET /api/orders/:orderId still returns the full row including the document.
CREATE OR REPLACE VIEW processing_orders_views AS
SELECT
  o.order_id,
  o.order_status,
  o.order_priority,
  o.order_amount,
  o.order_date,
  o.order_delivery_time,
  c.cust_id,
  c.cust_name,
  c.cust_phone,
  c.cust_email,
  s.service_id,
  s.service_name,
  s.service_charge_per_unit,
  sh.shop_id,
  sh.shop_name,
  p.payment_transfer_id,
  p.payment_status
FROM orders o
JOIN customers c  ON c.cust_id    = o.cust_id
JOIN contains  ct ON ct.order_id  = o.order_id
JOIN service   s  ON s.service_id = ct.service_id
JOIN provides  pr ON pr.service_id = s.service_id
JOIN shop      sh ON sh.shop_id   = pr.shop_id
LEFT JOIN payment p ON p.order_id = o.order_id;

COMMIT;
EXIT;
