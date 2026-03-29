# Lync 🔗 - Connecting Kiranas to Quick Commerce

**Empower 12 million kirana stores to compete with dark stores by routing orders directly to them through a single plug-and-play operating platform.**

---

## 🎯 The Problem

### What's Happening Today?

Quick commerce companies like **Blinkit, Zepto, Instamart** are spending **₹100+ crores** to build massive warehouse facilities called "dark stores" in every city. These dark stores:
- Require huge upfront investment
- Hire 50+ employees per store
- Buy inventory in bulk (often goes to waste)
- Only operate in major metro areas

**Meanwhile, 12 million kirana stores across India:**
- Are already stocked with everyday items
- Are literally in your neighborhood (within 500m)
- Are run by families who need income
- Have zero way to connect to these platforms

### The Real Problem

**There is no system that lets a kirana owner "go online" on demand.**

A Rapido captain can open the app and accept rides. A Dunzo delivery partner can log in and pick up tasks. **But a kirana owner has no such option.**

#### Example:
```
🏠 You order Amul milk on Blinkit at 10:15 AM
→ App checks dark stores in Mumbai
→ Nearest dark store is 3 km away
→ Delivery arrives in 35 minutes, costs ₹99
→ ❌ Milk is barely cold, profit margins are thin

What SHOULD happen:
→ App checks: "Shri Ram Kirana" is 200m away AND online
→ Order routes there instantly
→ Owner fulfills in 5 minutes
→ Delivery arrives in 12 minutes, costs ₹25 to deliver
→ ✅ Fresh milk, happy customer, kirana owner earns ₹40 commission
```

---

## 💡 Our Solution: The Operating Layer for Kiranas

We're building **an operating system that sits between quick commerce platforms and kirana stores** — the way Rapido sits between customers and drivers.

### How It Works (3-Step Flow)

<img width="912" height="933" alt="Screenshot from 2026-03-29 17-42-40" src="https://github.com/user-attachments/assets/883e3e07-4901-47b9-b3ba-bb1cf19cebcb" />


### What Makes This Different?

| Aspect | Dark Store Model | Lync + Kirana Model |
|--------|------------------|---------------------|
| **Setup Cost** | ₹1-2 crores per store | ₹0 (existing stores) |
| **Avg. Distance to Customer** | 3-5 km | 0.2-0.5 km |
| **Delivery Time** | 25-40 mins | 8-15 mins |
| **Unit Economics** | Break-even in 18-24 months | Profitable day 1 |
| **Coverage** | 50 stores per city | 5,000+ stores per city |
| **Sustainability** | High inventory waste | Zero waste (pull-based) |

---

## 🏗️ System Architecture

### How Orders Flow Through Lync

<img width="991" height="1052" alt="Screenshot from 2026-03-29 17-43-04" src="https://github.com/user-attachments/assets/e9705f67-e2e0-4644-96b5-d58d87c79fc5" />


---

## 🗄️ Database Schema

### 1️⃣ Store Table
Represents each kirana store registered on Lync.

```json
{
  "id": "store_001",
  "name": "Shri Ram Kirana",
  "ownerName": "Ramesh Kumar",
  "ownerPhone": "+919876543210",
  "ownerEmail": "ramesh@example.com",
  "address": "123 Main St, Colaba, Mumbai",
  "location": {
    "latitude": 19.0176,
    "longitude": 72.8194
  },
  "isOnline": true,
  "activeOrders": 2,
  "totalOrders": 456,
  "avgRating": 4.7,
  "responseTime": 5,
  "verification": {
    "type": "GSTIN",
    "id": "29ABCDE1234F1Z5",
    "isVerified": true,
    "verifiedAt": "2024-01-15T08:00:00Z"
  },
  "operatingHours": {
    "start": "06:00",
    "end": "22:00"
  },
  "products": ["item_001", "item_002", "item_003"],
  "registeredAt": "2024-01-15T08:00:00Z"
}
```

### 2️⃣ Product Table
Catalog of items available at each kirana.

```json
{
  "id": "item_001",
  "storeId": "store_001",
  "name": "Amul Milk 500ml",
  "category": "Dairy",
  "price": 28,
  "stock": 45,
  "reorderLevel": 10,
  "barcode": "8901234567890",
  "imageUrl": "https://cdn.example.com/amul_milk.jpg",
  "lastUpdated": "2024-03-25T10:30:00Z"
}
```

### 3️⃣ Order Table
Customer orders routed through Lync.

