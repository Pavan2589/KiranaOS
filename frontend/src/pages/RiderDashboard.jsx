// RiderDashboard.jsx — KiranaOS v3 (GPS broadcast + multi-stop map + earnings)
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import { AppHeader, Btn, StatusBadge, Toggle, LiveDot, EmptyState, Toast } from '../components/shared'
import api from '../utils/api'

function useLeaflet() {
  const [loaded, setLoaded] = useState(!!window.L)
  useEffect(() => {
    if (window.L) { setLoaded(true); return }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => setLoaded(true)
    document.head.appendChild(script)
  }, [])
  return loaded
}

function LiveMap({ orders, stores, riderLat, riderLng, activeOrder }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const polylinesRef = useRef([])
  const leafletLoaded = useLeaflet()

  useEffect(() => {
    if (!leafletLoaded || mapInstanceRef.current) return
    const L = window.L
    const map = L.map(mapRef.current, { zoomControl: true }).setView([13.0418, 80.2341], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors', maxZoom: 19
    }).addTo(map)
    mapInstanceRef.current = map
  }, [leafletLoaded])

  useEffect(() => {
    const L = window.L
    if (!L || !mapInstanceRef.current) return
    const map = mapInstanceRef.current

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    polylinesRef.current.forEach(p => p.remove())
    polylinesRef.current = []

    // Rider marker
    if (riderLat && riderLng) {
      const icon = L.divIcon({ className:'', html:`<div style="background:#1A73E8;color:#fff;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🏍️</div>`, iconSize:[38,38], iconAnchor:[19,19] })
      const m = L.marker([riderLat, riderLng], { icon }).addTo(map)
      m.bindPopup('<b>You (Rider)</b>')
      markersRef.current.push(m)
    }

    // Store markers
    stores.filter(s => Number.isFinite(Number(s.lat)) && Number.isFinite(Number(s.lng))).forEach(store => {
      const isDark = store.storeType === 'darkStore'
      const color = !store.isOnline ? '#ccc' : isDark ? '#FC8019' : '#0C831F'
      const icon = L.divIcon({ className:'', html:`<div style="background:${color};color:#fff;width:32px;height:32px;border-radius:${isDark?'4':'8'}px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.2)">${isDark?'🏭':'🏪'}</div>`, iconSize:[32,32], iconAnchor:[16,16] })
      const m = L.marker([Number(store.lat), Number(store.lng)], { icon }).addTo(map)
      m.bindPopup(`<b>${store.name}</b><br/>${store.storeType==='darkStore'?'<span style="color:#FC8019">Dark Store</span>':store.isOnline?'<span style="color:#0C831F">🟢 Open</span>':'<span style="color:#999">🔴 Closed</span>'}`)
      markersRef.current.push(m)
    })

    // Active order: draw route rider→store→customer
    if (activeOrder) {
      const store = stores.find(s => s.id === activeOrder.assignedStoreId)
      const custLat = activeOrder.customerSnapshot?.lat
      const custLng = activeOrder.customerSnapshot?.lng

      if (store && riderLat && riderLng) {
        // Leg 1: Rider → Store (blue)
        const leg1 = L.polyline([[riderLat, riderLng], [store.lat, store.lng]], { color:'#1A73E8', weight:4, dashArray:'8,4', opacity:0.85 }).addTo(map)
        polylinesRef.current.push(leg1)
      }

      if (store && custLat && custLng) {
        // Leg 2: Store → Customer (green)
        const leg2 = L.polyline([[store.lat, store.lng], [custLat, custLng]], { color:'#0C831F', weight:4, opacity:0.85 }).addTo(map)
        polylinesRef.current.push(leg2)
      }

      // Customer marker
      if (custLat && custLng) {
        const custIcon = L.divIcon({ className:'', html:`<div style="background:#FC8019;color:#fff;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid #fff;box-shadow:0 2px 8px rgba(252,128,25,0.5)">📍</div>`, iconSize:[34,34], iconAnchor:[17,17] })
        const m = L.marker([custLat, custLng], { icon: custIcon }).addTo(map)
        m.bindPopup(`<b>Deliver to: ${activeOrder.customerSnapshot?.name}</b>`)
        markersRef.current.push(m)

        // Fit all points
        const points = [[custLat, custLng]]
        if (riderLat) points.push([riderLat, riderLng])
        if (store) points.push([store.lat, store.lng])
        map.fitBounds(L.latLngBounds(points), { padding: [40,40] })
      }
    }
  }, [orders, stores, riderLat, riderLng, activeOrder])

  return (
    <div style={{ position:'relative' }}>
      <div ref={mapRef} style={{ height:420, borderRadius:14, overflow:'hidden', border:'1px solid #E8E8E8' }} />
      <div style={{ position:'absolute', top:12, left:12, background:'rgba(255,255,255,0.95)', borderRadius:10, padding:'8px 14px', fontSize:11, fontWeight:700, boxShadow:'0 2px 8px rgba(0,0,0,0.15)', display:'flex', flexDirection:'column', gap:5 }}>
        <div>🏍️ You</div>
        <div>🏪 Kirana store</div>
        <div>🏭 Dark store</div>
        <div>📍 Delivery</div>
        <div style={{color:'#1A73E8'}}>── Pickup route</div>
        <div style={{color:'#0C831F'}}>── Delivery route</div>
      </div>
    </div>
  )
}

