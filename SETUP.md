# Veyra-Life Checkout — Setup & Deployment Guide

## What's included
- Full 4-step mobile-first checkout (Cart → Shipping → Payment → Confirm)
- Stripe credit/debit card processing with real payment elements
- NOWPayments crypto checkout (BTC, ETH, USDT, SOL) with 5% discount
- Order confirmation emails (customer + admin)
- Stripe webhook for post-payment fulfillment
- NOWPayments IPN webhook for crypto confirmation
- Vercel-ready deployment config

---

## Step 1 — Get your API keys

### Stripe (Credit/Debit Cards)
1. Go to https://dashboard.stripe.com
2. Create an account (or log in)
3. Go to Developers → API Keys
4. Copy your **Publishable key** (pk_live_...) and **Secret key** (sk_live_...)
5. For testing first, use the test keys (pk_test_... / sk_test_...)

### NOWPayments (Crypto)
1. Go to https://nowpayments.io and create an account
2. Dashboard → Store Settings → API Key → Generate
3. Copy your **API Key**
4. Go to Store Settings → IPN Secret → generate one and copy it

### Email (SMTP)
Option A — Gmail App Password (easiest):
1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate a password for "Mail"
4. Use: SMTP_HOST=smtp.gmail.com, PORT=587, USER=your@gmail.com, PASS=the app password

Option B — Use SendGrid, Mailgun, Postmark etc. (more reliable for production)

---

## Step 2 — Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual keys.

---

## Step 3 — Test locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

For Stripe webhooks locally, install the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

---

## Step 4 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial Veyra-Life checkout"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/veyra-checkout.git
git push -u origin main
```

---

## Step 5 — Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New → Project**
3. Import your `veyra-checkout` repository
4. Under **Environment Variables**, add ALL keys from your `.env.local`:
   - STRIPE_SECRET_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - STRIPE_WEBHOOK_SECRET
   - NOWPAYMENTS_API_KEY
   - NOWPAYMENTS_IPN_SECRET
   - SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
   - EMAIL_FROM / EMAIL_TO
   - NEXT_PUBLIC_SITE_URL (set to your Vercel URL, e.g. https://veyra-checkout.vercel.app)
5. Click **Deploy**

---

## Step 6 — Set up Stripe Webhook on production

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-vercel-url.vercel.app/api/stripe-webhook`
3. Select event: `payment_intent.succeeded`
4. Copy the **Signing secret** (whsec_...)
5. Add it to Vercel as `STRIPE_WEBHOOK_SECRET` and redeploy

---

## Step 7 — Set up NOWPayments IPN

1. NOWPayments Dashboard → Store Settings → IPN Callback URL
2. Set to: `https://your-vercel-url.vercel.app/api/nowpayments-webhook`

---

## Customizing your product catalog

Edit `lib/catalog.js` to add/remove compounds, variants, and prices.
Prices are in **cents** (e.g., 3800 = $38.00).

---

## Custom domain (optional)

1. In Vercel → your project → Settings → Domains
2. Add your domain (e.g. checkout.veyra-life.com)
3. Follow the DNS instructions (add CNAME record at your registrar)
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars to your custom domain

---

## File structure

```
veyra-checkout/
├── pages/
│   ├── index.js              ← Main checkout (all 4 steps)
│   ├── success.js            ← Crypto payment success redirect
│   ├── _app.js
│   ├── _document.js
│   └── api/
│       ├── create-payment-intent.js   ← Stripe
│       ├── stripe-webhook.js          ← Stripe post-payment
│       ├── create-crypto-invoice.js   ← NOWPayments
│       └── nowpayments-webhook.js     ← NOWPayments IPN
├── lib/
│   ├── catalog.js            ← Your products & pricing
│   └── email.js              ← Email templates & sender
├── styles/
│   └── globals.css           ← All styles
├── .env.local.example        ← Copy to .env.local and fill in
├── vercel.json
├── next.config.js
└── package.json
```
