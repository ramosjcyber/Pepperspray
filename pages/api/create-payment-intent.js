// pages/api/create-payment-intent.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { items, shippingCost, shipping } = req.body

  // Validate
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' })
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const total = subtotal + (shippingCost || 0)

  if (total < 50) return res.status(400).json({ error: 'Order total too low' })

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: JSON.stringify(items.map(i => ({ id: i.id, code: i.code, qty: i.qty }))),
        shipping_name: shipping?.name || '',
        shipping_address: shipping?.address || '',
        shipping_city: shipping?.city || '',
        shipping_state: shipping?.state || '',
        shipping_zip: shipping?.zip || '',
        shipping_country: shipping?.country || '',
      },
      description: 'Veyra-Life Research Order',
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
}
