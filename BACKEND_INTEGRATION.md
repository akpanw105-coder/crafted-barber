# Crafted Barbers — Backend Integration Guide

This document details the Supabase backend configuration and Paystack payment setup implemented for the Crafted Barbers mobile application.

---

## 1. Connected Supabase Project

- **Project Ref**: `wnnkbsrhikicocfrfpmt`
- **Project URL**: `https://wnnkbsrhikicocfrfpmt.supabase.co`
- **Region**: `eu-central-1`

Client credentials have been added to `.env` in the project root:
```env
EXPO_PUBLIC_SUPABASE_URL=https://wnnkbsrhikicocfrfpmt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

---

## 2. PostgreSQL Schema & Database Architecture

The following tables and policies were deployed directly through the Supabase MCP:

1. **`public.profiles`**: User profiles with server-enforced roles (`'customer'` vs `'admin'`).
2. **`public.services`**: Menu of services with price (`NUMERIC`), duration in minutes, descriptions, and active status.
3. **`public.business_settings`**: Operating days (`TEXT[]`), doors open (`TEXT`), doors close (`TEXT`), and appointment cadence (45 vs 60 mins).
4. **`public.blackout_slots`**: Reserved or blocked slots with a unique index on `(booking_date, booking_time)`.
5. **`public.bookings`**: Live reservations with reference (`#CB-XXXX`), user relation, status (`pending`, `confirmed`, `completed`, `cancelled`), and payment status (`pending`, `paid`, `refunded`, `failed`).
   - **Conflict Prevention**: Enforced via partial unique index:
     ```sql
     CREATE UNIQUE INDEX idx_unique_active_booking_slot
       ON public.bookings (booking_date, booking_time)
       WHERE status != 'cancelled';
     ```
6. **`public.booking_items`**: Junction table mapping multiple booked services to each appointment.

---

## 3. Server-Enforced Security & Atomic Operations

- **Row Level Security (RLS)**:
  - `services`, `business_settings`, `blackout_slots`: Publicly readable; mutations restricted strictly to users with `role = 'admin'` via `public.is_admin()`.
  - `bookings`: Customers can only read and cancel their own bookings (`user_id = auth.uid()`). Administrators can read and update all bookings.
- **Atomic Booking Function**:
  - `create_booking_atomic(...)` runs as a `SECURITY DEFINER` transaction, validating against blackout slots and existing active bookings before inserting the booking and its line items.
- **Auth Trigger**:
  - `on_auth_user_created` trigger automatically inserts a record into `public.profiles` with role `'customer'`.

---

## 4. Paystack Payment Architecture via Supabase Edge Functions

The mobile client never interacts directly with Paystack secret keys. Two Supabase Edge Functions were deployed:

1. **`paystack-initialize`**:
   - Accepts `email`, `amount`, and `booking_id`.
   - Converts Naira to Kobo and calls `https://api.paystack.co/transaction/initialize`.
   - Saves the transaction reference and access code to the database booking record.
2. **`paystack-verify`**:
   - Accepts `reference` and `booking_id`.
   - Calls `https://api.paystack.co/transaction/verify/{reference}` using server-side credentials.
   - Upon successful verification, uses the Supabase service role to transition `bookings.status` to `'confirmed'` and `bookings.payment_status` to `'paid'`.

### Required Supabase Edge Function Secrets

To process live transactions with Paystack, configure the following secret in your Supabase Dashboard (**Project Settings > Edge Functions > Secrets**):
```bash
PAYSTACK_SECRET_KEY=sk_test_... # or sk_live_...
```
*(Note: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically by the Supabase Edge Runtime).*

---

## 5. Admin Account Setup

To assign an administrator, register an account via the client interface or dashboard, then elevate the user role in PostgreSQL:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin-email@crafted.com';
```

---

## 6. Verification Status

- [x] Package dependencies installed (`@supabase/supabase-js`, `@react-native-async-storage/async-storage`, `react-native-url-polyfill`).
- [x] Database schema, indexes, conflict prevention, and RLS policies created and verified in `wnnkbsrhikicocfrfpmt`.
- [x] Supabase Edge Functions `paystack-initialize` and `paystack-verify` deployed to project `wnnkbsrhikicocfrfpmt`.
- [x] All customer and admin screens upgraded to live state with loading, empty, and error feedback.
- [x] TypeScript typecheck (`npx tsc --noEmit`) passes with **0 errors**.
