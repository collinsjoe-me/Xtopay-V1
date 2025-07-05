-- Drop tables if they exist (for demo/dev only!)
drop table if exists Payment cascade;
drop table if exists checkout cascade;
drop table if exists customer cascade;
drop table if exists Merchant cascade;

-- Supabase SQL for Xtopay Payment API

-- 1. Business Table
CREATE TABLE business (
  id SERIAL PRIMARY KEY,
  business_id VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  currency VARCHAR(8) NOT NULL,
  logo_url TEXT,
  api_id VARCHAR(128),
  api_key VARCHAR(128)
);

-- 2. Customer Table
CREATE TABLE customer (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  phone VARCHAR(32) UNIQUE,
  email VARCHAR(255)
);

-- 3. Checkout Table
CREATE TABLE checkout (
  id SERIAL PRIMARY KEY,
  checkout_id VARCHAR(64) NOT NULL UNIQUE,
  business_id VARCHAR(32) NOT NULL REFERENCES business(business_id),
  client_reference VARCHAR(64) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(8) NOT NULL,
  description TEXT,
  customer_id INTEGER REFERENCES customer(id),
  channels TEXT[],
  callback_url TEXT,
  return_url TEXT,
  cancel_url TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Payment Table
CREATE TABLE payment (
  id SERIAL PRIMARY KEY,
  checkout_id VARCHAR(64) NOT NULL REFERENCES checkout(checkout_id),
  transaction_id VARCHAR(64) NOT NULL UNIQUE,
  channel VARCHAR(32),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(8) NOT NULL,
  paid_at TIMESTAMP,
  fees NUMERIC(12,2),
  settlement_amount NUMERIC(12,2),
  customer_phone VARCHAR(32)
);

-- Insert demo business
insert into business (business_id, name, email, currency, logo_url, api_id, api_key)
values ('0800000', 'Acme Inc', 'acme@example.com', 'GHS', 'https://cdn.xtopay.co/businesses/acme.png', 'demo_id', 'demo_key')
on conflict (business_id) do nothing;

-- Insert demo customer
insert into customer (name, phone, email)
values ('Kwame Asante', '233245000111', 'kwame@example.com')
on conflict (phone) do nothing;

-- Insert demo checkout
insert into checkout (checkout_id, business_id, client_reference, amount, currency, description, customer_id, channels, callback_url, return_url, cancel_url, status, expires_at)
select 'xtp_123abc', '0800000', 'ORD-12345', 100.5, 'GHS', 'Online Purchase', c.id, array['mtn','card'], 'https://merchant.com/webhook', 'https://merchant.com/thank-you', 'https://merchant.com/cancelled', 'pending', now() + interval '30 minutes'
from customer c where c.phone = '233245000111'
on conflict (checkout_id) do nothing;

-- Insert demo payment
insert into payment (checkout_id, transaction_id, channel, amount, currency, paid_at, fees, settlement_amount, customer_phone)
values ('xtp_123abc', 'xtp_pay_789xyz', 'mtn', 100.5, 'GHS', now(), 1.5, 99.0, '233245000111')
on conflict (transaction_id) do nothing;
