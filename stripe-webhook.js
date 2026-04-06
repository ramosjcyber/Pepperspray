// pages/api/stripe-webhook.js
import Stripe from 'stripe'
import { sendOrderConfirmation, sendAdminNotification } from '../../lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = { api: { bodyParser: false } }

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object
    const meta = pi.metadata

    const items = JSON.parse(meta.items || '[]')
    const orderId = pi.id.slice(-8).toUpperCase()

    const order = {
      id: orderId,
      paymentMethod: 'Credit Card (Stripe)',
      total: pi.amount,
      shippingCost: 0, // pulled from metadata in production
      shippingLabel: 'Standard Shipping',
      items,
      shipping: {
        name: meta.shipping_name,
        address: meta.shipping_address,
        city: meta.shipping_city,
        state: meta.shipping_state,
        zip: meta.shipping_zip,
        country: meta.shipping_country,
      },
    }

    // Send emails (fire and forget — don't block the webhook response)
    const customerEmail = pi.receipt_email
    if (customerEmail) {
      sendOrderConfirmation({ to: customerEmail, order }).catch(console.error)
    }
    sendAdminNotification({ order }).catch(console.error)
  }

  res.json({ received: true })
}
