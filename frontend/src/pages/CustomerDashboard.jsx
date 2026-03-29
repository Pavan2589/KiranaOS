// CustomerDashboard.jsx — KiranaOS v3 (live tracking + savings + platform linking)
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import { OrderCard, Btn, StatusBadge, AppHeader, EmptyState, Toast, LiveDot } from '../components/shared'
import api from '../utils/api'

function useLeaflet() {
  const [loaded, setLoaded] = useState(!!window.L)
  useEffect(() => {
    if (window.L) { setLoaded(true); return }
    const link = document.createElement('link'); link.rel='stylesheet'; link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link)
    const script = document.createElement('script'); script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload=()=>setLoaded(true); document.head.appendChild(script)
  }, [])
  return loaded
}

function TrackingMap({ order, stores, riderLocations }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const polylinesRef = useRef([])
  const leafletLoaded = useLeaflet()

  useEffect(() => {
    if (!leafletLoaded || mapInstanceRef.current) return
    const L = window.L
    const map = L.map(mapRef.current).setView([order.customerSnapshot?.lat||13.04, order.customerSnapshot?.lng||80.23], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap', maxZoom:19 }).addTo(map)
    mapInstanceRef.current = map
  }, [leafletLoaded])

  useEffect(() => {
    const L = window.L
    if (!L || !mapInstanceRef.current) return
    const map = mapInstanceRef.current
    markersRef.current.forEach(m=>m.remove()); markersRef.current=[]
    polylinesRef.current.forEach(p=>p.remove()); polylinesRef.current=[]

    const store = stores.find(s=>s.id===order.assignedStoreId)
    const riderLoc = riderLocations[order.assignedRiderId]
    const custLat = order.customerSnapshot?.lat, custLng = order.customerSnapshot?.lng

    // Customer marker (home)
    if (custLat && custLng) {
      const icon = L.divIcon({ className:'', html:`<div style="background:#FC8019;color:#fff;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid #fff;box-shadow:0 2px 8px rgba(252,128,25,0.5)">🏠</div>`, iconSize:[34,34], iconAnchor:[17,17] })
      markersRef.current.push(L.marker([custLat, custLng], { icon }).addTo(map).bindPopup('Your location'))
    }

    // Store marker
    if (store && Number.isFinite(Number(store.lat)) && Number.isFinite(Number(store.lng))) {
      const icon = L.divIcon({ className:'', html:`<div style="background:#0C831F;color:#fff;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.2)">🏪</div>`, iconSize:[32,32], iconAnchor:[16,16] })
      markersRef.current.push(L.marker([Number(store.lat), Number(store.lng)], { icon }).addTo(map).bindPopup(store.name))
    }

    // Rider marker (live)
    if (riderLoc?.lat && riderLoc?.lng) {
      const icon = L.divIcon({ className:'', html:`<div style="background:#1A73E8;color:#fff;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid #fff;box-shadow:0 2px 8px rgba(26,115,232,0.4)">🏍️</div>`, iconSize:[38,38], iconAnchor:[19,19] })
      markersRef.current.push(L.marker([riderLoc.lat, riderLoc.lng], { icon }).addTo(map).bindPopup('Your rider'))
    }

    // Route lines
    if (store && riderLoc && custLat) {
      polylinesRef.current.push(L.polyline([[riderLoc.lat,riderLoc.lng],[store.lat,store.lng]], { color:'#1A73E8', weight:3, dashArray:'6,4', opacity:0.7 }).addTo(map))
      polylinesRef.current.push(L.polyline([[store.lat,store.lng],[custLat,custLng]], { color:'#0C831F', weight:4, opacity:0.8 }).addTo(map))
    }

    const pts = [[custLat||19.13, custLng||72.83]]
    if (riderLoc) pts.push([riderLoc.lat,riderLoc.lng])
    if (store) pts.push([store.lat,store.lng])
    if (pts.length>1) map.fitBounds(L.latLngBounds(pts), { padding:[30,30] })
  }, [order, stores, riderLocations])

  return <div ref={mapRef} style={{ height:280, borderRadius:12, overflow:'hidden', border:'1px solid #E8E8E8' }} />
}

const ALL_PRODUCTS = [
  { id:'item_001', name:'Amul Milk 500ml',    price:28,  unit:'500ml', emoji:'🥛', category:'Dairy'        },
  { id:'item_002', name:'Bread',               price:45,  unit:'400g',  emoji:'🍞', category:'Staples'      },
  { id:'item_003', name:'Tata Salt 1kg',       price:22,  unit:'1kg',   emoji:'🧂', category:'Staples'      },
  { id:'item_004', name:'Parle-G Biscuits',    price:10,  unit:'100g',  emoji:'🍪', category:'Snacks'       },
  { id:'item_005', name:'Sunflower Oil 1L',    price:130, unit:'1L',    emoji:'🫙', category:'Staples'      },
  { id:'item_006', name:'Maggi 2-min Noodles', price:14,  unit:'70g',   emoji:'🍜', category:'Instant'      },
  { id:'item_007', name:'Colgate Toothpaste',  price:89,  unit:'150g',  emoji:'🪥', category:'Personal'     },
  { id:'item_008', name:'Good Day Biscuits',   price:30,  unit:'150g',  emoji:'🍪', category:'Snacks'       },
  { id:'item_009', name:'Aashirvaad Atta 1kg', price:55,  unit:'1kg',   emoji:'🌾', category:'Staples'      },
  { id:'item_010', name:'Surf Excel 500g',      price:82,  unit:'500g',  emoji:'🧺', category:'Personal'     }
]
const CATEGORIES = ['All','Dairy','Staples','Snacks','Instant','Personal']
const BANNERS = [
  { bg:'linear-gradient(120deg,#FC8019,#e76e10)', text:'Kirana-first delivery!', sub:'From your nearest local store', emoji:'🏪' },
  { bg:'linear-gradient(120deg,#0C831F,#09681a)', text:'Support local kirana', sub:'Fresh · Fast · Community', emoji:'💚' },
  { bg:'linear-gradient(120deg,#1A73E8,#1558b0)', text:'Save fuel, save time', sub:'Local pickup beats dark stores', emoji:'⚡' }
]

export default function CustomerDashboard() {
  const { user, logout } = useAuth()
  const { orders, stores, connected, riderLocations } = useSocket()
  const navigate = useNavigate()
  const [cart, setCart] = useState({})
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('shop')
  const [placing, setPlacing] = useState(false)
  const [toast, setToast] = useState(null)
  const [banner, setBanner] = useState(0)
  const [availability, setAvailability] = useState({})
  const [savings, setSavings] = useState({ totalMetersSaved:0, totalMinutesSaved:0, kiranaOrders:0, totalOrders:0 })
  const [customerData, setCustomerData] = useState(null)
  const [linkingPlatform, setLinkingPlatform] = useState(null)

  useEffect(() => { const t=setInterval(()=>setBanner(b=>(b+1)%BANNERS.length),4000); return ()=>clearInterval(t) }, [])
  useEffect(() => { api.get('/products/availability').then(r=>setAvailability(r.data)).catch(()=>{}) }, [stores])
  useEffect(() => { if (user?.id) { api.get(`/customer/${user.id}/savings`).then(r=>setSavings(r.data)).catch(()=>{}); api.get(`/customer/${user.id}`).then(r=>setCustomerData(r.data)).catch(()=>{}) } }, [user, orders])

  const myOrders = orders.filter(o=>o.customerId===user?.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
  const activeOrder = myOrders.find(o=>['CREATED','ASSIGNED','ACCEPTED','PICKED_UP'].includes(o.status))
  const filtered = ALL_PRODUCTS.filter(p=>(cat==='All'||p.category===cat)&&p.name.toLowerCase().includes(search.toLowerCase()))
  const cartItems = Object.entries(cart).filter(([,q])=>q>0)
  const cartTotal = cartItems.reduce((s,[id,q])=>s+(ALL_PRODUCTS.find(p=>p.id===id)?.price||0)*q,0)
  const cartCount = cartItems.reduce((s,[,q])=>s+q,0)

  function showToast(msg,type='success'){setToast({msg,type});setTimeout(()=>setToast(null),3500)}
  function addToCart(id){setCart(c=>({...c,[id]:(c[id]||0)+1}))}
  function removeFromCart(id){setCart(c=>({...c,[id]:Math.max(0,(c[id]||0)-1)}))}

  // Get nearest kirana for a product
  function getNearestKirana(productId) {
    const storeList = availability[productId] || []
    const kiranas = storeList.filter(s=>s.storeType!=='darkStore'&&s.stock>0)
    if (!kiranas.length) return null
    const cust = stores.find(s=>s.id===kiranas[0]?.storeId) // rough
    return kiranas[0]
  }

  async function placeOrder() {
    if (!cartItems.length) return
    setPlacing(true)
    try {
      const items = cartItems.map(([id,qty])=>{ const p=ALL_PRODUCTS.find(p=>p.id===id); return {id,qty,name:p?.name,price:p?.price,emoji:p?.emoji} })
      await api.post('/order', { customerId: user.id, items })
      setCart({})
      setTab('orders')
      showToast('Order placed! Finding nearest kirana…')
    } catch(e) { showToast(e.response?.data?.error||'Failed to place order','error') }
    finally { setPlacing(false) }
  }

  async function linkPlatform(platform, linked) {
    try {
      await api.post(`/customer/${user.id}/link-platform`, { platform, linked })
      setCustomerData(prev=>({ ...prev, linkedPlatforms: { ...prev?.linkedPlatforms, [platform]: linked } }))
      showToast(linked ? `${platform} linked!` : `${platform} unlinked`)
    } catch(e) { showToast('Error','error') }
  }

  const b = BANNERS[banner]

  return (
    <div style={{ minHeight:'100vh', background:'#F8F9FA', display:'flex', flexDirection:'column' }}>
      <AppHeader title="Customer" subtitle={user?.name} user={user} onLogout={()=>{logout();navigate('/')}} connected={connected}>
        {activeOrder && (
          <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:16 }}>
            <LiveDot />
            <span style={{ fontSize:12, fontWeight:700, color:'#0C831F', cursor:'pointer' }} onClick={()=>setTab('track')}>Track order</span>
          </div>
        )}
      </AppHeader>

      <div style={{ display:'flex', flex:1, maxWidth:1400, margin:'0 auto', width:'100%', padding:'24px 28px', gap:24 }}>
        {/* Sidebar */}
        <div style={{ width:210, flexShrink:0 }}>
          {/* Banner */}
          <div style={{ background:b.bg, borderRadius:14, padding:'18px 16px', marginBottom:16, color:'#fff' }}>
            <div style={{ fontSize:26, marginBottom:6 }}>{b.emoji}</div>
            <div style={{ fontWeight:800, fontSize:15, marginBottom:3 }}>{b.text}</div>
            <div style={{ fontSize:12, opacity:0.85 }}>{b.sub}</div>
          </div>
          {/* Nav */}
          {[
            { key:'shop', label:'🛒 Shop' },
            { key:'orders', label:'📋 My Orders' },
            { key:'track', label:'🗺 Track', badge: activeOrder?'LIVE':null },
            { key:'savings', label:'💚 Savings' },
            { key:'account', label:'⚙️ Account' }
          ].map(item => (
            <button key={item.key} onClick={()=>setTab(item.key)} style={{ width:'100%', textAlign:'left', padding:'10px 14px', borderRadius:10, border:'none', background:tab===item.key?'#1C1C1E':'transparent', color:tab===item.key?'#fff':'#3C3C3C', fontWeight:700, fontSize:13, cursor:'pointer', marginBottom:4, fontFamily:'Nunito,sans-serif', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              {item.label}
              {item.badge && <span style={{ background:'#0C831F', color:'#fff', fontSize:9, fontWeight:800, borderRadius:8, padding:'2px 6px' }}>{item.badge}</span>}
            </button>
          ))}
          {/* Cart summary */}
          {cartCount>0 && (
            <div style={{ background:'#0C831F', borderRadius:12, padding:'14px 16px', marginTop:12, color:'#fff' }}>
              <div style={{ fontSize:12, fontWeight:700, marginBottom:6 }}>{cartCount} items · ₹{cartTotal}</div>
              <Btn onClick={placeOrder} disabled={placing} small style={{ width:'100%', background:'#fff', color:'#0C831F' }}>
                {placing?'Placing…':'Place Order'}
              </Btn>
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex:1, minWidth:0 }}>
          {tab === 'shop' && (
            <>
              <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center' }}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…" style={{ flex:1, padding:'10px 16px', borderRadius:10, border:'1px solid #E0E0E0', fontSize:14, fontFamily:'Nunito,sans-serif', outline:'none' }} />
                <div style={{ display:'flex', gap:6 }}>
                  {CATEGORIES.map(c=>(
                    <button key={c} onClick={()=>setCat(c)} style={{ padding:'8px 14px', borderRadius:20, border:'none', background:cat===c?'#1C1C1E':'#F2F2F7', color:cat===c?'#fff':'#6B6B6B', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Nunito,sans-serif', whiteSpace:'nowrap' }}>{c}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(170px,1fr))', gap:12 }}>
                {filtered.map(p => {
                  const qty = cart[p.id]||0
                  const nearKirana = getNearestKirana(p.id)
                  return (
                    <div key={p.id} style={{ background:'#fff', borderRadius:14, padding:14, border:'1px solid #F0F0F5' }}>
                      <div style={{ fontSize:30, marginBottom:6 }}>{p.emoji}</div>
                      <div style={{ fontWeight:700, fontSize:13, marginBottom:2, lineHeight:1.3 }}>{p.name}</div>
                      <div style={{ fontSize:11, color:'#6B6B6B', marginBottom:6 }}>{p.unit}</div>
                      {nearKirana && (
                        <div style={{ fontSize:10, color:'#0C831F', fontWeight:700, marginBottom:6 }}>
                          🏪 {nearKirana.storeName}
                        </div>
                      )}
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontWeight:800, fontSize:14 }}>₹{p.price}</span>
                        {qty===0 ? (
                          <button onClick={()=>addToCart(p.id)} style={{ background:'#0C831F', color:'#fff', border:'none', borderRadius:8, padding:'5px 14px', fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>ADD</button>
                        ) : (
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <button onClick={()=>removeFromCart(p.id)} style={{ background:'#0C831F', color:'#fff', border:'none', borderRadius:6, width:24, height:24, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                            <span style={{ fontWeight:800, minWidth:16, textAlign:'center' }}>{qty}</span>
                            <button onClick={()=>addToCart(p.id)} style={{ background:'#0C831F', color:'#fff', border:'none', borderRadius:6, width:24, height:24, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {tab === 'orders' && (
            <div>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>My Orders</div>
              {myOrders.length===0 && <EmptyState emoji="📋" title="No orders yet" desc="Add items to your cart and place an order" />}
              {myOrders.map(o => (
                <div key={o.id} style={{ background:'#fff', borderRadius:14, padding:16, marginBottom:10, border:`1px solid ${['ASSIGNED','ACCEPTED','PICKED_UP'].includes(o.status)?'#0C831F':'#F0F0F5'}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <div>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:'#AEAEB2' }}>{o.id}</div>
                      <div style={{ fontWeight:700, fontSize:14, marginTop:2 }}>{o.items?.map(i=>`${i.emoji||''} ${i.name}`).join(', ')}</div>
                    </div>
                    <StatusBadge status={o.status} pulse />
                  </div>
                  {o.assignedStoreName && (
                    <div style={{ fontSize:12, color:'#6B6B6B', marginBottom:6 }}>
                      {o.assignedStoreType==='darkStore'?'🏭':'🏪'} {o.assignedStoreName}
                      {o.distanceMeters && <span style={{color:'#AEAEB2'}}> · {(o.distanceMeters/1000).toFixed(1)}km · ~{o.etaMinutes}min</span>}
                    </div>
                  )}
                  {o.metersSaved>0 && (
                    <div style={{ fontSize:11, color:'#0C831F', fontWeight:700 }}>💚 {(o.metersSaved/1000).toFixed(1)}km saved vs dark store</div>
                  )}
                  {o.darkStoreItems?.length>0 && (
                    <div style={{ fontSize:11, color:'#FC8019', marginTop:4 }}>🏭 Dark store supplement: {o.darkStoreItems.map(i=>i.name).join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'track' && (
            <div>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>Live Tracking</div>
              {!activeOrder && <EmptyState emoji="🗺" title="No active order" desc="Place an order to see live tracking" />}
              {activeOrder && (
                <>
                  <div style={{ background:'#fff', borderRadius:14, padding:16, marginBottom:16, border:'1px solid #F0F0F5' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                      <div>
                        <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:'#AEAEB2' }}>{activeOrder.id}</div>
                        <div style={{ fontWeight:800, fontSize:15, marginTop:2 }}>{activeOrder.assignedStoreName || 'Finding store…'}</div>
                      </div>
                      <StatusBadge status={activeOrder.status} pulse />
                    </div>
                    {activeOrder.etaMinutes && (
                      <div style={{ display:'flex', gap:16, marginBottom:12 }}>
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontSize:22, fontWeight:800, color:'#0C831F' }}>{activeOrder.etaMinutes}</div>
                          <div style={{ fontSize:11, color:'#6B6B6B' }}>min ETA</div>
                        </div>
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontSize:22, fontWeight:800, color:'#1A73E8' }}>{((activeOrder.distanceMeters||0)/1000).toFixed(1)}</div>
                          <div style={{ fontSize:11, color:'#6B6B6B' }}>km away</div>
                        </div>
                        {activeOrder.metersSaved>0 && (
                          <div style={{ textAlign:'center' }}>
                            <div style={{ fontSize:22, fontWeight:800, color:'#FC8019' }}>{(activeOrder.metersSaved/1000).toFixed(1)}</div>
                            <div style={{ fontSize:11, color:'#6B6B6B' }}>km saved</div>
                          </div>
                        )}
                      </div>
                    )}
                    <div style={{ display:'flex', gap:8, fontSize:12, color:'#6B6B6B' }}>
                      {[
                        { status:'CREATED', label:'Placed' },
                        { status:'ASSIGNED', label:'Store found' },
                        { status:'ACCEPTED', label:'Preparing' },
                        { status:'PICKED_UP', label:'On the way' },
                        { status:'DELIVERED', label:'Delivered' }
                      ].map((s,i) => {
                        const statuses = ['CREATED','ASSIGNED','ACCEPTED','PICKED_UP','DELIVERED']
                        const done = statuses.indexOf(activeOrder.status) >= statuses.indexOf(s.status)
                        return (
                          <React.Fragment key={s.status}>
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                              <div style={{ width:14, height:14, borderRadius:'50%', background:done?'#0C831F':'#E0E0E0' }} />
                              <div style={{ fontSize:10, textAlign:'center', color:done?'#0C831F':'#AEAEB2', fontWeight:done?700:400 }}>{s.label}</div>
                            </div>
                            {i<4 && <div style={{ flex:1, height:2, background:done?'#0C831F':'#E0E0E0', marginTop:6 }} />}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </div>
                  <TrackingMap order={activeOrder} stores={stores} riderLocations={riderLocations} />
                </>
              )}
            </div>
          )}

          {tab === 'savings' && (
            <div>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>Your Savings</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:20 }}>
                {[
                  { label:'Km saved', val:`${(savings.totalMetersSaved/1000).toFixed(1)}km`, emoji:'🛣️', color:'#0C831F' },
                  { label:'Min saved', val:`${savings.totalMinutesSaved}min`, emoji:'⏱️', color:'#1A73E8' },
                  { label:'Kirana orders', val:savings.kiranaOrders, emoji:'🏪', color:'#FC8019' },
                  { label:'Total orders', val:savings.totalOrders, emoji:'📦', color:'#6B6B6B' }
                ].map(s=>(
                  <div key={s.label} style={{ background:'#fff', borderRadius:14, padding:16, border:'1px solid #F0F0F5', textAlign:'center' }}>
                    <div style={{ fontSize:24, marginBottom:6 }}>{s.emoji}</div>
                    <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:11, color:'#6B6B6B', marginTop:4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'linear-gradient(120deg,#0C831F,#09681a)', borderRadius:14, padding:20, color:'#fff' }}>
                <div style={{ fontWeight:800, fontSize:16, marginBottom:8 }}>💚 Impact</div>
                <div style={{ fontSize:14, opacity:0.9 }}>By choosing local kirana stores, you've helped reduce dark store delivery distances and supported {savings.kiranaOrders} local shop owners.</div>
              </div>
            </div>
          )}

          {tab === 'account' && (
            <div>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>Account & Platforms</div>
              <div style={{ background:'#fff', borderRadius:14, padding:20, border:'1px solid #F0F0F5', marginBottom:16 }}>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>Linked Platforms</div>
                <div style={{ fontSize:13, color:'#6B6B6B', marginBottom:14 }}>When you order from these platforms, we route to your nearest kirana first.</div>
                {['blinkit','zepto','swiggy'].map(p => (
                  <div key={p} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #F0F0F5' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:'#F2F2F7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                        {p==='blinkit'?'🟡':p==='zepto'?'🟣':'🟠'}
                      </div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13, textTransform:'capitalize' }}>{p}</div>
                        <div style={{ fontSize:11, color:'#6B6B6B' }}>{customerData?.linkedPlatforms?.[p] ? 'Linked · Kirana-first routing active' : 'Not linked'}</div>
                      </div>
                    </div>
                    <button onClick={()=>linkPlatform(p, !customerData?.linkedPlatforms?.[p])} style={{ padding:'6px 16px', borderRadius:8, border:'1px solid #E0E0E0', background:customerData?.linkedPlatforms?.[p]?'#FDEAEA':'#E8F5E9', color:customerData?.linkedPlatforms?.[p]?'#E02020':'#0C831F', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>
                      {customerData?.linkedPlatforms?.[p] ? 'Unlink' : 'Link'}
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ background:'#fff', borderRadius:14, padding:20, border:'1px solid #F0F0F5' }}>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>Profile</div>
                {[{label:'Name',val:user?.name},{label:'Phone',val:user?.phone},{label:'Plan',val:customerData?.subscriptionPlan||'free'}].map(r=>(
                  <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F0F0F5', fontSize:13 }}>
                    <span style={{ color:'#6B6B6B' }}>{r.label}</span>
                    <span style={{ fontWeight:700, textTransform:'capitalize' }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  )
}
