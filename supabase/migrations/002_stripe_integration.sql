-- Stripe Integration Migration
-- This migration adds/updates columns needed for Stripe subscription management
-- Run this in Supabase SQL Editor if the columns don't already exist

-- Check if columns exist and add them if not
DO $$
BEGIN
    -- Add stripe_customer_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'organizations' AND column_name = 'stripe_customer_id'
    ) THEN
        ALTER TABLE organizations ADD COLUMN stripe_customer_id TEXT UNIQUE;
    END IF;

    -- Add subscription_tier column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'organizations' AND column_name = 'subscription_tier'
    ) THEN
        ALTER TABLE organizations ADD COLUMN subscription_tier TEXT DEFAULT 'free';
    END IF;
END $$;

-- Create index for faster lookups by stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer_id
ON organizations (stripe_customer_id)
WHERE stripe_customer_id IS NOT NULL;

-- Comment on columns
COMMENT ON COLUMN organizations.stripe_customer_id IS 'Stripe Customer ID for billing';
COMMENT ON COLUMN organizations.subscription_tier IS 'Current subscription tier: free, starter, business, or pro';
