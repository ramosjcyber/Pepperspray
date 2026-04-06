import { useState, useCallback } from 'react'
import Head from 'next/head'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { CATALOG, SHIPPING_OPTIONS, CRYPTO_OPTIONS } from '../lib/catalog'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(cents) {
  return '$' + (cents / 100).toFixed(2)
}

function buildCartItems(selections) {
  return selections
    .filter(s => s.qty > 0)
    .map(s => {
      const product = CATALOG.find(p => p.id === s.productId)
      const variant = product?.variants.find(v => v.code === s.code)
      return {
        id: product?.id,
        name: product?.name,
        variant: variant?.label,
        code: variant?.code,
        price: variant?.price || 0,
        qty: s.qty,
      }
    })
}

// ─── Topbar ──────────────────────────────────────────────────────────────────

function Topbar() {
  return (
    <div className="topbar">
      <div className="brand-mark">
        <div className="brand-icon">V</div>
        <div>
          <div className="brand-sup">Advanced Research</div>
          <div className="brand-name">Veyra-Life</div>
        </div>
      </div>
      <div className="secure-badge">🔒 Secure Checkout</div>
    </div>
  )
}

// ─── Steps bar ───────────────────────────────────────────────────────────────

const STEP_LABELS = ['Cart', 'Shipping', 'Payment', 'Done']

