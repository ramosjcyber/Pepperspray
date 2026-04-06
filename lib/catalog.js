// lib/catalog.js
// Edit prices (in cents) and visibility to manage your storefront

export const CATALOG = [
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    category: 'Research Inventory',
    visible: true,
    description: 'Dual GIP/GLP-1 receptor agonist peptide for metabolic research.',
    variants: [
      { label: '5mg',  code: 'TR5',  price: 8800  },
      { label: '10mg', code: 'TR10', price: 15500 },
      { label: '15mg', code: 'TR15', price: 21000 },
      { label: '20mg', code: 'TR20', price: 26500 },
      { label: '30mg', code: 'TR30', price: 37500 },
      { label: '40mg', code: 'TR40', price: 48000 },
      { label: '50mg', code: 'TR50', price: 57500 },
      { label: '60mg', code: 'TR60', price: 66000 },
    ],
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    category: 'Research Inventory',
    visible: true,
    description: 'Triple receptor agonist (GIP/GLP-1/glucagon) for advanced metabolic research.',
    variants: [
      { label: '5mg',  code: 'RT5',  price: 9200  },
      { label: '10mg', code: 'RT10', price: 17000 },
      { label: '15mg', code: 'RT15', price: 23500 },
      { label: '20mg', code: 'RT20', price: 29500 },
      { label: '30mg', code: 'RT30', price: 42000 },
      { label: '40mg', code: 'RT40', price: 54000 },
      { label: '60mg', code: 'RT60', price: 77000 },
    ],
  },
  {
    id: 'cagrilintide',
    name: 'Cagrilintide',
    category: 'Research Inventory',
    visible: true,
    description: 'Long-acting amylin analogue for appetite and glucose regulation research.',
    variants: [
      { label: '5mg', code: 'CGL5', price: 9500 },
    ],
  },
  {
    id: 'mt2',
    name: 'MT-2 (Melanotan 2 Acetate)',
    category: 'Research Inventory',
    visible: true,
    description: 'Synthetic melanocortin peptide used in pigmentation and libido research.',
    variants: [
      { label: '10mg', code: 'ML10', price: 4800 },
    ],
  },
  {
    id: 'selank',
    name: 'Selank',
    category: 'Research Inventory',
    visible: true,
    description: 'Anxiolytic peptide of the tuftsin family used in neurological research.',
    variants: [
      { label: '10mg', code: 'SK10', price: 6000 },
    ],
  },
  {
    id: 'bpc157',
    name: 'BPC157',
    category: 'Research Inventory',
    visible: true,
    description: 'Body protection compound with regenerative and anti-inflammatory research applications.',
    variants: [
      { label: '5mg',  code: 'BC5',  price: 3800 },
      { label: '10mg', code: 'BC10', price: 6500 },
    ],
  },
  {
    id: 'bpc-tb',
    name: 'Wolverine (BPC 5mg + TB 5mg)',
    category: 'Research Inventory',
    visible: true,
    description: 'Synergistic blend of BPC-157 and TB-500 for tissue repair research.',
    variants: [
      { label: '10mg', code: 'BB10', price: 5200 },
    ],
  },
  {
    id: 'tb500',
    name: 'TB500 (Thymosin B4 Acetate)',
    category: 'Research Inventory',
    visible: true,
    description: 'Thymosin beta-4 peptide studied for wound healing and tissue regeneration.',
    variants: [
      { label: '5mg', code: 'BT5', price: 4400 },
    ],
  },
  {
    id: 'cjc-no-dac',
    name: 'CJC-1295 Without DAC 5mg + IPA 5mg',
    category: 'Research Inventory',
    visible: true,
    description: 'GHRH analogue + Ipamorelin combination for growth hormone secretagogue research.',
    variants: [
      { label: '10mg', code: 'CP10', price: 5200 },
    ],
  },
  {
    id: 'cjc-dac',
    name: 'CJC-1295 With DAC',
    category: 'Research Inventory',
    visible: true,
    description: 'Long-acting GHRH analogue with Drug Affinity Complex for extended half-life research.',
    variants: [
      { label: '5mg', code: 'CD5', price: 3800 },
    ],
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    category: 'Research Inventory',
    visible: true,
    description: 'Selective growth hormone secretagogue with minimal side effect profile in research models.',
    variants: [
      { label: '5mg', code: 'IP5', price: 3400 },
    ],
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    category: 'Research Inventory',
    visible: true,
    description: 'Synthetic GHRH analogue studied for visceral adiposity and metabolic conditions.',
    variants: [
      { label: '5mg',  code: 'TSM5',  price: 5500  },
      { label: '10mg', code: 'TSM10', price: 9800  },
      { label: '20mg', code: 'TSM20', price: 17500 },
    ],
  },
  {
    id: 'mots-c',
    name: 'MOTS-C',
    category: 'Research Inventory',
    visible: true,
    description: 'Mitochondrial-derived peptide studied for insulin sensitivity and metabolic regulation.',
    variants: [
      { label: '10mg', code: 'MS10', price: 7500 },
    ],
  },
  {
    id: 'ghk-cu',
    name: 'GHK-CU',
    category: 'Research Inventory',
    visible: true,
    description: 'Copper-binding tripeptide researched for skin regeneration and wound healing.',
    variants: [
      { label: '50mg',  code: 'CU50',  price: 4200 },
      { label: '100mg', code: 'CU100', price: 7500 },
    ],
  },
  {
    id: 'nad',
    name: 'NAD',
    category: 'Research Inventory',
    visible: true,
    description: 'Nicotinamide adenine dinucleotide coenzyme studied for cellular energy and aging research.',
    variants: [
      { label: '500mg', code: 'NJ500', price: 8800 },
    ],
  },
  {
    id: 'tb-bpc-ghk',
    name: 'GLOW (TB10mg + BPC10mg + GHK50mg)',
    category: 'Research Inventory',
    visible: true,
    description: 'Triple-compound regenerative research blend combining TB-500, BPC-157, and GHK-CU.',
    variants: [
      { label: '70mg', code: 'BBG70', price: 9800 },
    ],
  },
  {
    id: 'tb-bpc-ghk-kpv',
    name: 'KLOW (TB10mg + BPC10mg + GHK50mg + KPV10mg)',
    category: 'Research Inventory',
    visible: true,
    description: 'Quad-compound regenerative blend with added KPV for inflammation research.',
    variants: [
      { label: '80mg', code: 'KLOW', price: 11500 },
    ],
  },
  {
    id: 'kpv',
    name: 'KPV',
    category: 'Research Inventory',
    visible: true,
    description: 'Alpha-MSH-derived tripeptide studied for anti-inflammatory and gut healing applications.',
    variants: [
      { label: '10mg', code: 'KP10', price: 4200 },
    ],
  },
  {
    id: 'lipo-c',
    name: 'Lipo-C',
    category: 'Research Inventory',
    visible: true,
    description: 'Lipotropic compound blend for metabolic and liver function research.',
    variants: [
      { label: '10ml', code: 'LC216', price: 5500 },
    ],
  },
  {
    id: 'lipo-b',
    name: 'Lipo-B',
    category: 'Research Inventory',
    visible: true,
    description: 'B-vitamin lipotropic compound blend used in metabolic and fat metabolism research.',
    variants: [
      { label: '10ml', code: 'LC120', price: 4800 },
    ],
  },
  {
    id: 'antibacterial-water',
    name: 'Antibacterial Water',
    category: 'Research Inventory',
    visible: true,
    description: 'Sterile bacteriostatic water for reconstituting lyophilized research peptides.',
    variants: [
      { label: '3ml',  code: 'BA3',  price: 1200 },
      { label: '10ml', code: 'BA10', price: 2800 },
    ],
  },
  {
    id: 'hgh',
    name: 'HGH',
    category: 'Research Inventory',
    visible: true,
    description: 'Recombinant human growth hormone for in-vitro and laboratory research use.',
    variants: [
      { label: '15iu', code: 'H15', price: 14500 },
      { label: '24iu', code: 'H24', price: 21000 },
    ],
  },
  {
    id: 'glutathione',
    name: 'Glutathione',
    category: 'Research Inventory',
    visible: true,
    description: 'Master antioxidant tripeptide studied for oxidative stress and immune function.',
    variants: [
      { label: '600mg', code: 'GTT', price: 6500 },
    ],
  },
  {
    id: 'ghk-powder',
    name: 'GHK Raw Powder',
    category: 'Research Inventory',
    visible: true,
    description: 'Unformulated GHK-CU raw powder for research and compounding purposes.',
    variants: [
      { label: 'Standard', code: 'GHK', price: 3800 },
    ],
  },
]

export const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping',   eta: '5–7 business days',   price: 1200 },
  { id: 'express',  label: 'Express Shipping',    eta: '2–3 business days',   price: 2400 },
  { id: 'free',     label: 'Free (Orders $150+)', eta: '7–10 business days',  price: 0, minOrder: 15000 },
]

export const CRYPTO_OPTIONS = [
  { id: 'BTC',  label: 'Bitcoin',  symbol: '₿' },
  { id: 'ETH',  label: 'Ethereum', symbol: 'Ξ' },
  { id: 'USDT', label: 'USDT',     symbol: '₮' },
  { id: 'SOL',  label: 'Solana',   symbol: '◎' },
]
