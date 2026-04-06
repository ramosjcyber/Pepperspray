import Head from 'next/head'
import { useRouter } from 'next/router'

export default function SuccessPage() {
  const router = useRouter()
  const { order, method } = router.query

  return (
    <>
      <Head><title>Order Confirmed — Veyra-Life</title></Head>
      <div className="shell">
        <div className="topbar">
          <div className="brand-mark">
            <div className="brand-icon">V</div>
            <div>
              <div className="brand-sup">Advanced Research</div>
              <div className="brand-name">Veyra-Life</div>
            </div>
          </div>
        </div>
        <div className="panel" style={{ textAlign: 'center', paddingTop: 40 }}>
          <div className="confirm-icon" style={{ margin: '0 auto 16px' }}>✓</div>
          <p className="panel-title">Payment Received!</p>
          <p className="panel-sub">Your crypto payment has been confirmed</p>
          {order && (
            <div className="order-ref" style={{ marginBottom: 24 }}>
              Order ID: <span>#VL-{order.toUpperCase()}</span>
            </div>
          )}
          <div className="summary-box" style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              A confirmation email has been sent to your address. Your order will be verified against third-party CoA and dispatched in discreet plain packaging. Tracking information will be emailed once shipped.
            </p>
          </div>
          <button className="btn-primary" onClick={() => router.push('/')}>
            ← Start New Request
          </button>
        </div>
      </div>
    </>
  )
}