function StepsBar({ step }) {
  return (
    <div className="steps-bar">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1
        const state = n < step ? 'done' : n === step ? 'active' : 'idle'
        return (
          <div key={n} className="step-item">
            <div className={`step-dot ${state}`}>
              {state === 'done' ? '✓' : n === 4 ? '✓' : n}
            </div>
            <span className={`step-label ${state}`}>{label}</span>
            {i < STEP_LABELS.length - 1 && (
              <div className={`step-conn ${state === 'done' ? 'done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Cart ────────────────────────────────────────────────────────────

function CartStep({ selections, setSelections, onNext }) {
  const [agreed, setAgreed] = useState(false)
  const [err, setErr] = useState('')

  const items = buildCartItems(selections)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  function changeQty(productId, code, delta) {
    setSelections(prev => prev.map(s =>
      s.productId === productId && s.code === code
        ? { ...s, qty: Math.max(0, s.qty + delta) }
        : s
    ))
  }

  function handleNext() {
    if (items.length === 0) { setErr('Add at least one item to continue.'); return }
    if (!agreed) { setErr('Please confirm the age & research use statement.'); return }
    setErr('')
    onNext()
  }

  return (
    <div className="panel">
      <p className="panel-title">Request List</p>
      <p className="panel-sub">Review your research compounds</p>

      <div className="disclaimer">
        <strong>⚠ Research Use Only</strong>
        All compounds are sold strictly for in-vitro research purposes. Not for human consumption.
      </div>

      {CATALOG.map(product => (
        product.variants.map(variant => {
          const sel = selections.find(s => s.productId === product.id && s.code === variant.code)
          if (!sel || sel.qty === 0) return null
          return (
            <div className="cart-item" key={`${product.id}-${variant.code}`}>
              <div className="item-top">
                <span className="item-badge">{product.category}</span>
                <button className="remove-btn" onClick={() => changeQty(product.id, variant.code, -sel.qty)}>
                  Remove
                </button>
              </div>
              <p className="item-name">{product.name}</p>
              <p className="item-meta">Variant: {variant.label} · Code: {variant.code}</p>
              <div className="item-bottom">
                <div className="qty-row">
                  <button className="qty-btn" onClick={() => changeQty(product.id, variant.code, -1)}>−</button>
                  <span className="qty-val">{sel.qty}</span>
                  <button className="qty-btn" onClick={() => changeQty(product.id, variant.code, 1)}>+</button>
                </div>
                <span className="item-price">{fmt(variant.price * sel.qty)}</span>
              </div>
            </div>
          )
        })
      ))}

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 14 }}>
          No items in your request list.
        </div>
      )}

      <div className="summary-box">
        <div className="sum-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
        <div className="sum-row"><span>Shipping</span><span>Calculated next</span></div>
        <div className="sum-total"><span>Estimated Total</span><span>{fmt(subtotal)}</span></div>
      </div>

      <div className="age-gate">
        <input type="checkbox" id="age" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        <label htmlFor="age">
          I confirm I am 18+ and purchasing these compounds for legitimate scientific research only, not for human consumption.
        </label>
      </div>

      {err && <p className="err-msg">{err}</p>}

      <button className="btn-primary" onClick={handleNext}>
        Continue to Shipping →
      </button>

      <div className="trust-row">
        <span className="trust-item">🔒 SSL Encrypted</span>
        <span className="trust-item">✅ Third-Party Verified</span>
        <span className="trust-item">📦 Discreet Packaging</span>
      </div>
    </div>
  )
}

// ─── Step 2: Shipping ────────────────────────────────────────────────────────

function ShippingStep({ shipping, setShipping, selectedShipping, setSelectedShipping, subtotal, onNext, onBack }) {
  const [err, setErr] = useState('')

  function handleNext() {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zip', 'country']
    for (const f of required) {
      if (!shipping[f]?.trim()) { setErr('Please fill in all required fields.'); return }
    }
    if (!/\S+@\S+\.\S+/.test(shipping.email)) { setErr('Please enter a valid email address.'); return }
    setErr('')
    onNext()
  }

  function field(label, key, placeholder, type = 'text') {
    return (
      <div className="field-group">
        <label className="field-label">{label}</label>
        <input
          className={`field-input${err && !shipping[key]?.trim() ? ' error' : ''}`}
          type={type}
          placeholder={placeholder}
          value={shipping[key] || ''}
          onChange={e => setShipping(p => ({ ...p, [key]: e.target.value }))}
        />
      </div>
    )
  }

  return (
    <div className="panel">
      <button className="back-link" onClick={onBack}>← Back to cart</button>
      <p className="panel-title">Shipping Details</p>
      <p className="panel-sub">Enter your delivery information</p>

      <div className="section-div">Contact</div>
      {field('Email Address', 'email', 'researcher@lab.com', 'email')}
      <div className="field-row">
        {field('First Name', 'firstName', 'First')}
        {field('Last Name', 'lastName', 'Last')}
      </div>

      <div className="section-div">Address</div>
      {field('Street Address', 'address', '123 Research Blvd, Suite 400')}
      <div className="field-row">
        {field('City', 'city', 'Boston')}
        {field('State / Province', 'state', 'MA')}
      </div>
      <div className="field-row">
        {field('ZIP / Postal Code', 'zip', '02101')}
        <div className="field-group">
          <label className="field-label">Country</label>
          <select className="field-select" value={shipping.country || 'United States'} onChange={e => setShipping(p => ({ ...p, country: e.target.value }))}>
            {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Netherlands', 'Other'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="section-div">Shipping Method</div>
      {SHIPPING_OPTIONS.map(opt => {
        const disabled = opt.minOrder && subtotal < opt.minOrder
        return (
          <div
            key={opt.id}
            className={`ship-option${selectedShipping?.id === opt.id && !disabled ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
            onClick={() => !disabled && setSelectedShipping(opt)}
            style={disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
          >
            <div className="ship-radio"><div className="ship-dot" /></div>
            <div className="ship-info">
              <div className="ship-name">{opt.label}</div>
              <div className="ship-eta">{opt.eta}{opt.minOrder ? ` · Min order ${fmt(opt.minOrder)}` : ''}</div>
            </div>
            <div className="ship-price">{opt.price === 0 ? 'Free' : fmt(opt.price)}</div>
          </div>
        )
      })}

      {err && <p className="err-msg">{err}</p>}
      <button className="btn-primary" onClick={handleNext} style={{ marginTop: 18 }}>
        Continue to Payment →
      </button>
    </div>
  )
}

// ─── Stripe Payment Form ──────────────────────────────────────────────────────

function StripeForm({ clientSecret, onSuccess, onBack, total }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function handlePay() {
    if (!stripe || !elements) return
    setLoading(true)
    setErr('')

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      setErr(error.message)
      setLoading(false)
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id.slice(-8).toUpperCase())
    }
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      <div className="summary-box" style={{ margin: '0 0 12px' }}>
        <div className="sum-total"><span>Total Due</span><span>{fmt(total)}</span></div>
      </div>
      {err && <p className="err-msg">{err}</p>}
      <button className="btn-primary" onClick={handlePay} disabled={loading || !stripe}>
        {loading ? <><div className="spinner" /> Processing…</> : '🔒 Pay Now'}
      </button>
      <button className="btn-outline" onClick={onBack}>← Back</button>
    </>
  )
}

