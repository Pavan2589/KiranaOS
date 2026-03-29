// seed/data.js — KiranaOS v3 (includes dark store) — Chennai (55 kirana stores + 2 dark stores)
const STORES = [
  // ── EXISTING 5 STORES ─────────────────────────────────────────────────────
  {
    id: 'store_001', name: 'Murugan Kirana Store', ownerPhone: '+919876543210', ownerName: 'Murugan Selvam', ownerPassword: 'demo123',
    address: '14, Anna Salai, T. Nagar', lat: 13.0418, lng: 80.2341, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33ABCDE1234F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 50 },
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 30 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 100 }
    ]
  },
  {
    id: 'store_002', name: 'Lakshmi Provisions', ownerPhone: '+919876543211', ownerName: 'Lakshmi Rajan', ownerPassword: 'demo123',
    address: '7, Pondy Bazaar, T. Nagar', lat: 13.0389, lng: 80.2327, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33ABCDE1234F2Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 40 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 200 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 20 }
    ]
  },
  {
    id: 'store_003', name: 'Vinayaga General Store', ownerPhone: '+919876543212', ownerName: 'Vinayagam Pillai', ownerPassword: 'demo123',
    address: '3, Luz Church Road, Mylapore', lat: 13.0339, lng: 80.2676, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-01-0012345', isVerified: true },
    products: [
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 25 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 80 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 150 }
    ]
  },
  {
    id: 'store_004', name: 'Saravana Mini Mart', ownerPhone: '+919876543213', ownerName: 'Saravanan Arumugam', ownerPassword: 'demo123',
    address: '21, GST Road, Chromepet', lat: 12.9516, lng: 80.1462, isOnline: false, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33ABCDE1234F4Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 30 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 40 }
    ]
  },
  {
    id: 'store_005', name: 'Vel Murugan Kirana', ownerPhone: '+919876543215', ownerName: 'Velmurugan Durai', ownerPassword: 'demo123',
    address: '9, OMR, Sholinganallur', lat: 12.9010, lng: 80.2279, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 5,
    verification: { type: 'GSTIN', id: '33ABCDE1234F6Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 35 },
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 20 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 200 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 30 }
    ]
  },

  // ── 50 NEW KIRANA STORES ──────────────────────────────────────────────────

  // Anna Nagar cluster
  {
    id: 'store_006', name: 'Annamalai Provisions', ownerPhone: '+919800100006', ownerName: 'Annamalai Sundaram', ownerPassword: 'demo123',
    address: '42, 2nd Avenue, Anna Nagar', lat: 13.0850, lng: 80.2101, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE006F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 60 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 90 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 120 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 45 }
    ]
  },
  {
    id: 'store_007', name: 'Rajam General Stores', ownerPhone: '+919800100007', ownerName: 'Rajamani Iyer', ownerPassword: 'demo123',
    address: '18, 6th Main Road, Anna Nagar West', lat: 13.0891, lng: 80.2043, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-02-0012346', isVerified: true },
    products: [
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 40 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 25 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 200 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 50 }
    ]
  },
  {
    id: 'store_008', name: 'Ganesha Kirana', ownerPhone: '+919800100008', ownerName: 'Ganeshan Pillai', ownerPassword: 'demo123',
    address: '5, Shanthi Colony, Anna Nagar', lat: 13.0820, lng: 80.2155, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE008F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 55 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 300 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 35 }
    ]
  },

  // Adyar cluster
  {
    id: 'store_009', name: 'Subramanian Stores', ownerPhone: '+919800100009', ownerName: 'Subramanian Nair', ownerPassword: 'demo123',
    address: '11, Gandhi Nagar, Adyar', lat: 13.0012, lng: 80.2565, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE009F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 70 },
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 35 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 110 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 40 }
    ]
  },
  {
    id: 'store_010', name: 'Ponni Departmental', ownerPhone: '+919800100010', ownerName: 'Ponnusamy Raj', ownerPassword: 'demo123',
    address: '34, Lattice Bridge Road, Adyar', lat: 13.0075, lng: 80.2510, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-03-0012347', isVerified: true },
    products: [
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 250 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 30 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 100 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 60 }
    ]
  },

  // Kodambakkam cluster
  {
    id: 'store_011', name: 'Selvi Provisions', ownerPhone: '+919800100011', ownerName: 'Selvakumar Rajan', ownerPassword: 'demo123',
    address: '67, Kodambakkam High Road', lat: 13.0523, lng: 80.2210, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE011F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 45 },
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 28 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 180 }
    ]
  },
  {
    id: 'store_012', name: 'Mahalakshmi Kirana', ownerPhone: '+919800100012', ownerName: 'Mahalakshmi Devi', ownerPassword: 'demo123',
    address: '23, Arcot Road, Kodambakkam', lat: 13.0490, lng: 80.2185, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE012F1Z5', isVerified: true },
    products: [
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 95 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 45 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 55 }
    ]
  },

  // Velachery cluster
  {
    id: 'store_013', name: 'Pandian Departmental', ownerPhone: '+919800100013', ownerName: 'Pandian Murugesan', ownerPassword: 'demo123',
    address: '8, Vijaya Nagar, Velachery', lat: 12.9792, lng: 80.2204, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE013F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 65 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 220 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 22 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 110 }
    ]
  },
  {
    id: 'store_014', name: 'Sri Sai Stores', ownerPhone: '+919800100014', ownerName: 'Saikumar Venkat', ownerPassword: 'demo123',
    address: '15, Taramani Link Road, Velachery', lat: 12.9855, lng: 80.2240, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-04-0012348', isVerified: true },
    products: [
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 32 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 85 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 55 }
    ]
  },
  {
    id: 'store_015', name: 'Thirumala Kirana', ownerPhone: '+919800100015', ownerName: 'Thirumala Naidu', ownerPassword: 'demo123',
    address: '3, 100 Feet Road, Velachery', lat: 12.9760, lng: 80.2170, isOnline: false, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE015F1Z5', isVerified: true },
    products: [
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 160 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 40 }
    ]
  },

  // Perambur cluster
  {
    id: 'store_016', name: 'Kamala Kirana Centre', ownerPhone: '+919800100016', ownerName: 'Kamalakannan S', ownerPassword: 'demo123',
    address: '56, Perambur Barracks Road', lat: 13.1180, lng: 80.2350, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE016F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 80 },
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 45 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 60 }
    ]
  },
  {
    id: 'store_017', name: 'Bharathi Departmental', ownerPhone: '+919800100017', ownerName: 'Bharathidasan Kumar', ownerPassword: 'demo123',
    address: '12, Govindappa Naicken Street, Perambur', lat: 13.1220, lng: 80.2310, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE017F1Z5', isVerified: true },
    products: [
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 75 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 280 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 18 }
    ]
  },

  // Porur cluster
  {
    id: 'store_018', name: 'Valli Kirana Mart', ownerPhone: '+919800100018', ownerName: 'Valliammal Ravi', ownerPassword: 'demo123',
    address: '29, Porur Main Road', lat: 13.0380, lng: 80.1578, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-05-0012349', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 55 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 170 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 90 }
    ]
  },
  {
    id: 'store_019', name: 'Senthil Stores', ownerPhone: '+919800100019', ownerName: 'Senthilkumar P', ownerPassword: 'demo123',
    address: '6, Trunk Road, Porur', lat: 13.0350, lng: 80.1620, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'GSTIN', id: '33STORE019F1Z5', isVerified: true },
    products: [
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 38 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 88 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 42 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 48 }
    ]
  },

  // Tambaram cluster
  {
    id: 'store_020', name: 'Kaveri Provisions', ownerPhone: '+919800100020', ownerName: 'Kaveri Shankar', ownerPassword: 'demo123',
    address: '44, Tambaram Sanatorium Road', lat: 12.9249, lng: 80.1000, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'GSTIN', id: '33STORE020F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 50 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 240 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 50 }
    ]
  },
  {
    id: 'store_021', name: 'Saraswathi Kirana', ownerPhone: '+919800100021', ownerName: 'Saraswathi Balasubramanian', ownerPassword: 'demo123',
    address: '17, West Tambaram', lat: 12.9300, lng: 80.1060, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-06-0012350', isVerified: true },
    products: [
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 30 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 27 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 195 }
    ]
  },

  // Egmore cluster
  {
    id: 'store_022', name: 'Prakash General Stores', ownerPhone: '+919800100022', ownerName: 'Prakash Narayanan', ownerPassword: 'demo123',
    address: '88, Egmore High Road', lat: 13.0780, lng: 80.2620, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE022F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 75 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 100 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 130 }
    ]
  },
  {
    id: 'store_023', name: 'Aruna Kirana Centre', ownerPhone: '+919800100023', ownerName: 'Aruna Krishnamurthy', ownerPassword: 'demo123',
    address: '31, Poonamallee High Road, Egmore', lat: 13.0730, lng: 80.2580, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE023F1Z5', isVerified: true },
    products: [
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 260 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 38 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 52 }
    ]
  },

  // Royapettah / Nungambakkam
  {
    id: 'store_024', name: 'Meenakshi Stores', ownerPhone: '+919800100024', ownerName: 'Meenakshi Sundaram', ownerPassword: 'demo123',
    address: '4, Royapettah High Road', lat: 13.0540, lng: 80.2630, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE024F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 62 },
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 33 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 24 }
    ]
  },
  {
    id: 'store_025', name: 'Nungambakkam Provisions', ownerPhone: '+919800100025', ownerName: 'Natarajan Pillai', ownerPassword: 'demo123',
    address: '16, Nungambakkam High Road', lat: 13.0569, lng: 80.2425, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-07-0012351', isVerified: true },
    products: [
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 92 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 155 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 48 }
    ]
  },

  // Guindy cluster
  {
    id: 'store_026', name: 'Kumaran General Stores', ownerPhone: '+919800100026', ownerName: 'Kumaran Sethupathi', ownerPassword: 'demo123',
    address: '77, Guindy Industrial Estate Road', lat: 13.0067, lng: 80.2206, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE026F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 58 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 230 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 115 }
    ]
  },
  {
    id: 'store_027', name: 'Devi Kirana Stores', ownerPhone: '+919800100027', ownerName: 'Devi Ramasamy', ownerPassword: 'demo123',
    address: '5, Sardar Patel Road, Guindy', lat: 13.0100, lng: 80.2170, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE027F1Z5', isVerified: true },
    products: [
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 36 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 44 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 58 }
    ]
  },

  // Besant Nagar cluster
  {
    id: 'store_028', name: 'Coastal Kirana', ownerPhone: '+919800100028', ownerName: 'Coastal Balamurugan', ownerPassword: 'demo123',
    address: '22, Elliot Beach Road, Besant Nagar', lat: 12.9985, lng: 80.2728, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE028F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 68 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 98 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 26 }
    ]
  },
  {
    id: 'store_029', name: 'Sindhu Departmental', ownerPhone: '+919800100029', ownerName: 'Sindhu Jayakumar', ownerPassword: 'demo123',
    address: '9, 3rd Main Road, Besant Nagar', lat: 13.0025, lng: 80.2695, isOnline: false, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-08-0012352', isVerified: true },
    products: [
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 145 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 52 }
    ]
  },

  // Pallavaram cluster
  {
    id: 'store_030', name: 'Karpagam Provisions', ownerPhone: '+919800100030', ownerName: 'Karpagam Suresh', ownerPassword: 'demo123',
    address: '38, Pallavaram Main Road', lat: 12.9675, lng: 80.1491, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'GSTIN', id: '33STORE030F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 48 },
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 27 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 210 }
    ]
  },
  {
    id: 'store_031', name: 'Thiruvenkatam Kirana', ownerPhone: '+919800100031', ownerName: 'Thiruvenkatam Rao', ownerPassword: 'demo123',
    address: '14, Airport Road, Pallavaram', lat: 12.9630, lng: 80.1540, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'GSTIN', id: '33STORE031F1Z5', isVerified: true },
    products: [
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 82 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 47 }
    ]
  },

  // Avadi cluster
  {
    id: 'store_032', name: 'Mutheswari Provisions', ownerPhone: '+919800100032', ownerName: 'Mutheswari Gopal', ownerPassword: 'demo123',
    address: '52, Avadi Main Road', lat: 13.1148, lng: 80.0982, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'GSTIN', id: '33STORE032F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 72 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 29 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 98 }
    ]
  },
  {
    id: 'store_033', name: 'Rajan General Stores', ownerPhone: '+919800100033', ownerName: 'Rajanbabu Thillai', ownerPassword: 'demo123',
    address: '6, Camp Road, Avadi', lat: 13.1060, lng: 80.1020, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-09-0012353', isVerified: true },
    products: [
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 29 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 188 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 44 }
    ]
  },

  // Tondiarpet / Washermanpet
  {
    id: 'store_034', name: 'North Star Kirana', ownerPhone: '+919800100034', ownerName: 'Narayanan Samy', ownerPassword: 'demo123',
    address: '19, Tondiarpet Main Road', lat: 13.1284, lng: 80.2890, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE034F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 42 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 270 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 36 }
    ]
  },
  {
    id: 'store_035', name: 'Washermanpet Provisions', ownerPhone: '+919800100035', ownerName: 'Vasantha Kumar', ownerPassword: 'demo123',
    address: '33, Washermanpet High Road', lat: 13.1340, lng: 80.2840, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE035F1Z5', isVerified: true },
    products: [
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 34 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 78 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 44 }
    ]
  },

  // Pattabiram cluster
  {
    id: 'store_036', name: 'Thilagam Kirana', ownerPhone: '+919800100036', ownerName: 'Thilagavathi Ramesh', ownerPassword: 'demo123',
    address: '8, Pattabiram Station Road', lat: 13.1148, lng: 80.0500, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 5,
    verification: { type: 'GSTIN', id: '33STORE036F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 55 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 20 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 58 }
    ]
  },

  // Ambattur cluster
  {
    id: 'store_037', name: 'Industrial Kirana', ownerPhone: '+919800100037', ownerName: 'Indumathi Subramaniam', ownerPassword: 'demo123',
    address: '24, Ambattur Industrial Estate Main Road', lat: 13.1100, lng: 80.1585, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE037F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 66 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 175 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 105 }
    ]
  },
  {
    id: 'store_038', name: 'Ponmalar Stores', ownerPhone: '+919800100038', ownerName: 'Ponmalar Rajan', ownerPassword: 'demo123',
    address: '11, OAT Road, Ambattur', lat: 13.1050, lng: 80.1620, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-10-0012354', isVerified: true },
    products: [
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 88 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 245 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 41 }
    ]
  },

  // Saidapet cluster
  {
    id: 'store_039', name: 'Jayam Kirana', ownerPhone: '+919800100039', ownerName: 'Jayakanthan Murugan', ownerPassword: 'demo123',
    address: '45, Saidapet Main Road', lat: 13.0215, lng: 80.2238, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE039F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 60 },
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 31 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 49 }
    ]
  },
  {
    id: 'store_040', name: 'Chandra Stores', ownerPhone: '+919800100040', ownerName: 'Chandrasekaran Nair', ownerPassword: 'demo123',
    address: '7, Alandur Road, Saidapet', lat: 13.0185, lng: 80.2260, isOnline: false, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE040F1Z5', isVerified: true },
    products: [
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 23 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 95 }
    ]
  },

  // Triplicane / Chepauk
  {
    id: 'store_041', name: 'Crescent Provisions', ownerPhone: '+919800100041', ownerName: 'Crescent Abdulla', ownerPassword: 'demo123',
    address: '12, Triplicane High Road', lat: 13.0614, lng: 80.2780, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE041F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 52 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 96 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 162 }
    ]
  },
  {
    id: 'store_042', name: 'Heritage Kirana', ownerPhone: '+919800100042', ownerName: 'Hemalatha Venkatesan', ownerPassword: 'demo123',
    address: '28, Wallajah Road, Chepauk', lat: 13.0633, lng: 80.2818, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-11-0012355', isVerified: true },
    products: [
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 255 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 46 }
    ]
  },

  // OMR / Perungudi
  {
    id: 'store_043', name: 'OMR Provisions', ownerPhone: '+919800100043', ownerName: 'Omkar Selvam', ownerPassword: 'demo123',
    address: '56, OMR, Perungudi', lat: 12.9606, lng: 80.2430, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'GSTIN', id: '33STORE043F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 57 },
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 26 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 39 }
    ]
  },
  {
    id: 'store_044', name: 'Tech Park Kirana', ownerPhone: '+919800100044', ownerName: 'Tamilarasan Vel', ownerPassword: 'demo123',
    address: '3, Perungudi IT Park Road', lat: 12.9555, lng: 80.2390, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'GSTIN', id: '33STORE044F1Z5', isVerified: true },
    products: [
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 235 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 185 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 53 }
    ]
  },

  // Madipakkam / Medavakkam
  {
    id: 'store_045', name: 'Madinathal Provisions', ownerPhone: '+919800100045', ownerName: 'Madhavan Krishnan', ownerPassword: 'demo123',
    address: '21, Madipakkam Main Road', lat: 12.9627, lng: 80.2000, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'GSTIN', id: '33STORE045F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 63 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 79 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 21 }
    ]
  },
  {
    id: 'store_046', name: 'Venkateswara Kirana', ownerPhone: '+919800100046', ownerName: 'Venkateswaran Aiyer', ownerPassword: 'demo123',
    address: '9, Medavakkam Main Road', lat: 12.9270, lng: 80.1930, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-12-0012356', isVerified: true },
    products: [
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 108 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 51 }
    ]
  },

  // Valasaravakkam
  {
    id: 'store_047', name: 'West Chennai Kirana', ownerPhone: '+919800100047', ownerName: 'Westmani Pillai', ownerPassword: 'demo123',
    address: '34, Valasaravakkam Main Road', lat: 13.0503, lng: 80.1774, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE047F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 46 },
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 24 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 166 }
    ]
  },

  // Thirumangalam
  {
    id: 'store_048', name: 'Nilgiri Provisions', ownerPhone: '+919800100048', ownerName: 'Nilgiris Sundaram', ownerPassword: 'demo123',
    address: '5, Thirumangalam Signal Road', lat: 13.0782, lng: 80.2065, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE048F1Z5', isVerified: true },
    products: [
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 91 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 43 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 56 }
    ]
  },

  // Virugambakkam
  {
    id: 'store_049', name: 'Virugam Kirana', ownerPhone: '+919800100049', ownerName: 'Virutchagiram Balu', ownerPassword: 'demo123',
    address: '17, Arcot Road, Virugambakkam', lat: 13.0597, lng: 80.1945, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE049F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 44 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 225 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 19 }
    ]
  },

  // Santhome / Alwarpet
  {
    id: 'store_050', name: 'Santhome Stores', ownerPhone: '+919800100050', ownerName: 'Santhome Francis', ownerPassword: 'demo123',
    address: '3, Santhome High Road', lat: 13.0335, lng: 80.2783, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE050F1Z5', isVerified: true },
    products: [
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 37 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 112 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 49 }
    ]
  },
  {
    id: 'store_051', name: 'Alwarpet Mini Mart', ownerPhone: '+919800100051', ownerName: 'Alwar Pettai Rajan', ownerPassword: 'demo123',
    address: '27, TTK Road, Alwarpet', lat: 13.0392, lng: 80.2605, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-13-0012357', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 69 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 158 }
    ]
  },

  // Nerkundram / Koyambedu
  {
    id: 'store_052', name: 'Koyambedu Provisions', ownerPhone: '+919800100052', ownerName: 'Koyambedu Suresh', ownerPassword: 'demo123',
    address: '8, Koyambedu Market Complex Road', lat: 13.0700, lng: 80.1940, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE052F1Z5', isVerified: true },
    products: [
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 84 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 130, unit: '1L', category: 'staples', emoji: '🫙', stock: 32 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 82, unit: '500g', category: 'personal care', emoji: '🧺', stock: 61 }
    ]
  },

  // Thoraipakkam
  {
    id: 'store_053', name: 'Thorai Kirana Mart', ownerPhone: '+919800100053', ownerName: 'Thoraisamy Krishnan', ownerPassword: 'demo123',
    address: '11, Thoraipakkam OMR', lat: 12.9311, lng: 80.2356, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 4,
    verification: { type: 'GSTIN', id: '33STORE053F1Z5', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 53 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 10, unit: '100g', category: 'snacks', emoji: '🍪', stock: 215 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 89, unit: '150g', category: 'personal care', emoji: '🪥', stock: 37 }
    ]
  },

  // Purasawalkam
  {
    id: 'store_054', name: 'Pura Kirana Stores', ownerPhone: '+919800100054', ownerName: 'Purasawam Balaji', ownerPassword: 'demo123',
    address: '66, Poonamallee High Road, Purasawalkam', lat: 13.0870, lng: 80.2520, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'GSTIN', id: '33STORE054F1Z5', isVerified: true },
    products: [
      { id: 'item_002', name: 'Bread', price: 45, unit: '400g', category: 'staples', emoji: '🍞', stock: 28 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 54 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 102 }
    ]
  },

  // Padi / Kolathur
  {
    id: 'store_055', name: 'Padi Provisions', ownerPhone: '+919800100055', ownerName: 'Padmavathi Senthil', ownerPassword: 'demo123',
    address: '14, Padi-Kolathur Road', lat: 13.1148, lng: 80.2200, isOnline: true, activeOrders: 0,
    storeType: 'kirana', serviceRadiusKm: 3,
    verification: { type: 'UDYAM', id: 'UDYAM-TN-14-0012358', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 26, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 59 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 22, unit: '1kg', category: 'staples', emoji: '🧂', stock: 87 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14, unit: '70g', category: 'instant', emoji: '🍜', stock: 172 }
    ]
  },

  // ── DARK STORES ───────────────────────────────────────────────────────────
  {
    id: 'store_dark_001', name: 'Blinkit Dark Store (Ambattur)', ownerPhone: '+919800000001', ownerName: 'Dark Store Admin', ownerPassword: 'admin123',
    address: 'Warehouse, SIDCO Industrial Estate, Ambattur', lat: 13.1143, lng: 80.1548, isOnline: true, activeOrders: 0,
    storeType: 'darkStore', serviceRadiusKm: 20,
    verification: { type: 'GSTIN', id: '33DARKSTORE001', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 28, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 500 },
      { id: 'item_002', name: 'Bread', price: 48, unit: '400g', category: 'staples', emoji: '🍞', stock: 500 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 24, unit: '1kg', category: 'staples', emoji: '🧂', stock: 500 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 12, unit: '100g', category: 'snacks', emoji: '🍪', stock: 500 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 135, unit: '1L', category: 'staples', emoji: '🫙', stock: 500 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 15, unit: '70g', category: 'instant', emoji: '🍜', stock: 500 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 92, unit: '150g', category: 'personal care', emoji: '🪥', stock: 500 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 500 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 500 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 85, unit: '500g', category: 'personal care', emoji: '🧺', stock: 500 }
    ]
  },
  {
    id: 'store_dark_002', name: 'Zepto Dark Store (Guindy)', ownerPhone: '+919800000002', ownerName: 'Dark Store Admin 2', ownerPassword: 'admin123',
    address: 'Warehouse, Guindy Industrial Estate', lat: 13.0067, lng: 80.2140, isOnline: true, activeOrders: 0,
    storeType: 'darkStore', serviceRadiusKm: 20,
    verification: { type: 'GSTIN', id: '33DARKSTORE002', isVerified: true },
    products: [
      { id: 'item_001', name: 'Aavin Milk 500ml', price: 28, unit: '500ml', category: 'dairy', emoji: '🥛', stock: 500 },
      { id: 'item_002', name: 'Bread', price: 48, unit: '400g', category: 'staples', emoji: '🍞', stock: 500 },
      { id: 'item_003', name: 'Tata Salt 1kg', price: 24, unit: '1kg', category: 'staples', emoji: '🧂', stock: 500 },
      { id: 'item_004', name: 'Parle-G Biscuits', price: 12, unit: '100g', category: 'snacks', emoji: '🍪', stock: 500 },
      { id: 'item_005', name: 'Sunflower Oil 1L', price: 135, unit: '1L', category: 'staples', emoji: '🫙', stock: 500 },
      { id: 'item_006', name: 'Maggi 2-min Noodles', price: 15, unit: '70g', category: 'instant', emoji: '🍜', stock: 500 },
      { id: 'item_007', name: 'Colgate Toothpaste', price: 92, unit: '150g', category: 'personal care', emoji: '🪥', stock: 500 },
      { id: 'item_008', name: 'Good Day Biscuits', price: 30, unit: '150g', category: 'snacks', emoji: '🍪', stock: 500 },
      { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55, unit: '1kg', category: 'staples', emoji: '🌾', stock: 500 },
      { id: 'item_010', name: 'Surf Excel 500g', price: 85, unit: '500g', category: 'personal care', emoji: '🧺', stock: 500 }
    ]
  }
];

