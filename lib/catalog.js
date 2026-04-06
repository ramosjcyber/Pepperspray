// lib/catalog.js
// Edit this file to add/remove products and variants

export const CATALOG = [
  {
    id: 'cjc-dac',
    name: 'CJC-1295 With DAC',
    category: 'Research Inventory',
    variants: [
      { code: 'CD5',  label: '5mg',  price: 3800 },  // price in cents
      { code: 'CD10', label: '10mg', price: 6500 },
    ],
  },
  {
    id: 'cjc-no-dac',
    name: 'CJC-1295 Without DAC 5mg + IPA 5mg',
    category: 'Research Inventory',
    variants: [
      { code: 'CP10', label: '10mg', price: 5200 },
      { code: 'CP20', label: '20mg', price: 9400 },
    ],
  },
  {
    id: 'bpc-tb',
    name: 'BPC 5mg + TB 5mg',
    category: 'Research Inventory',
    variants: [
      { code: 'BB10', label: '10mg', price: 5200 },
      { code: 'BB20', label: '20mg', price: 9000 },
    ],
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    category: 'Research Inventory',
    variants: [
      { code: 'TR5',  label: '5mg',  price: 8800 },
      { code: 'TR10', label: '10mg', price: 15500 },
    ],
  },
  {
    id: 'retarutide',
    name: 'Retarutide',
    category: 'Research Inventory',
    variants: [
      { code: 'RT5',  label: '5mg',  price: 9200 },
      { code: 'RT10', label: '10mg', price: 17000 },
    ],
  },
  {
    id: 'selank',
    name: 'Selank',
    category: 'Research Inventory',
    variants: [
      { code: 'SK5',  label: '5mg',  price: 3400 },
      { code: 'SK10', label: '10mg', price: 6000 },
    ],
  },
  {
    id: 'mt2',
    name: 'MT-2 (Melanotan 2 Acetate)',
    category: 'Research Inventory',
    variants: [
      { code: 'ML10', label: '10mg', price: 4800 },
      { code: 'ML20', label: '20mg', price: 8500 },
    ],
  },
  {
    id: 'cagrilintide',
    name: 'Cagrilintide',
    category: 'Research Inventory',
    variants: [
      { code: 'CGL5',  label: '5mg',  price: 9500 },
      { code: 'CGL10', label: '10mg', price: 17500 },
    ],
  },
]

export const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping', eta: '5–7 business days', price: 1200 },
  { id: 'express',  label: 'Express Shipping',  eta: '2–3 business days', price: 2400 },
  { id: 'free',     label: 'Free (Orders $150+)', eta: '7–10 business days', price: 0, minOrder: 15000 },
]

export const CRYPTO_OPTIONS = [
  { id: 'BTC',  label: 'Bitcoin',   symbol: '₿' },
  { id: 'ETH',  label: 'Ethereum',  symbol: 'Ξ' },
  { id: 'USDT', label: 'USDT',      symbol: '₮' },
  { id: 'SOL',  label: 'Solana',    symbol: '◎' },
]