// ─── Step 3: Payment ─────────────────────────────────────────────────────────

function PaymentStep({ items, shipping, selectedShipping, onSuccess, onBack }) {
  const [payMethod, setPayMethod] = useState('card')
  const [clientSecret, setClientSecret] = useState(null)
  const [cryptoCurrency, setCryptoCurrency] = useState('BTC')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shippingCost = selectedShipping?.price || 0
  const total = subtotal + shippingCost

  async function initStripe() {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingCost,
          shipping: {
            name: `${shipping.firstName} ${shipping.lastName}`,
            address: shipping.address,
            city: shipping.city,
            state: shipping.state,
            zip: shipping.zip,
            country: shipping.country,
          },
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setClientSecret(data.clientSecret)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCryptoPay() {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/create-crypto-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingCost,
          currency: cryptoCurrency,
          shippingLabel: selectedShipping?.label,
          email: shipping.email,
          shipping: {
            name: `${shipping.firstName} ${shipping.lastName}`,
            address: shipping.address,
            city: shipping.city,
            state: shipping.state,
            zip: shipping.zip,
            country: shipping.country,
          },
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      // Redirect to NOWPayments hosted invoice
      window.location.href = data.invoiceUrl
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <button className="back-link" onClick={onBack}>← Back to shipping</button>
      <p className="panel-title">Payment</p>
      <p className="panel-sub">All transactions are encrypted end-to-end</p>

      <div className="pay-tabs">
        <div className={`pay-tab${payMethod === 'card' ? ' active' : ''}`} onClick={() => { setPayMethod('card'); setClientSecret(null) }}>
          Credit / Debit
        </div>
        <div className={`pay-tab${payMethod === 'crypto' ? ' active' : ''}`} onClick={() => { setPayMethod('crypto'); setClientSecret(null) }}>
          Cryptocurrency
        </div>
      </div>

      {payMethod === 'card' && (
        <>
          {!clientSecret ? (
            <>
              <div className="card-icons">
                {['VISA', 'MC', 'AMEX', 'DISC'].map(c => <div key={c} className="card-icon">{c}</div>)}
              </div>
              <div className="summary-box" style={{ margin: '0 0 16px' }}>
                <div className="sum-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div className="sum-row"><span>Shipping ({selectedShipping?.label})</span><span>{shippingCost === 0 ? 'Free' : fmt(shippingCost)}</span></div>
                <div className="sum-total"><span>Total Due</span><span>{fmt(total)}</span></div>
              </div>
              {err && <p className="err-msg">{err}</p>}
              <button className="btn-primary" onClick={initStripe} disabled={loading}>
                {loading ? <><div className="spinner" /> Loading…</> : 'Continue to Card →'}
              </button>
              <button className="btn-outline" onClick={onBack}>← Back</button>
            </>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: { colorPrimary: '#1D9E75', borderRadius: '8px', fontFamily: 'Helvetica Neue, system-ui, sans-serif' },
                },
              }}
            >
              <StripeForm
                clientSecret={clientSecret}
                total={total}
                onSuccess={orderId => onSuccess({ orderId, method: 'Credit Card' })}
                onBack={() => setClientSecret(null)}
              />
            </Elements>
          )}
        </>
      )}

      {payMethod === 'crypto' && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            Select your preferred cryptocurrency. You'll be redirected to a secure payment page.
          </p>
          <div className="crypto-grid">
            {CRYPTO_OPTIONS.map(c => (
              <div
                key={c.id}
                className={`crypto-btn${cryptoCurrency === c.id ? ' selected' : ''}`}
                onClick={() => setCryptoCurrency(c.id)}
              >
                {c.symbol} {c.label}
              </div>
            ))}
          </div>
          <div className="crypto-note">
            ✅ 5% discount applied automatically for all crypto payments
          </div>

          <div className="summary-box" style={{ margin: '14px 0 6px' }}>
            <div className="sum-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="sum-row"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : fmt(shippingCost)}</span></div>
            <div className="sum-row" style={{ color: 'var(--teal-dark)', fontWeight: 600 }}><span>Crypto Discount (5%)</span><span>−{fmt(Math.round(total * 0.05))}</span></div>
            <div className="sum-total"><span>Total Due</span><span>{fmt(Math.round(total * 0.95))}</span></div>
          </div>

          {err && <p className="err-msg">{err}</p>}
          <button className="btn-primary" onClick={handleCryptoPay} disabled={loading}>
            {loading ? <><div className="spinner" /> Generating invoice…</> : `Pay with ${cryptoCurrency} →`}
          </button>
          <button className="btn-outline" onClick={onBack}>← Back</button>
        </>
      )}

      <div className="trust-row">
        <span className="trust-item">🔒 256-bit SSL</span>
        <span className="trust-item">✅ CoA on every batch</span>
      </div>
    </div>
  )
}