export default function RiderDashboard() {
  const { user, logout } = useAuth()
  const { socket, orders, stores, connected, riderLocations } = useSocket()
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState(false)
  const [riderPos, setRiderPos] = useState(null)   // null until GPS acquired
  const [gpsError, setGpsError] = useState(false)
  const [toast, setToast] = useState(null)
  const [tab, setTab] = useState('map')
  const [earnings, setEarnings] = useState({ total: 0, bonus: 0, earnings: [] })
  const watchRef = useRef(null)

  const myOrders = orders.filter(o => o.assignedRiderId === user?.id)
  const activeOrder = myOrders.find(o => ['ASSIGNED','ACCEPTED','PICKED_UP'].includes(o.status))

  function showToast(msg, type='success') { setToast({msg,type}); setTimeout(()=>setToast(null),3500) }

  // Acquire GPS position on mount (even before going online) so it's ready
  useEffect(() => {
    if (!navigator.geolocation) { setGpsError(true); return }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        setRiderPos({ lat, lng })
        setGpsError(false)
      },
      () => setGpsError(true),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [])

  // GPS tracking — emit via socket when online
  useEffect(() => {
    if (isOnline && socket) {
      if (navigator.geolocation) {
        watchRef.current = navigator.geolocation.watchPosition(
          pos => {
            const { latitude: lat, longitude: lng } = pos.coords
            setRiderPos({ lat, lng })
            setGpsError(false)
            socket.emit('rider:location', { riderId: user.id, lat, lng })
          },
          () => {
            setGpsError(true)
            // Demo mode: simulate movement around last known position or Chennai centre
            const base = riderPos || { lat: 13.0418, lng: 80.2341 }
            const interval = setInterval(() => {
              setRiderPos(prev => {
                const p = prev || base
                const lat = p.lat + (Math.random()-0.5)*0.001
                const lng = p.lng + (Math.random()-0.5)*0.001
                socket?.emit('rider:location', { riderId: user?.id, lat, lng })
                return { lat, lng }
              })
            }, 5000)
            watchRef.current = { clear: () => clearInterval(interval) }
          },
          { enableHighAccuracy: true, maximumAge: 5000 }
        )
      }
    } else {
      if (watchRef.current?.clear) watchRef.current.clear()
      else if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current)
    }
    return () => {
      if (watchRef.current?.clear) watchRef.current.clear()
      else if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current)
    }
  }, [isOnline, socket, user])

  // Load earnings
  useEffect(() => {
    if (user?.id) {
      api.get(`/rider/${user.id}/earnings`).then(r => setEarnings(r.data)).catch(()=>{})
    }
  }, [user, myOrders])

  async function toggleOnline() {
    const next = !isOnline
    setIsOnline(next)
    await api.post('/rider/status', { riderId: user.id, isOnline: next, isAvailable: next })
    showToast(next ? '🟢 You are now online' : '🔴 Went offline', next ? 'success' : 'info')
  }

  async function handlePickup(orderId) {
    try {
      await api.post(`/order/${orderId}/pickup`)
      showToast('📦 Picked up from store!')
    } catch(e) { showToast('Error', 'error') }
  }

  async function handleDeliver(orderId) {
    try {
      await api.post(`/order/${orderId}/deliver`, { riderId: user.id })
      showToast('✅ Order delivered! Earnings credited.')
    } catch(e) { showToast(e.response?.data?.error||'Error','error') }
  }

  const liveRiderLat = riderLocations[user?.id]?.lat ?? riderPos?.lat ?? null
  const liveRiderLng = riderLocations[user?.id]?.lng ?? riderPos?.lng ?? null

  return (
    <div style={{ minHeight:'100vh', background:'#F8F9FA', display:'flex', flexDirection:'column' }}>
      <AppHeader title="Rider" subtitle={user?.name} user={user} onLogout={()=>{logout();navigate('/')}} connected={connected} />

      <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', padding:'24px 28px', display:'flex', gap:24 }}>
        {/* Left: Map + Status */}
        <div style={{ flex:2, minWidth:0 }}>
          {/* Online toggle */}
          <div style={{ background:'#fff', borderRadius:14, padding:'16px 20px', marginBottom:16, border:'1px solid #F0F0F5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:'#1C1C1E' }}>Captain Mode</div>
              <div style={{ fontSize:12, color:'#6B6B6B', marginTop:2 }}>
                {isOnline
                  ? <><LiveDot /> Broadcasting location · GPS active</>
                  : liveRiderLat != null
                    ? '📍 GPS ready · Go online to receive orders'
                    : gpsError
                      ? '⚠️ GPS unavailable · Demo mode will be used'
                      : '📡 Acquiring GPS… Go online when ready'
                }
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:13, fontWeight:700, color: isOnline ? '#0C831F' : '#999' }}>{isOnline?'ONLINE':'OFFLINE'}</span>
              <Toggle checked={isOnline} onChange={toggleOnline} color="#0C831F" />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            {['map','orders','earnings'].map(t => (
              <button key={t} onClick={()=>setTab(t)} style={{ padding:'8px 20px', borderRadius:20, border:'none', background: tab===t ? '#1C1C1E' : '#F2F2F7', color: tab===t ? '#fff' : '#6B6B6B', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>
                {t==='map'?'🗺 Live Map':t==='orders'?'📦 Orders':'💰 Earnings'}
              </button>
            ))}
          </div>

          {tab === 'map' && (
            <LiveMap orders={myOrders} stores={stores} riderLat={liveRiderLat} riderLng={liveRiderLng} activeOrder={activeOrder} />
          )}

          {tab === 'orders' && (
            <div>
              {activeOrder && (
                <div style={{ background:'#fff', borderRadius:14, padding:20, marginBottom:12, border:'2px solid #0C831F' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ fontWeight:800, fontSize:15 }}>Active Delivery</div>
                    <StatusBadge status={activeOrder.status} pulse />
                  </div>
                  <div style={{ fontSize:13, color:'#6B6B6B', marginBottom:8 }}>
                    📍 {activeOrder.customerSnapshot?.name} · {activeOrder.customerSnapshot?.address}
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
                    {activeOrder.items?.map((item,i) => (
                      <span key={i} style={{ background:'#F9F9FB', border:'1px solid #E5E5EA', borderRadius:8, padding:'3px 9px', fontSize:12 }}>{item.emoji||''} {item.name} ×{item.qty}</span>
                    ))}
                  </div>
                  {activeOrder.assignedStoreName && (
                    <div style={{ fontSize:12, color:'#6B6B6B', marginBottom:12 }}>
                      🏪 Pickup from: <b>{activeOrder.assignedStoreName}</b>
                      {activeOrder.distanceMeters && <span style={{color:'#AEAEB2'}}> · {(activeOrder.distanceMeters/1000).toFixed(1)}km · ~{activeOrder.etaMinutes}min</span>}
                    </div>
                  )}
                  {activeOrder.darkStoreItems?.length > 0 && (
                    <div style={{ fontSize:12, color:'#FC8019', marginBottom:12 }}>
                      🏭 Also pick from dark store: {activeOrder.darkStoreItems.map(i=>`${i.name} ×${i.qty}`).join(', ')}
                    </div>
                  )}
                  <div style={{ display:'flex', gap:8 }}>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${activeOrder.customerSnapshot?.lat},${activeOrder.customerSnapshot?.lng}`} target="_blank" rel="noopener noreferrer">
                      <Btn variant="blue" small>🗺 Navigate</Btn>
                    </a>
                    {activeOrder.status === 'ACCEPTED' && <Btn onClick={()=>handlePickup(activeOrder.id)} small>📦 Picked Up</Btn>}
                    {activeOrder.status === 'PICKED_UP' && <Btn onClick={()=>handleDeliver(activeOrder.id)} small>✅ Delivered</Btn>}
                  </div>
                </div>
              )}
              {myOrders.filter(o=>o.status==='DELIVERED').slice(0,5).map(o => (
                <div key={o.id} style={{ background:'#fff', borderRadius:12, padding:'12px 16px', marginBottom:8, border:'1px solid #F0F0F5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:'#AEAEB2' }}>{o.id}</div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{o.customerSnapshot?.name}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
              {!activeOrder && myOrders.length === 0 && <EmptyState emoji="🏍️" title="No deliveries yet" desc="Go online to receive orders" />}
            </div>
          )}

          {tab === 'earnings' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
                {[
                  { label:'Total Earned', val:`₹${earnings.total}`, color:'#0C831F' },
                  { label:'Kirana Bonus', val:`₹${earnings.bonus}`, color:'#FC8019' },
                  { label:'Deliveries', val:earnings.count||0, color:'#1A73E8' }
                ].map(c => (
                  <div key={c.label} style={{ background:'#fff', borderRadius:12, padding:'16px', border:'1px solid #F0F0F5', textAlign:'center' }}>
                    <div style={{ fontSize:22, fontWeight:800, color:c.color }}>{c.val}</div>
                    <div style={{ fontSize:11, color:'#6B6B6B', marginTop:4 }}>{c.label}</div>
                  </div>
                ))}
              </div>
              {earnings.earnings?.slice(0,10).map((e,i) => (
                <div key={i} style={{ background:'#fff', borderRadius:10, padding:'12px 16px', marginBottom:8, border:'1px solid #F0F0F5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:'#AEAEB2' }}>{e.orderId}</div>
                    <div style={{ fontSize:12, color:'#6B6B6B', marginTop:2 }}>
                      {e.isKiranaFirst && <span style={{ color:'#0C831F', fontWeight:700 }}>🏪 Kirana-first · </span>}
                      {new Date(e.date).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:800, color:'#0C831F' }}>₹{e.amount}</div>
                    {e.bonus > 0 && <div style={{ fontSize:11, color:'#FC8019' }}>+₹{e.bonus} bonus</div>}
                  </div>
                </div>
              ))}
              {(!earnings.earnings || earnings.earnings.length === 0) && <EmptyState emoji="💰" title="No earnings yet" desc="Complete deliveries to see earnings here" />}
            </div>
          )}
        </div>

        {/* Right: Quick stats */}
        <div style={{ width:240, flexShrink:0 }}>
          <div style={{ background:'#fff', borderRadius:14, padding:16, border:'1px solid #F0F0F5', marginBottom:12 }}>
            <div style={{ fontWeight:800, fontSize:13, marginBottom:12 }}>Today</div>
            {[
              { label:'Deliveries', val: myOrders.filter(o=>o.status==='DELIVERED').length },
              { label:'Kirana-first', val: myOrders.filter(o=>o.status==='DELIVERED'&&o.assignedStoreType==='kirana').length },
              { label:'Earned', val: `₹${earnings.total||0}` }
            ].map(s => (
              <div key={s.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13 }}>
                <span style={{ color:'#6B6B6B' }}>{s.label}</span>
                <span style={{ fontWeight:700 }}>{s.val}</span>
              </div>
            ))}
          </div>
          <div style={{ background:'#fff', borderRadius:14, padding:16, border:'1px solid #F0F0F5' }}>
            <div style={{ fontWeight:800, fontSize:13, marginBottom:10 }}>Location</div>
            {liveRiderLat != null ? (<>
              <div style={{ fontSize:12, color:'#6B6B6B' }}>Lat: {liveRiderLat.toFixed(4)}</div>
              <div style={{ fontSize:12, color:'#6B6B6B' }}>Lng: {liveRiderLng.toFixed(4)}</div>
            </>) : (
              <div style={{ fontSize:12, color:'#FC8019', fontWeight:700 }}>
                {gpsError ? '⚠️ GPS unavailable' : '📡 Acquiring GPS…'}
              </div>
            )}
            <div style={{ fontSize:11, color: isOnline ? '#0C831F' : '#999', marginTop:6, fontWeight:700 }}>
              {isOnline ? '📡 Broadcasting live' : 'Not broadcasting'}
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  )
}
