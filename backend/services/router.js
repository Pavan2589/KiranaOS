// services/router.js — KiranaOS v3 Smart Router
// Kirana-first scoring: kirana stores get 800m advantage over dark stores.
// Falls back to dark store if no kirana found or order items unavailable.
// Note: requires Node 18+ for native fetch, or install node-fetch@3
// Uses OSRM for real road distance (with haversine fallback if offline).

const { Store } = require('../models');

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const r = d => d * Math.PI / 180;
  const dLat = r(lat2 - lat1), dLng = r(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(r(lat1))*Math.cos(r(lat2))*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function getRoadDistance(fromLat, fromLng, toLat, toLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    const data = await res.json();
    if (data.code === 'Ok' && data.routes?.[0]) {
      return { distanceMeters: Math.round(data.routes[0].distance), durationSeconds: Math.round(data.routes[0].duration) };
    }
  } catch (_) {}
  // fallback: haversine with 1.35x road factor
  const dist = haversine(fromLat, fromLng, toLat, toLng);
  return { distanceMeters: Math.round(dist * 1.35), durationSeconds: Math.round(dist * 1.35 / 250) };
}

// Score a store candidate (lower = better)
// Kirana stores get 800m bonus subtracted from score
function scoreStore(distanceMeters, activeOrders, storeType) {
  const kiranaBonus = storeType === 'kirana' ? 800 : 0;
  return (distanceMeters - kiranaBonus) + activeOrders * 500;
}

async function routeOrder(order, excludeStoreIds = []) {
  const customer = order.customerSnapshot;
  if (!customer) return null;

  const stores = await Store.find({
    isOnline: true,
    'verification.isVerified': true,
    id: { $nin: excludeStoreIds }
  });

  const orderItemIds = order.items.map(i => i.id);

  // Full-stock candidates (have ALL items)
  const fullCandidates = stores.filter(store => {
    const storeIds = new Set(store.products.map(p => p.id));
    return orderItemIds.every(id => storeIds.has(id));
  });

  // Partial-stock candidates (kirana only, for split fulfillment)
  const partialKirana = stores.filter(store =>
    store.storeType === 'kirana' &&
    !fullCandidates.find(s => s.id === store.id) &&
    orderItemIds.some(id => store.products.find(p => p.id === id && p.stock > 0))
  );

  // Score full candidates with road distance
  const scored = await Promise.all(fullCandidates.map(async store => {
    const { distanceMeters, durationSeconds } = await getRoadDistance(
      store.lat, store.lng, customer.lat, customer.lng
    );
    // Check service radius
    const straightDist = haversine(store.lat, store.lng, customer.lat, customer.lng);
    if (store.storeType === 'kirana' && straightDist > (store.serviceRadiusKm || 3) * 1000) return null;

    const score = scoreStore(distanceMeters, store.activeOrders, store.storeType);
    const etaMinutes = Math.max(8, Math.round(durationSeconds / 60) + 4);
    return { store, score, distanceMeters, etaMinutes };
  }));

  const valid = scored.filter(Boolean).sort((a, b) => a.score - b.score);
  if (valid.length) return { ...valid[0], splitItems: null };

  // --- PARTIAL SPLIT: best kirana for some items + dark store for rest ---
  if (partialKirana.length) {
    const bestKirana = await (async () => {
      const s = await Promise.all(partialKirana.map(async store => {
        const { distanceMeters, durationSeconds } = await getRoadDistance(
          store.lat, store.lng, customer.lat, customer.lng
        );
        const straightDist = haversine(store.lat, store.lng, customer.lat, customer.lng);
        if (straightDist > (store.serviceRadiusKm || 3) * 1000) return null;
        return { store, distanceMeters, etaMinutes: Math.max(8, Math.round(durationSeconds/60)+4), score: scoreStore(distanceMeters, store.activeOrders, 'kirana') };
      }));
      return s.filter(Boolean).sort((a,b)=>a.score-b.score)[0];
    })();

    if (bestKirana) {
      const kiranaProductIds = new Set(bestKirana.store.products.map(p => p.id));
      const kiranaItems = order.items.filter(i => kiranaProductIds.has(i.id));
      const darkItems = order.items.filter(i => !kiranaProductIds.has(i.id));
      return { ...bestKirana, splitItems: { kiranaItems, darkItems } };
    }
  }

  // --- DARK STORE FALLBACK: route entire order to the nearest online dark store ---
  const darkStores = stores.filter(s => s.storeType === 'darkStore');
  if (darkStores.length) {
    const scoredDark = await Promise.all(darkStores.map(async store => {
      const { distanceMeters, durationSeconds } = await getRoadDistance(
        store.lat, store.lng, customer.lat, customer.lng
      );
      const score = scoreStore(distanceMeters, store.activeOrders, 'darkStore');
      const etaMinutes = Math.max(10, Math.round(durationSeconds / 60) + 6);
      return { store, score, distanceMeters, etaMinutes };
    }));
    const bestDark = scoredDark.sort((a, b) => a.score - b.score)[0];
    if (bestDark) return { ...bestDark, splitItems: null };
  }

  return null;
}

// Find nearest available rider to a given location
async function findNearestRider(lat, lng, excludeRiderIds = []) {
  const { Rider } = require('../models');
  const riders = await Rider.find({ isOnline: true, isAvailable: true, id: { $nin: excludeRiderIds } });
  if (!riders.length) return null;
  // Only consider riders whose GPS location has been reported (not null)
  const located = riders.filter(r => r.currentLat != null && r.currentLng != null);
  if (!located.length) return null;
  const scored = located.map(r => ({
    rider: r,
    dist: haversine(r.currentLat, r.currentLng, lat, lng)
  })).sort((a,b) => a.dist - b.dist);
  return scored[0]?.rider || null;
}

module.exports = { routeOrder, findNearestRider, haversine, getRoadDistance };
