// lib/email.js
import nodemailer from 'nodemailer'

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

function formatItems(items) {
  return items.map(i =>
    `  • ${i.name} (${i.variant}) x${i.qty} — $${(i.price / 100).toFixed(2)}`
  ).join('\n')
}

export async function sendOrderConfirmation({ to, order }) {
  const transporter = getTransporter()
  const itemsText = formatItems(order.items)
  const total = `$${(order.total / 100).toFixed(2)}`

  await transporter.sendMail({
    from: `"Veyra-Life Orders" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Order Confirmed – #VL-${order.id}`,
    text: `
Your Veyra-Life Research Order has been received.

Order ID: #VL-${order.id}
Payment: ${order.paymentMethod}

ITEMS:
${itemsText}

Shipping: ${order.shippingLabel} — $${(order.shippingCost / 100).toFixed(2)}
Total: ${total}

Ship to:
${order.shipping.name}
${order.shipping.address}
${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}
${order.shipping.country}

Your order will be verified against third-party CoA and dispatched in plain packaging.
A tracking number will be sent once shipped.

— Veyra-Life Advanced Research
`.trim(),
    html: `
<div style="font-family:Helvetica Neue,sans-serif;max-width:560px;margin:auto;color:#111827">
  <div style="background:#1a2332;padding:18px 24px;border-radius:12px 12px 0 0">
    <span style="background:#1D9E75;color:#fff;font-weight:700;font-size:13px;padding:5px 10px;border-radius:6px">V</span>
    <span style="color:#fff;font-size:15px;font-weight:600;margin-left:10px">Veyra-Life</span>
    <span style="display:block;color:#9fb8cc;font-size:10px;letter-spacing:2px;margin-top:2px;margin-left:44px">ADVANCED RESEARCH</span>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px">
    <p style="font-size:20px;font-weight:700;color:#1a2332;margin-bottom:4px">Order Confirmed ✓</p>
    <p style="font-size:13px;color:#6b7280;margin-bottom:20px">Order <strong style="color:#0F6E56">#VL-${order.id}</strong> · Payment: ${order.paymentMethod}</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      ${order.items.map(i => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px">
          <strong>${i.name}</strong><br>
          <span style="color:#6b7280">${i.variant} · Code: ${i.code} · Qty: ${i.qty}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;text-align:right;font-weight:600">$${(i.price / 100).toFixed(2)}</td>
      </tr>`).join('')}
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#6b7280">Shipping (${order.shippingLabel})</td>
        <td style="padding:8px 0;font-size:13px;text-align:right">$${(order.shippingCost / 100).toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;font-size:15px;font-weight:700;color:#1a2332">Total</td>
        <td style="padding:12px 0 0;font-size:15px;font-weight:700;color:#1a2332;text-align:right">${total}</td>
      </tr>
    </table>
    <div style="background:#f8fafb;border-radius:8px;padding:14px;margin-bottom:16px;font-size:13px">
      <p style="font-weight:600;color:#1a2332;margin-bottom:6px">Ship to</p>
      <p style="color:#6b7280;line-height:1.6">${order.shipping.name}<br>${order.shipping.address}<br>${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}<br>${order.shipping.country}</p>
    </div>
    <p style="font-size:12px;color:#6b7280;line-height:1.6">Your order will be verified against third-party Certificate of Analysis and dispatched in discreet plain packaging. A tracking number will be sent once shipped.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
    <p style="font-size:11px;color:#9ca3af">This order is for research purposes only. Not for human consumption.</p>
  </div>
</div>`,
  })
}

export async function sendAdminNotification({ order }) {
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"Veyra-Life Orders" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    subject: `🔔 New Order #VL-${order.id} — ${order.paymentMethod} — $${(order.total / 100).toFixed(2)}`,
    text: JSON.stringify(order, null, 2),
  })
}