// ─── Step 4: Confirm ─────────────────────────────────────────────────────────

function ConfirmStep({ orderId, method, onReset }) {
  return (
    <div className="panel">
      <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
        <div className="confirm-icon">✓</div>
        <p className="panel-title" style={{ textAlign: 'center' }}>Order Submitted!</p>
        <p className="panel-sub" style={{ textAlign: 'center' }}>Your research request has been received</p>
        <div className="order-ref">Order ID: <span>#VL-{orderId}</span> · {method}</div>
      </div>

      <div className="confirm-steps" style={{ marginTop: 24 }}>
        {[
          ['Confirmation email sent', 'Your order summary and invoice will arrive within 5 minutes.'],
          ['Lab verification', 'Every batch is verified against third-party CoA before dispatch.'],
          ['Discreet dispatch', 'Ships in plain packaging with no product names on the exterior.'],
          ['Tracking provided', 'A tracking number will be emailed once your order ships.'],
        ].map(([title, desc], i) => (
          <div className="confirm-step" key={i}>
            <div className="cs-num">{i + 1}</div>
            <div className="cs-body">
              <strong>{title}</strong>
              <span>{desc}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={onReset}>← Start New Request</button>
      <div className="trust-row">
        <span className="trust-item">🔒 Secure & Private</span>
        <span className="trust-item">🎉 Thank you for choosing Veyra-Life</span>
      </div>
    </div>
  )
}

// ─── Default initial selections ──────────────────────────────────────────────

function buildInitialSelections() {
  return CATALOG.flatMap(p =>
    p.variants.map(v => ({ productId: p.id, code: v.code, qty: 0 }))
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function CheckoutPage({ initialCart }) {
  const [step, setStep] = useState(1)
  const [selections, setSelections] = useState(() => {
    // Pre-populate from query/initialCart if provided
    const base = buildInitialSelections()
    if (initialCart) {
      initialCart.forEach(({ productId, code, qty }) => {
        const s = base.find(b => b.productId === productId && b.code === code)
        if (s) s.qty = qty
      })
    }
    return base
  })
  const [shipping, setShipping] = useState({ country: 'United States' })
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0])
  const [orderResult, setOrderResult] = useState(null)

  const items = buildCartItems(selections)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  function handleReset() {
    setStep(1)
    setSelections(buildInitialSelections())
    setShipping({ country: 'United States' })
    setSelectedShipping(SHIPPING_OPTIONS[0])
    setOrderResult(null)
  }

  return (
    <>
      <Head>
        <title>Checkout — Veyra-Life Advanced Research</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="shell">
        <Topbar />
        <StepsBar step={step} />

        {step === 1 && (
          <CartStep
            selections={selections}
            setSelections={setSelections}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <ShippingStep
            shipping={shipping}
            setShipping={setShipping}
            selectedShipping={selectedShipping}
            setSelectedShipping={setSelectedShipping}
            subtotal={subtotal}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <PaymentStep
            items={items}
            shipping={shipping}
            selectedShipping={selectedShipping}
            onSuccess={result => { setOrderResult(result); setStep(4) }}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && orderResult && (
          <ConfirmStep
            orderId={orderResult.orderId}
            method={orderResult.method}
            onReset={handleReset}
          />
        )}
      </div>
    </>
  )
}

// Optionally accept a cart pre-populated from query params
export async function getServerSideProps({ query }) {
  let initialCart = null
  if (query.cart) {
    try { initialCart = JSON.parse(decodeURIComponent(query.cart)) } catch {}
  }
  return { props: { initialCart } }
}
