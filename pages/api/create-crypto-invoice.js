// pages/api/create-crypto-invoice.js
import { sendAdminNotification } from '../../lib/email'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { items, shippingCost, currency, shipping, email } = req.body

  if (!items || !currency) return res.status(400).json({ error: 'Missing fields' })

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const total = subtotal + (shippingCost || 0)
  const totalUsd = (total / 100).toFixed(2)
  const orderId = uuidv4().slice(0, 8).toUpperCase()

  try {
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: totalUsd,
        price_currency: 'usd',
        pay_currency: currency.toLowerCase(),
        order_id: `VL-${orderId}`,
        order_description: `Veyra-Life Research Order VL-${orderId}`,
        ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/nowpayments-webhook`,
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order=${orderId}&method=crypto`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('NOWPayments error:', errText)
      return res.status(502).json({ error: 'Crypto payment provider error' })
    }

    const data = await response.json()

    // Notify admin
    await sendAdminNotification({
      order: {
        id: orderId,
        paymentMethod: `Crypto (${currency})`,
        total,
        shippingCost,
        shippingLabel: req.body.shippingLabel || '',
        items,
        shipping,
        invoiceUrl: data.invoice_url,
      },
    }).catch(console.error)

    res.json({ invoiceUrl: data.invoice_url, orderId })
  } catch (err) {
    console.error('Crypto invoice error:', err)
    res.status(500).json({ error: err.message })
  }
}
