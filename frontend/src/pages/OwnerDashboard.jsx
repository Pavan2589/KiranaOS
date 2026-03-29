// OwnerDashboard.jsx — KiranaOS v3 (analytics + service radius + subscription)
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import { AppHeader, Btn, StatusBadge, Toggle, EmptyState, Toast, LiveDot } from '../components/shared'
import api from '../utils/api'

export default function OwnerDashboard() {
  const { user, logout } = useAuth()
  const { orders, stores, connected } = useSocket()
  const navigate = useNavigate()
  const [tab, setTab] = useState('orders')
  const [toast, setToast] = useState(null)
  const [isOnline, setIsOnline] = useState(true)
  const [products, setProducts] = useState([])
  const [analytics, setAnalytics] = useState({ totalOrders:0, todayOrders:0, revenue:0, todayRevenue:0, topProducts:[] })
  const [serviceRadius, setServiceRadius] = useState(3)
  const [newProduct, setNewProduct] = useState({ name:'', price:'', unit:'', category:'', emoji:'', stock:'' })
  const [editProduct, setEditProduct] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [subscription, setSubscription] = useState(null)

  const myStore = stores.find(s => s.id === user?.storeId)
  const myOrders = orders.filter(o => o.assignedStoreId === user?.storeId)
  const pendingOrders = myOrders.filter(o => o.status === 'ASSIGNED')
  const activeOrders = myOrders.filter(o => o.status === 'ACCEPTED')

  function showToast(msg,type='success'){setToast({msg,type});setTimeout(()=>setToast(null),3500)}

  useEffect(() => {
    if (myStore) {
      setIsOnline(myStore.isOnline)
      setServiceRadius(myStore.serviceRadiusKm || 3)
    }
  }, [myStore])

  useEffect(() => {
    if (!user?.storeId) return
    api.get(`/store/${user.storeId}/products`).then(r=>setProducts(r.data)).catch(()=>{})
    api.get(`/store/${user.storeId}/analytics`).then(r=>setAnalytics(r.data)).catch(()=>{})
    api.get(`/subscriptions/${user.storeId}`).then(r=>setSubscription(r.data?.[0]||null)).catch(()=>{})
  }, [user, orders])

  async function toggleOnline() {
    const next = !isOnline
    await api.post('/store/status', { storeId: user.storeId, isOnline: next })
    setIsOnline(next)
    showToast(next ? '🟢 Store is now online' : '🔴 Store offline')
  }

  async function handleAccept(orderId) {
    try {
      await api.post(`/order/${orderId}/accept`, { storeId: user.storeId })
      showToast('✅ Order accepted!')
    } catch(e) { showToast(e.response?.data?.error||'Error','error') }
  }

  async function handleReject(orderId) {
    try {
      await api.post(`/order/${orderId}/reject`, { storeId: user.storeId })
      showToast('Order rejected — re-routing…', 'info')
    } catch(e) { showToast(e.response?.data?.error||'Error','error') }
  }

  async function handleAddProduct() {
    if (!newProduct.name || !newProduct.price) return showToast('Name and price required','error')
    try {
      await api.post(`/store/${user.storeId}/product`, newProduct)
      const r = await api.get(`/store/${user.storeId}/products`)
      setProducts(r.data)
      setNewProduct({ name:'', price:'', unit:'', category:'', emoji:'', stock:'' })
      showToast('Product added!')
    } catch(e) { showToast('Error adding product','error') }
  }

  async function handleDeleteProduct(productId) {
    try {
      await api.delete(`/store/${user.storeId}/product/${productId}`)
      setProducts(p=>p.filter(x=>x.id!==productId))
      showToast('Product removed')
    } catch(e) { showToast('Error','error') }
  }

  async function handleEditProduct() {
    if (!editProduct) return
    try {
      await api.put(`/store/${user.storeId}/product/${editProduct.id}`, editProduct)
      const r = await api.get(`/store/${user.storeId}/products`)
      setProducts(r.data)
      setEditProduct(null)
      showToast('Product updated!')
    } catch(e) { showToast('Error','error') }
  }

  async function handleCSVUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const r = await api.post(`/store/${user.storeId}/products/upload`, fd, { headers:{'Content-Type':'multipart/form-data'} })
      const r2 = await api.get(`/store/${user.storeId}/products`)
      setProducts(r2.data)
      showToast(`Imported ${r.data.count} products!`)
    } catch(e) { showToast(e.response?.data?.error||'Upload failed','error') }
    finally { setUploading(false) }
  }

  async function saveRadius() {
    try {
      await api.put(`/store/${user.storeId}/settings`, { serviceRadiusKm: serviceRadius })
      showToast(`Service radius set to ${serviceRadius}km`)
    } catch(e) { showToast('Error','error') }
  }

  async function subscribePlan(plan) {
    try {
      await api.post('/subscriptions', { entityId: user.storeId, entityType:'owner', plan })
      setSubscription({ plan, status:'active' })
      showToast(`Subscribed to ${plan} plan!`)
    } catch(e) { showToast('Error','error') }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F8F9FA', display:'flex', flexDirection:'column' }}>
      <AppHeader title={myStore?.name||'Owner'} subtitle={user?.name} user={user} onLogout={()=>{logout();navigate('/')}} connected={connected} />

      <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', padding:'24px 28px', display:'flex', gap:24 }}>
        {/* Sidebar */}
        <div style={{ width:220, flexShrink:0 }}>
          {/* Status */}
          <div style={{ background:'#fff', borderRadius:14, padding:16, marginBottom:12, border:'1px solid #F0F0F5' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={{ fontWeight:800, fontSize:14 }}>Store Status</div>
              <Toggle checked={isOnline} onChange={toggleOnline} />
            </div>
            <div style={{ fontSize:12, color: isOnline?'#0C831F':'#999', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}>
              {isOnline ? <><LiveDot /> Open for orders</> : '🔴 Offline'}
            </div>
            {subscription && <div style={{ fontSize:11, color:'#FC8019', marginTop:6, fontWeight:700 }}>⭐ {subscription.plan} plan</div>}
          </div>

          {/* Nav */}
          {[
            { key:'orders', label:'📋 Orders', badge:pendingOrders.length||null },
            { key:'inventory', label:'📦 Inventory' },
            { key:'analytics', label:'📊 Analytics' },
            { key:'settings', label:'⚙️ Settings' },
            { key:'plans', label:'💳 Plans' }
          ].map(item => (
            <button key={item.key} onClick={()=>setTab(item.key)} style={{ width:'100%', textAlign:'left', padding:'10px 14px', borderRadius:10, border:'none', background:tab===item.key?'#1C1C1E':'transparent', color:tab===item.key?'#fff':'#3C3C3C', fontWeight:700, fontSize:13, cursor:'pointer', marginBottom:4, fontFamily:'Nunito,sans-serif', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              {item.label}
              {item.badge > 0 && <span style={{ background:'#FC8019', color:'#fff', fontSize:10, borderRadius:8, padding:'2px 7px', fontWeight:800 }}>{item.badge}</span>}
            </button>
          ))}

          {/* Quick stats */}
          <div style={{ background:'#fff', borderRadius:14, padding:14, marginTop:8, border:'1px solid #F0F0F5' }}>
            <div style={{ fontWeight:800, fontSize:12, color:'#6B6B6B', marginBottom:8 }}>TODAY</div>
            {[
              { label:'Orders', val:analytics.todayOrders },
              { label:'Revenue', val:`₹${analytics.todayRevenue||0}` },
              { label:'Pending', val:pendingOrders.length }
            ].map(s=>(
              <div key={s.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13 }}>
                <span style={{ color:'#6B6B6B' }}>{s.label}</span>
                <span style={{ fontWeight:700 }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex:1, minWidth:0 }}>
          {tab === 'orders' && (
            <>
              {pendingOrders.length > 0 && (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontWeight:800, fontSize:15, marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
                    <LiveDot color="#FC8019" /> New Orders ({pendingOrders.length})
                  </div>
                  {pendingOrders.map(o => (
                    <div key={o.id} style={{ background:'#fff', borderRadius:14, padding:16, marginBottom:10, border:'2px solid #FC8019' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                        <div>
                          <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:'#AEAEB2' }}>{o.id}</div>
                          <div style={{ fontWeight:800, fontSize:15 }}>{o.customerSnapshot?.name}</div>
                          <div style={{ fontSize:12, color:'#6B6B6B' }}>{o.customerSnapshot?.address}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontWeight:800, fontSize:16, color:'#0C831F' }}>₹{o.totalAmount}</div>
                          <div style={{ fontSize:11, color:'#6B6B6B' }}>{o.distanceMeters ? `${(o.distanceMeters/1000).toFixed(1)}km away` : ''}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                        {o.items?.map((item,i)=>(
                          <span key={i} style={{ background:'#F9F9FB', border:'1px solid #E5E5EA', borderRadius:8, padding:'3px 9px', fontSize:12 }}>
                            {item.emoji} {item.name} ×{item.qty}
                          </span>
                        ))}
                      </div>
                      {o.darkStoreItems?.length>0 && (
                        <div style={{ fontSize:11, color:'#FC8019', marginBottom:10 }}>
                          ⚠️ Split order — dark store fulfills: {o.darkStoreItems.map(i=>i.name).join(', ')}
                        </div>
                      )}
                      <div style={{ display:'flex', gap:8 }}>
                        <Btn onClick={()=>handleAccept(o.id)} small>✅ Accept</Btn>
                        <Btn onClick={()=>handleReject(o.id)} variant="danger" small>✕ Reject</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ fontWeight:800, fontSize:15, marginBottom:12 }}>Active & History</div>
              {[...activeOrders, ...myOrders.filter(o=>o.status==='DELIVERED').slice(0,10)].map(o=>(
                <div key={o.id} style={{ background:'#fff', borderRadius:12, padding:'12px 16px', marginBottom:8, border:'1px solid #F0F0F5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:'#AEAEB2' }}>{o.id}</div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{o.customerSnapshot?.name} · ₹{o.totalAmount}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
              {myOrders.length===0 && <EmptyState emoji="📋" title="No orders yet" desc="Orders will appear here when customers place them" />}
            </>
          )}

          {tab === 'inventory' && (
            <>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:16 }}>Inventory ({products.length} products)</div>
              {/* Add product */}
              <div style={{ background:'#fff', borderRadius:14, padding:16, marginBottom:16, border:'1px solid #F0F0F5' }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:10 }}>Add Product</div>
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr', gap:8, marginBottom:10 }}>
                  {[
                    { key:'name', ph:'Name*' }, { key:'price', ph:'Price*', type:'number' },
                    { key:'unit', ph:'Unit' }, { key:'category', ph:'Category' },
                    { key:'emoji', ph:'Emoji' }, { key:'stock', ph:'Stock', type:'number' }
                  ].map(f=>(
                    <input key={f.key} type={f.type||'text'} placeholder={f.ph} value={newProduct[f.key]} onChange={e=>setNewProduct(p=>({...p,[f.key]:e.target.value}))} style={{ padding:'8px 10px', borderRadius:8, border:'1px solid #E0E0E0', fontSize:13, fontFamily:'Nunito,sans-serif', outline:'none' }} />
                  ))}
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <Btn onClick={handleAddProduct} small>+ Add</Btn>
                  <span style={{ fontSize:12, color:'#6B6B6B' }}>or</span>
                  <label style={{ cursor:'pointer', padding:'6px 14px', borderRadius:8, border:'1px solid #E0E0E0', background:'#F9F9FB', fontSize:12, fontWeight:700, fontFamily:'Nunito,sans-serif' }}>
                    {uploading ? 'Uploading…' : '📂 Import CSV'}
                    <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ display:'none' }} />
                  </label>
                  <span style={{ fontSize:11, color:'#AEAEB2' }}>name,price,unit,category,emoji,stock</span>
                </div>
              </div>

              {/* Edit modal */}
              {editProduct && (
                <div style={{ background:'#fff', borderRadius:14, padding:16, marginBottom:16, border:'2px solid #1A73E8' }}>
                  <div style={{ fontWeight:700, fontSize:13, marginBottom:10 }}>Edit Product</div>
                  <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr', gap:8, marginBottom:10 }}>
                    {['name','price','unit','category','emoji','stock'].map(f=>(
                      <input key={f} placeholder={f} value={editProduct[f]||''} onChange={e=>setEditProduct(p=>({...p,[f]:e.target.value}))} style={{ padding:'8px 10px', borderRadius:8, border:'1px solid #E0E0E0', fontSize:13, fontFamily:'Nunito,sans-serif', outline:'none' }} />
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn onClick={handleEditProduct} small>Save</Btn>
                    <Btn onClick={()=>setEditProduct(null)} variant="ghost" small>Cancel</Btn>
                  </div>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
                {products.map(p=>(
                  <div key={p.id} style={{ background:'#fff', borderRadius:12, padding:14, border:'1px solid #F0F0F5' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:22 }}>{p.emoji||'📦'}</span>
                      <div style={{ display:'flex', gap:4 }}>
                        <button onClick={()=>setEditProduct({...p})} style={{ background:'#E8F0FE', border:'none', borderRadius:6, padding:'4px 8px', fontSize:11, cursor:'pointer', color:'#1A73E8', fontWeight:700 }}>Edit</button>
                        <button onClick={()=>handleDeleteProduct(p.id)} style={{ background:'#FDEAEA', border:'none', borderRadius:6, padding:'4px 8px', fontSize:11, cursor:'pointer', color:'#E02020', fontWeight:700 }}>Del</button>
                      </div>
                    </div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{p.name}</div>
                    <div style={{ fontSize:12, color:'#6B6B6B' }}>{p.unit} · {p.category}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                      <span style={{ fontWeight:800, color:'#0C831F' }}>₹{p.price}</span>
                      <span style={{ fontSize:12, color: p.stock<10?'#E02020':'#6B6B6B', fontWeight:700 }}>Stock: {p.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
              {products.length===0 && <EmptyState emoji="📦" title="No products yet" desc="Add products above or import from CSV" />}
            </>
          )}

          {tab === 'analytics' && (
            <>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:16 }}>Analytics</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12, marginBottom:20 }}>
                {[
                  { label:'Total Orders', val:analytics.totalOrders, color:'#1A73E8' },
                  { label:'Total Revenue', val:`₹${analytics.revenue||0}`, color:'#0C831F' },
                  { label:"Today's Orders", val:analytics.todayOrders, color:'#FC8019' },
                  { label:"Today's Revenue", val:`₹${analytics.todayRevenue||0}`, color:'#9B59B6' }
                ].map(s=>(
                  <div key={s.label} style={{ background:'#fff', borderRadius:14, padding:16, border:'1px solid #F0F0F5', textAlign:'center' }}>
                    <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:12, color:'#6B6B6B', marginTop:4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {analytics.topProducts?.length > 0 && (
                <div style={{ background:'#fff', borderRadius:14, padding:20, border:'1px solid #F0F0F5' }}>
                  <div style={{ fontWeight:800, fontSize:14, marginBottom:14 }}>Top Products</div>
                  {analytics.topProducts.map((p,i)=>(
                    <div key={p.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #F0F0F5' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:24, height:24, borderRadius:6, background:'#F2F2F7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#6B6B6B' }}>{i+1}</div>
                        <span style={{ fontWeight:700, fontSize:13 }}>{p.name}</span>
                      </div>
                      <div style={{ background:'#E8F5E9', color:'#0C831F', borderRadius:8, padding:'3px 10px', fontSize:12, fontWeight:700 }}>{p.qty} sold</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'settings' && (
            <div>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:16 }}>Settings</div>
              <div style={{ background:'#fff', borderRadius:14, padding:20, border:'1px solid #F0F0F5', marginBottom:16 }}>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:6 }}>Service Radius</div>
                <div style={{ fontSize:12, color:'#6B6B6B', marginBottom:14 }}>Orders within this radius will be routed to your store first.</div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <input type="range" min={1} max={10} step={0.5} value={serviceRadius} onChange={e=>setServiceRadius(Number(e.target.value))} style={{ flex:1 }} />
                  <span style={{ fontWeight:800, fontSize:16, color:'#0C831F', minWidth:50 }}>{serviceRadius}km</span>
                </div>
                <Btn onClick={saveRadius} small>Save Radius</Btn>
              </div>
              <div style={{ background:'#fff', borderRadius:14, padding:20, border:'1px solid #F0F0F5' }}>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>Store Info</div>
                {[
                  { label:'Store ID', val:user?.storeId },
                  { label:'Type', val:myStore?.storeType||'kirana' },
                  { label:'Verified', val:myStore?.verification?.isVerified?'✅ Yes':'❌ No' }
                ].map(r=>(
                  <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F0F0F5', fontSize:13 }}>
                    <span style={{ color:'#6B6B6B' }}>{r.label}</span>
                    <span style={{ fontWeight:700, fontFamily: r.label==='Store ID'?'Space Mono,monospace':undefined }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'plans' && (
            <div>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:8 }}>Subscription Plans</div>
              <div style={{ fontSize:13, color:'#6B6B6B', marginBottom:20 }}>Upgrade to get priority listing, higher service radius, and more.</div>
              {subscription && (
                <div style={{ background:'#E8F5E9', borderRadius:12, padding:'12px 16px', marginBottom:16, border:'1px solid #C8E6C9' }}>
                  <span style={{ fontWeight:800, color:'#0C831F' }}>✅ Active: {subscription.plan} plan</span>
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                {[
                  { plan:'basic', label:'Basic', price:'₹99/mo', features:['Priority listing in 3km radius','Up to 50 products','Basic analytics'] },
                  { plan:'pro', label:'Pro', price:'₹499/mo', features:['Priority listing in 5km radius','Unlimited products','Full analytics','Featured badge','CSV bulk import'] }
                ].map(p=>(
                  <div key={p.plan} style={{ background:'#fff', borderRadius:14, padding:20, border:p.plan==='pro'?'2px solid #FC8019':'1px solid #F0F0F5' }}>
                    {p.plan==='pro' && <div style={{ background:'#FC8019', color:'#fff', fontSize:10, fontWeight:800, borderRadius:8, padding:'3px 8px', display:'inline-block', marginBottom:8 }}>POPULAR</div>}
                    <div style={{ fontWeight:800, fontSize:18 }}>{p.label}</div>
                    <div style={{ fontSize:24, fontWeight:800, color:'#0C831F', margin:'8px 0' }}>{p.price}</div>
                    <div style={{ marginBottom:16 }}>
                      {p.features.map(f=>(
                        <div key={f} style={{ fontSize:13, color:'#3C3C3C', marginBottom:6 }}>✓ {f}</div>
                      ))}
                    </div>
                    <Btn onClick={()=>subscribePlan(p.plan)} variant={subscription?.plan===p.plan?'ghost':'primary'} small>
                      {subscription?.plan===p.plan ? 'Current plan' : `Subscribe ${p.label}`}
                    </Btn>
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