const CUSTOMERS = [
  { id: 'cust_001', name: 'Dhanya',  phone: '+919876543210', password: 'demo123', address: 'Flat 2A, Besant Nagar, Chennai', lat: 13.0002, lng: 80.2668 },
  { id: 'cust_002', name: 'Arjun',   phone: '+919876543220', password: 'demo123', address: '5, Nungambakkam High Road, Chennai', lat: 13.0569, lng: 80.2425 },
  { id: 'cust_003', name: 'Priya',   phone: '+919876543230', password: 'demo123', address: '18, Velachery Main Road, Velachery', lat: 12.9815, lng: 80.2180 }
];

// Riders have no seeded location — currentLat/Lng are set live via GPS when they go online
const RIDERS = [
  { id: 'rider_001', name: 'Karthik', phone: '+919876543210', password: 'demo123', vehicleType: 'bike',    currentLat: null, currentLng: null, isOnline: false, isAvailable: true, earnings: [] },
  { id: 'rider_002', name: 'Senthil', phone: '+919900001111', password: 'demo123', vehicleType: 'scooter', currentLat: null, currentLng: null, isOnline: false, isAvailable: true, earnings: [] }
];

const ALL_PRODUCTS = [
  { id: 'item_001', name: 'Aavin Milk 500ml',    price: 26,  emoji: '🥛', category: 'dairy',         unit: '500ml' },
  { id: 'item_002', name: 'Bread',               price: 45,  emoji: '🍞', category: 'staples',       unit: '400g'  },
  { id: 'item_003', name: 'Tata Salt 1kg',       price: 22,  emoji: '🧂', category: 'staples',       unit: '1kg'   },
  { id: 'item_004', name: 'Parle-G Biscuits',    price: 10,  emoji: '🍪', category: 'snacks',        unit: '100g'  },
  { id: 'item_005', name: 'Sunflower Oil 1L',    price: 130, emoji: '🫙', category: 'staples',       unit: '1L'    },
  { id: 'item_006', name: 'Maggi 2-min Noodles', price: 14,  emoji: '🍜', category: 'instant',       unit: '70g'   },
  { id: 'item_007', name: 'Colgate Toothpaste',  price: 89,  emoji: '🪥', category: 'personal care', unit: '150g'  },
  { id: 'item_008', name: 'Good Day Biscuits',   price: 30,  emoji: '🍪', category: 'snacks',        unit: '150g'  },
  { id: 'item_009', name: 'Aashirvaad Atta 1kg', price: 55,  emoji: '🌾', category: 'staples',       unit: '1kg'   },
  { id: 'item_010', name: 'Surf Excel 500g',     price: 82,  emoji: '🧺', category: 'personal care', unit: '500g'  }
];

module.exports = { STORES, CUSTOMERS, RIDERS, ALL_PRODUCTS };