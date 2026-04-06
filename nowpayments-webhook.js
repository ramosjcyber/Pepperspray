// pages/api/nowpayments-webhook.js
import crypto from 'crypto'
import { sendOrderConfirmation } from '../../lib/email'

export const config = { api: { bodyParser: true } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const secret = process.env.NOWPAYMENTS_IPN_SECRET
  const sig = req.headers['x-nowpayments-sig']

  // Verify signature
  if (secret && sig) {
    const sorted = JSON.stringify(
      Object.keys(req.body).sort().reduce((acc, k) => { acc[k] = req.body[k]; return acc }, {})
    )
    const hmac = crypto.createHmac('sha512', secret).update(sorted).digest('hex')
    if (hmac !== sig) {
      return res.status(401).json({ error: 'Invalid signature' })
    }
  }

  const { payment_status, order_id, pay_amount, pay_currency, price_amount } = req.body

  if (payment_status === 'finished' || payment_status === 'confirmed') {
    console.log(`Crypto payment confirmed: ${order_id} — ${pay_amount} ${pay_currency}`)
    // In production: look up order details from your DB using order_id and send confirmation email
  }

  res.json({ ok: true })
}
