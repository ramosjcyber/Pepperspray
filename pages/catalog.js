import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { CATALOG } from '../lib/catalog'

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(cents) {
  return '$' + (cents / 100).toFixed(2)
}

function getTotalItems(cart) {
  return Object.values(cart).reduce((s, v) => s + v.qty, 0)
}

function getSubtotal(cart) {
  return Object.entries(cart).reduce((sum, [key, val]) => {
    const [productId, code] = key.split('::')
    const product = CATALOG.find(p => p.id === productId)
    const variant = product?.variants.find(v => v.code === code)
    return sum + (variant?.price || 0) * val.qty
  }, 0)
}

// ─── Topbar ─────────────────────────────────────────────────────────────────

function Topbar({ cartCount, onCartOpen }) {
  return (
    <div style={{
      background: 'var(--navy)', padding: '14px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, background: 'var(--teal)', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 15, color: '#fff',
        }}>V</div>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 2, color: '#9fb8cc', textTransform: 'uppercase' }}>Advanced Research</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Veyra-Life</div>
        </div>
      </div>
      <button
        onClick={onCartOpen}
        style={{
          background: cartCount > 0 ? 'var(--teal)' : 'rgba(255,255,255,0.1)',
          border: 'none', borderRadius: 10, padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 7,
          cursor: 'pointer', transition: 'background .2s',
        }}
      >
        <CartIcon />
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
          {cartCount > 0 ? `${cartCount} item${cartCount !== 1 ? 's' : ''}` : 'Cart'}
        </span>
      </button>
    </div>
  )
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--navy) 0%, #1e3a5f 100%)',
      padding: '36px 20px 28px',
      borderBottom: '3px solid var(--teal)',
    }}>
      <p style={{ fontSize: 10, letterSpacing: 3, color: 'var(--teal)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
        Third-Party Verified
      </p>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 10 }}>
        Research Inventory
      </h1>
      <p style={{ fontSize: 13, color: '#9fb8cc', lineHeight: 1.6, marginBottom: 20 }}>
        Premium research compounds with structured lot references and full CoA documentation. For in-vitro research use only.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {['CoA Verified', 'Discreet Shipping', '24hr Processing', 'Secure Checkout'].map(tag => (
          <span key={tag} style={{
            background: 'rgba(29,158,117,0.15)', border: '1px solid rgba(29,158,117,0.4)',
            borderRadius: 20, padding: '4px 11px', fontSize: 11,
            color: '#5dcaa5', fontWeight: 600, letterSpacing: 0.3,
          }}>✓ {tag}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Search & Filter ─────────────────────────────────────────────────────────

function SearchBar({ query, setQuery }) {
  return (
    <div style={{ padding: '14px 20px 0', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search compounds…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px 10px 38px',
            border: '1px solid var(--border)', borderRadius: 10,
            fontSize: 14, color: 'var(--text)', background: 'var(--white)',
            outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  )
}

// ─── Product Card ────────────────────────────────────────────────────────────

function ProductCard({ product, cart, onAdd }) {
  const [selectedCode, setSelectedCode] = useState(product.variants[0].code)
  const [added, setAdded] = useState(false)

  const variant = product.variants.find(v => v.code === selectedCode)
  const cartKey = `${product.id}::${selectedCode}`
  const inCart = cart[cartKey]?.qty > 0

  function handleAdd() {
    onAdd(product.id, selectedCode)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div style={{
      background: 'var(--white)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '16px', marginBottom: 12,
      transition: 'box-shadow .2s',
    }}>
      {/* Category badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{
          background: 'var(--teal-light)', color: 'var(--teal-dark)',
          fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
          padding: '3px 7px', borderRadius: 4, textTransform: 'uppercase',
        }}>
          {product.category}
        </span>
        {inCart && (
          <span style={{
            background: '#f0fdf4', color: '#166534',
            fontSize: 10, fontWeight: 600, padding: '3px 8px',
            borderRadius: 20, border: '1px solid #86efac',
          }}>✓ In cart</span>
        )}
      </div>

      {/* Name */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 4, lineHeight: 1.3 }}>
        {product.name}
      </h3>

      {/* Description */}
      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
        {product.description}
      </p>

      {/* Variant selector */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
          Choose variant
        </div>

        {product.variants.length === 1 ? (
          /* Single variant — pill display, no dropdown needed */
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--teal-light)', border: '1.5px solid var(--teal)',
            borderRadius: 8, padding: '7px 12px',
            fontSize: 13, fontWeight: 600, color: 'var(--teal-dark)',
          }}>
            {variant.label}
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>· {variant.code}</span>
          </div>
        ) : (
          /* Multi-variant — styled dropdown */
          <div style={{ position: 'relative' }}>
            <select
              value={selectedCode}
              onChange={e => setSelectedCode(e.target.value)}
              style={{
                width: '100%', padding: '9px 36px 9px 13px',
                border: '1.5px solid var(--border)', borderRadius: 10,
                fontSize: 13, color: 'var(--text)', background: 'var(--white)',
                appearance: 'none', outline: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 500,
              }}
            >
              {product.variants.map(v => (
                <option key={v.code} value={v.code}>
                  {v.label} · {v.code}
                </option>
              ))}
            </select>
            <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}
              width="12" height="8" viewBox="0 0 12 8">
              <path d="M1 1l5 5 5-5" stroke="#111827" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>
          Selected code: <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{selectedCode}</span>
        </div>
      </div>

      {/* Price + Add button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)' }}>
            {fmt(variant.price)}
          </span>
        </div>
        <button
          onClick={handleAdd}
          style={{
            background: added ? '#166534' : 'var(--teal)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 18px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', transition: 'background .3s, transform .1s',
            whiteSpace: 'nowrap', minWidth: 130,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {added ? '✓ Added!' : inCart ? '+ Add more' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

// ─── Cart Drawer ─────────────────────────────────────────────────────────────

function CartDrawer({ cart, onClose, onChangeQty, onRemove, onCheckout }) {
  const items = Object.entries(cart)
    .filter(([, v]) => v.qty > 0)
    .map(([key, val]) => {
      const [productId, code] = key.split('::')
      const product = CATALOG.find(p => p.id === productId)
      const variant = product?.variants.find(v => v.code === code)
      return { key, productId, code, name: product?.name, label: variant?.label, price: variant?.price || 0, qty: val.qty }
    })

  const subtotal = getSubtotal(cart)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 200, animation: 'fadeIn .2s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        background: 'var(--white)', borderRadius: '20px 20px 0 0',
        zIndex: 201, maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
        animation: 'slideUp .25s ease',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 40, height: 4, background: '#dde3ea', borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 20px 14px', borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)' }}>Request List</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{items.length} compound{items.length !== 1 ? 's' : ''} selected</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg)', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🧪</div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>No items yet</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Browse the catalog to add compounds</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.key} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 0', borderBottom: '1px solid #f3f4f6',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3 }}>{item.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {item.label} · Code: {item.code}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <button onClick={() => onChangeQty(item.key, -1)} style={{
                      width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border)',
                      background: 'var(--bg)', cursor: 'pointer', fontSize: 14, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy)',
                    }}>−</button>
                    <span style={{ fontSize: 13, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => onChangeQty(item.key, 1)} style={{
                      width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border)',
                      background: 'var(--bg)', cursor: 'pointer', fontSize: 14, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy)',
                    }}>+</button>
                    <button onClick={() => onRemove(item.key)} style={{
                      fontSize: 11, color: 'var(--red)', background: 'none', border: 'none',
                      cursor: 'pointer', marginLeft: 4,
                    }}>Remove</button>
                  </div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', whiteSpace: 'nowrap' }}>
                  {fmt(item.price * item.qty)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '14px 20px 24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)' }}>{fmt(subtotal)}</span>
            </div>
            <button
              onClick={onCheckout}
              style={{
                width: '100%', padding: '14px', background: 'var(--teal)',
                color: '#fff', border: 'none', borderRadius: 14,
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              Submit Request →
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
              🔒 Secure checkout · Research use only
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateX(-50%) translateY(100%) } to { transform: translateX(-50%) translateY(0) } }
      `}</style>
    </>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CatalogPage() {
  const router = useRouter()
  const [cart, setCart] = useState({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [toastMsg, setToastMsg] = useState('')
  const toastRef = useRef(null)

  const cartCount = getTotalItems(cart)

  const filteredProducts = CATALOG.filter(p =>
    p.visible &&
    (
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.variants.some(v => v.code.toLowerCase().includes(query.toLowerCase()))
    )
  )

  function addToCart(productId, code) {
    const key = `${productId}::${code}`
    setCart(prev => ({
      ...prev,
      [key]: { qty: (prev[key]?.qty || 0) + 1 },
    }))
    const product = CATALOG.find(p => p.id === productId)
    const variant = product?.variants.find(v => v.code === code)
    showToast(`${product?.name} (${variant?.label}) added`)
  }

  function changeQty(key, delta) {
    setCart(prev => {
      const qty = Math.max(0, (prev[key]?.qty || 0) + delta)
      if (qty === 0) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: { qty } }
    })
  }

  function removeItem(key) {
    setCart(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function showToast(msg) {
    setToastMsg(msg)
    clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToastMsg(''), 2000)
  }

  function handleCheckout() {
    // Build cart query param for checkout page
    const cartItems = Object.entries(cart)
      .filter(([, v]) => v.qty > 0)
      .map(([key, val]) => {
        const [productId, code] = key.split('::')
        return { productId, code, qty: val.qty }
      })
    const encoded = encodeURIComponent(JSON.stringify(cartItems))
    router.push(`/checkout?cart=${encoded}`)
  }

  return (
    <>
      <Head>
        <title>Research Catalog — Veyra-Life Advanced Research</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Helvetica Neue, system-ui, sans-serif' }}>
        <Topbar cartCount={cartCount} onCartOpen={() => setDrawerOpen(true)} />
        <Hero />
        <SearchBar query={query} setQuery={setQuery} />

        {/* Results count */}
        <div style={{ padding: '12px 20px 4px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
          {filteredProducts.length} compound{filteredProducts.length !== 1 ? 's' : ''} available
        </div>

        {/* Product list */}
        <div style={{ padding: '4px 20px 100px' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔬</div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>No compounds found</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Try a different search term</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                cart={cart}
                onAdd={addToCart}
              />
            ))
          )}
        </div>

        {/* Sticky checkout bar */}
        {cartCount > 0 && !drawerOpen && (
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, padding: '12px 20px 20px',
            background: 'linear-gradient(to top, var(--white) 80%, transparent)',
            zIndex: 90,
          }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                width: '100%', padding: '14px', background: 'var(--navy)',
                color: '#fff', border: 'none', borderRadius: 14,
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              <CartIcon />
              View Request List
              <span style={{
                background: 'var(--teal)', borderRadius: 20, padding: '2px 9px',
                fontSize: 12, fontWeight: 700,
              }}>{cartCount}</span>
            </button>
          </div>
        )}

        {/* Cart drawer */}
        {drawerOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setDrawerOpen(false)}
            onChangeQty={changeQty}
            onRemove={removeItem}
            onCheckout={handleCheckout}
          />
        )}

        {/* Toast */}
        {toastMsg && (
          <div style={{
            position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--navy)', color: '#fff', borderRadius: 20,
            padding: '10px 18px', fontSize: 12, fontWeight: 600,
            zIndex: 300, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            animation: 'fadeIn .2s ease',
          }}>
            ✓ {toastMsg}
          </div>
        )}
      </div>
    </>
  )
}
