# Form & Meaning

A paid creative community platform for designers in Nigeria/Africa.

## Tech Stack
- **Next.js 14.2** (App Router)
- **Supabase** (Auth + PostgreSQL)
- **Mux** (Video hosting)
- **Resend** (Transactional emails)
- **Selar** (Payment via webhook)
- **Tailwind CSS**
- **Vercel** (Deployment)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
- Go to your Supabase dashboard
- Open SQL Editor
- Run `scripts/schema.sql` to create all tables

### 3. Configure environment
- Copy `.env.local` and fill in your values
- The existing credentials are already included

### 4. Set up Selar webhook
- Go to Selar dashboard > Settings > Webhooks
- Add webhook URL: `https://your-domain.com/api/webhook/selar`
- Copy the webhook secret to `SELAR_WEBHOOK_SECRET` in `.env.local`

### 5. Run locally
```bash
npm run dev
```

### 6. Deploy to Vercel
```bash
npx vercel
```
Add all `.env.local` variables to Vercel Environment Variables.

## Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Member login |
| `/join` | Join + Selar payment |
| `/dashboard` | Member dashboard |
| `/library` | Content library (videos, resources) |
| `/community` | Member directory |
| `/events` | Events with RSVP |
| `/profile` | Edit profile |
| `/admin` | Admin panel |
| `/admin/login` | Admin login |

## Payment Flow
1. User clicks "Join" on landing page → `/join`
2. Fills name + email → redirected to Selar checkout
3. Selar processes payment → sends webhook to `/api/webhook/selar`
4. Webhook creates Supabase auth account + membership
5. Welcome email sent with login credentials
6. User logs in → lands on dashboard

## Admin
- Access at `/admin` with the `ADMIN_PASSWORD`
- Manage members, content, events, and announcements