```json
{
  "id": "order_KOS-0041",
  "customerId": "cust_123",
  "customerName": "Priya Singh",
  "customerPhone": "+919123456789",
  "storeId": "store_001",
  "storeName": "Shri Ram Kirana",
  "items": [
    {
      "productId": "item_001",
      "productName": "Amul Milk 500ml",
      "quantity": 2,
      "price": 28,
      "subtotal": 56
    },
    {
      "productId": "item_002",
      "productName": "Bread (Standard)",
      "quantity": 1,
      "price": 45,
      "subtotal": 45
    }
  ],
  "orderTotal": 101,
  "commission": 10,
  "status": "ACCEPTED",
  "timeline": {
    "createdAt": "2024-03-25T14:15:00Z",
    "acceptedAt": "2024-03-25T14:15:30Z",
    "packedAt": "2024-03-25T14:18:00Z",
    "pickedUpAt": "2024-03-25T14:20:00Z",
    "deliveredAt": "2024-03-25T14:28:00Z"
  },
  "deliveryPartner": {
    "id": "partner_456",
    "name": "Rahul Sharma",
    "rating": 4.9
  },
  "location": {
    "customerLat": 19.0160,
    "customerLng": 72.8210,
    "storeLat": 19.0176,
    "storeLng": 72.8194,
    "distanceKm": 0.25
  }
}
```

### 4️⃣ User Table
Kirana owners and admins.

```json
{
  "id": "user_001",
  "storeId": "store_001",
  "role": "STORE_OWNER",
  "phone": "+919876543210",
  "email": "ramesh@example.com",
  "passwordHash": "hashed_password",
  "isVerified": true,
  "lastLogin": "2024-03-25T14:00:00Z",
  "createdAt": "2024-01-15T08:00:00Z"
}
```

---

## ✨ Key Features

### For Kirana Owners
- ✅ **One-Click Dashboard**: See all orders in real-time
- ✅ **Smart Notifications**: Push alerts the instant an order arrives
- ✅ **Pick & Pack Workflow**: Barcode scanning + checklist
- ✅ **Earnings Dashboard**: Track commissions, payouts, ratings
- ✅ **Bulk Registration**: Upload inventory once, manage forever
- ✅ **Performance Analytics**: Response time, ratings, peak hours

### For Quick Commerce Platforms
- ✅ **Geo-matched Orders**: Route to nearest available kirana
- ✅ **Fallback Routing**: If kirana can't fulfill, route to dark store
- ✅ **Live Inventory Sync**: Real-time stock updates via API
- ✅ **SLA Guarantees**: Track fulfillment times per kirana
- ✅ **Fraud Detection**: GSTIN verification + owner KYC

### For Delivery Partners
- ✅ **Optimized Pickups**: Orders consolidated by pickup location
- ✅ **Smart Batching**: Pick multiple orders per trip
- ✅ **Real-time Status**: Track order status on the go

---

## 🚀 Tech Stack

| Layer | Technology | Why? |
|-------|-----------|------|
| **Backend** | Node.js + Express | Fast, non-blocking I/O for real-time orders |
| **Database** | MongoDB | Flexible schema for product catalogs |
| **Frontend** (Owner) | React + Vite | Fast, modern UI for real-time updates |
| **Frontend** (Customer) | React Native / Flutter (optional) | Mobile-first for delivery partners |
| **Real-time** | Socket.io | Order notifications, live tracking |
| **Geolocation** | Google Maps API | Distance calculations, store discovery |
| **Payment** | Razorpay / Stripe | Commission payouts to kirana owners |
| **Hosting** | AWS / GCP | Scalable, low-latency infrastructure |
| **Analytics** | Firebase / Mixpanel | Track adoption, order patterns |

---

## 💻 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud: MongoDB Atlas)
- Git

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Lync.git
   cd Lync
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # backend/.env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lync
   JWT_SECRET=your_secret_key
   PORT=5000
   NODE_ENV=development
   GOOGLE_MAPS_API_KEY=your_google_maps_key
   RAZORPAY_KEY=your_razorpay_key
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup (Kirana Owner Dashboard)

1. **Navigate to frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # frontend/.env
   VITE_API_URL=http://localhost:5000
   VITE_MAPS_API_KEY=your_google_maps_key
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Dashboard runs on `http://localhost:5173`

### Test the System

```javascript
// Example: Register a kirana and create an order
const kirana = await registerKirana({
  name: "Shri Ram Kirana",
  ownerPhone: "+919876543210",
  location: { lat: 19.0176, lng: 72.8194 }
});

const order = await createOrder({
  customerId: "cust_123",
  items: [
    { productId: "item_001", quantity: 2 }
  ],
  deliveryLocation: { lat: 19.0160, lng: 72.8210 }
});
```

