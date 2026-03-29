# KiranaOS v3.0 — Kirana-First Commerce Layer

A full-stack real-time grocery delivery platform where **local kirana stores are always tried first**, with dark stores (Blinkit/Zepto) used only as fallback.

## 🚀 What's New in v3

### Smart Routing Engine
- **Kirana-first scoring**: kirana stores get an 800m score advantage over dark stores
- **OSRM real road distance**: replaces crow-flies haversine for accurate ETAs
- **Service radius**: each store sets their coverage zone (1–10km slider in dashboard)
- **Partial stock split**: if no kirana has all items, splits order (kirana fills what it can, dark store fills the rest)

### Real-time Rider GPS
- Rider dashboard broadcasts live GPS via Socket.IO (`rider:location` event)
- Customer tracking map shows rider moving in real time
- Multi-stop route: Rider → Store → (optional Dark Store) → Customer drawn as colored polylines

### Customer Experience
- **Store availability badges** on each product showing nearest kirana with stock
- **Live tracking tab** with ETA countdown, progress bar, and live rider on map
- **Savings dashboard**: km saved vs dark store, minutes saved, kirana orders count
- **Platform linking**: link Blinkit/Zepto accounts → orders auto-routed through kirana-first

### Owner Dashboard
- **Analytics**: daily orders, revenue, top 5 products
- **Service radius slider** (1–10km) saved to DB
- **Stock auto-decrement** on order accept
- **Subscription plans** (Basic ₹99/mo, Pro ₹499/mo)

### Rider Dashboard
- Online/offline toggle with live GPS broadcast
- Multi-stop order display (pickup → dark store? → deliver)
- **Earnings tracker** with kirana-first bonus (₹5 extra per kirana-first delivery)

## 🏗 Architecture

- **Backend**: Express + Socket.IO + MongoDB + Redis (optional)
- **Frontend**: React + Vite + React Router
- **Real-time**: Socket.IO WebSockets + rider:location events
- **Maps**: Leaflet.js + OpenStreetMap (no API key required)
- **Routing**: OSRM public API (road distance) with haversine fallback
- **Event Bus**: Redis Pub/Sub with in-process fallback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional — falls back to in-process EventEmitter)

### Backend
```bash
cd backend
npm install
# Edit .env → set MONGO_URI and CLIENT_URL
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Edit .env → VITE_API_URL=http://localhost:3001
npm run dev
```

## 🔐 Demo Credentials

| Role     | Phone           | Password |
|----------|----------------|----------|
| Customer | +919876543210  | demo123  |
| Owner    | +919876543210  | demo123  |
| Rider    | +919876543210  | demo123  |
| Owner 2  | +919876543211  | demo123  |
| Rider 2  | +919900001111  | demo123  |

## 👥 Role Breakdown

### Customer
- Browse 10 products with kirana availability badges
- Live order tracking with rider on map + ETA
- Savings dashboard (km/min saved vs dark store)
- Link Blinkit/Zepto accounts for kirana-first routing

### Shop Owner
- Accept/reject orders (stock auto-decremented on accept)
- Set service radius (how far you deliver)
- Analytics: daily stats + top products
- Inventory management + CSV bulk upload
- Subscription plans (Basic / Pro)

### Rider (Captain)
- Toggle online/offline → GPS broadcasts via socket
- Live map: your position + store + customer with route polylines
- Multi-stop display for split orders (kirana + dark store)
- Earnings history with kirana-first bonus

## 📡 New API Endpoints (v3)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/availability` | Stock map across all stores |
| GET | `/api/store/:id/analytics` | Daily stats + top products |
| PUT | `/api/store/:id/settings` | Update service radius |
| GET | `/api/rider/:id/earnings` | Earnings + bonus total |
| POST | `/api/rider/:id/location` | Update rider GPS (REST fallback) |
| POST | `/api/subscriptions` | Subscribe to a plan |
| GET | `/api/subscriptions/:entityId` | Get active subscriptions |
| POST | `/api/customer/:id/link-platform` | Link Blinkit/Zepto/Swiggy |
| GET | `/api/customer/:id/savings` | Savings summary |
| POST | `/api/order/:id/pickup` | Mark order picked up |
| POST | `/api/zepto/webhook` | Zepto order normalization |

## 📡 New Socket Events (v3)

| Event | Direction | Payload |
|-------|-----------|---------|
| `rider:location` | rider→server→all | `{riderId, lat, lng}` |
| `rider:assigned` | server→all | `{orderId, riderId, riderName}` |
| `track:order` | client→server | `{orderId}` — join order room |

## 📁 CSV Upload Format
```csv
name,price,unit,category,emoji,stock
Amul milk 500ml,28,500ml,dairy,🥛,50
Bread,45,loaf,staples,🍞,30
```