---

## 📊 How We Solve the Problem (Impact)

### For Customers
| Metric | Dark Store | Lync + Kirana |
|--------|-----------|--------------|
| Delivery Time | 35 mins | 12 mins |
| Distance | 3.5 km | 250 m |
| Delivery Cost | ₹99 | ₹25 |
| Product Freshness | Medium | ✅ High |

### For Kirana Owners
| Metric | Without Lync | With Lync |
|--------|-------------|----------|
| Monthly Orders | 0 | 50-100 |
| Monthly Income | ₹20K (retail only) | ₹25K+ (retail + commission) |
| Effort | High (walk-in only) | Low (digital orders) |
| Growth Potential | Limited | Unlimited |

### For Quick Commerce Platforms
| Metric | Dark Stores | Lync |
|--------|-----------|------|
| Unit Cost per Order | ₹150 | ₹40 |
| Coverage | 50 stores/city | 5,000+ stores/city |
| Time to Scale | 18 months | 3 months |
| Capital Required | ₹100 crores | ₹5 crores |

---

## 🎯 What We're Solving (Why It Matters)

This isn't just about faster delivery. This is about:

1. **Economic Inclusion**: 12 million families can transition from cash-based to digital earnings
2. **Sustainability**: Pull-based orders = zero food waste (vs. bulk dark store inventory)
3. **Hyperlocal Economy**: Keeping money in neighborhoods instead of shipping to central warehouses
4. **Speed & Cost**: Physics is on our side — shorter distances = faster + cheaper
5. **Resilience**: Distributed network survives better than centralized dark stores

---

## 🎓 Hackathon Highlight

### What's Unique About Lync?

✅ **Real market need**: Quick commerce platforms are actively seeking this solution  
✅ **Distributed first**: 12M potential stores (vs. 500 dark stores nationally)  
✅ **Unit economics work on day 1**: Don't need to build expensive infrastructure  
✅ **Regulatory advantage**: Existing GSTIN-verified stores, less red tape  
✅ **Defensible moat**: Liquidity (both kirana supply + customer demand) is hard to replicate  

---

## 📝 API Examples

### 1. Register a Kirana
```bash
POST /api/stores/register
Content-Type: application/json

{
  "name": "Shri Ram Kirana",
  "ownerName": "Ramesh Kumar",
  "ownerPhone": "+919876543210",
  "address": "123 Main St, Mumbai",
  "gstin": "29ABCDE1234F1Z5",
  "location": {
    "latitude": 19.0176,
    "longitude": 72.8194
  }
}

Response: { "storeId": "store_001", "status": "REGISTERED" }
```

### 2. Create an Order
```bash
POST /api/orders/create
Content-Type: application/json

{
  "customerId": "cust_123",
  "items": [
    { "productId": "item_001", "quantity": 2 }
  ],
  "deliveryLocation": {
    "latitude": 19.0160,
    "longitude": 72.8210
  }
}

Response: { "orderId": "order_KOS-0041", "assignedStoreId": "store_001" }
```

### 3. Accept Order (Kirana)
```bash
POST /api/orders/:orderId/accept
Authorization: Bearer <token>

Response: { "status": "ACCEPTED", "estimatedPackTime": 5 }
```

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

**Code Style**: Follow ESLint + Prettier configuration in the repo.

---

## 📋 Roadmap

### Phase 1 (MVP) - Current
- ✅ Kirana registration & verification
- ✅ Real-time order routing
- ✅ Basic dashboard
- ✅ Commission tracking

### Phase 2 (3 months)
- 📦 Inventory management (AI-powered reorder suggestions)
- 📊 Analytics dashboard
- 🔗 Integration with Blinkit / Zepto APIs
- 💳 Automated payouts

### Phase 3 (6 months)
- 🤖 ML-based demand forecasting per kirana
- 🚚 Direct integration with delivery partners
- 🌐 Marketplace for kiranas to sell to each other
- 📱 Mobile app (iOS + Android)

---


## 🙏 Acknowledgments

This project was built for Vashisht Hackathon 3.0 with the goal of creating economic opportunity for India's 12 million kirana store owners.

**Team**: Gopals
**Built in**: 24 hours  
**With**: ☕ Coffee, Craziness, and 🚀 Passion

---

<p align="center">
  <strong>Connecting local stores to digital commerce.</strong>
  <br>
  <a href="https://lync.com">Website</a> • 
  <a href="https://github.com/Pavan2589/Lync">GitHub</a> • 
</p>
