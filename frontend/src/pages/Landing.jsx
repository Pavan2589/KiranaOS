import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const THEME = {
  primary:     '#7C3AED',
  primaryDark: '#5B21B6',
  primaryLight:'#EDE9FE',
  accent:      '#A78BFA',
  gradient:    'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
}

const roles = [
  { id:'customer', icon:'🛒', title:'Customer',       desc:'Order groceries from nearby kirana stores. Delivered in minutes.',    features:['Browse 500+ products','Live order tracking','10-min delivery']    },
  { id:'owner',    icon:'🏪', title:'Shop Owner',     desc:'Manage your store, accept orders, and grow your business.',           features:['Order management','Inventory + CSV upload','Earnings dashboard']  },
  { id:'rider',    icon:'🏍️', title:'Delivery Rider', desc:'Pick up and deliver orders. Earn more with every delivery.',          features:['Live map navigation','Smart route planning','Daily earnings']      },
]

export default function Landing() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:'Nunito, sans-serif' }}>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', height:64, borderBottom:'1px solid #F3F0FF', position:'sticky', top:0, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(8px)', zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:THEME.gradient, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, boxShadow:'0 2px 8px rgba(124,58,237,0.3)' }}>⚡</div>
          <div>
            <div style={{ fontWeight:900, fontSize:20, color:THEME.primary, lineHeight:1, letterSpacing:-0.5 }}>Lynq</div>
            <div style={{ fontSize:9, color:'#A78BFA', fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' }}>hyperlocal delivery</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {user ? (
            <>
              <span style={{ fontSize:13, color:'#6B6B6B' }}>Hi, <b style={{ color:THEME.primary }}>{user.name}</b></span>
              <button onClick={() => navigate(`/${user.role}`)} style={{ background:THEME.gradient, color:'#fff', border:'none', borderRadius:8, padding:'8px 18px', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:'0 2px 8px rgba(124,58,237,0.3)' }}>Dashboard</button>
              <button onClick={logout} style={{ background:'transparent', color:'#9CA3AF', border:'1px solid #E5E5EA', borderRadius:8, padding:'8px 14px', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/auth/customer')} style={{ background:'transparent', color:THEME.primary, border:`1.5px solid ${THEME.accent}`, borderRadius:8, padding:'8px 18px', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>Log In</button>
              <button onClick={() => navigate('/auth/customer')} style={{ background:THEME.gradient, color:'#fff', border:'none', borderRadius:8, padding:'8px 18px', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:'0 2px 8px rgba(124,58,237,0.3)' }}>Get Started →</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background:THEME.gradient, padding:'80px 48px 72px', position:'relative', overflow:'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:48, maxWidth:1100, margin:'0 auto' }}>
          <div style={{ flex:1, minWidth:280 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.15)', borderRadius:20, padding:'5px 14px', marginBottom:24, border:'1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#A7F3D0', display:'inline-block', animation:'pulse-dot 1.5s infinite' }} />
              <span style={{ fontSize:12, color:'#fff', fontWeight:700 }}>Live · Real-time delivery network</span>
            </div>
            <h1 style={{ fontSize:52, fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:18, letterSpacing:-1 }}>
              Groceries delivered<br/>
              <span style={{ color:'#DDD6FE' }}>in 10 minutes</span>
            </h1>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.75)', marginBottom:36, maxWidth:440, lineHeight:1.75 }}>
              Lynq connects you with local kirana stores. Order essentials and get them delivered blazing fast by our rider network.
            </p>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <button onClick={() => navigate('/auth/customer')} style={{ background:'#fff', color:THEME.primary, border:'none', borderRadius:12, padding:'14px 32px', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>Order Now →</button>
              <button onClick={() => navigate('/auth/owner')} style={{ background:'rgba(255,255,255,0.12)', color:'#fff', border:'1.5px solid rgba(255,255,255,0.35)', borderRadius:12, padding:'14px 28px', fontWeight:700, fontSize:15, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>Partner With Us</button>
            </div>
          </div>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
            {[{val:'500+',label:'Kirana Stores'},{val:'10 min',label:'Avg. Delivery'},{val:'50K+',label:'Daily Orders'},{val:'98%',label:'On-time Rate'}].map((s,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.12)', borderRadius:18, padding:'22px 30px', textAlign:'center', border:'1px solid rgba(255,255,255,0.18)', backdropFilter:'blur(10px)' }}>
                <div style={{ fontSize:30, fontWeight:900, color:'#fff' }}>{s.val}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', fontWeight:700, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role cards */}
      <div style={{ padding:'72px 48px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <div style={{ display:'inline-block', background:THEME.primaryLight, color:THEME.primary, borderRadius:20, padding:'5px 16px', fontSize:12, fontWeight:800, marginBottom:14, letterSpacing:0.5 }}>CHOOSE YOUR ROLE</div>
          <h2 style={{ fontSize:36, fontWeight:900, color:'#1C1C1E', marginBottom:8, letterSpacing:-0.5 }}>Join the Lynq network</h2>
          <p style={{ color:'#6B6B6B', fontSize:16 }}>Sign in or create an account to get started</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:24 }}>
          {roles.map(role => (
            <div key={role.id}
              onClick={() => navigate(user?.role === role.id ? `/${role.id}` : `/auth/${role.id}`)}
              style={{ background:'#fff', border:`1.5px solid #EDE9FE`, borderRadius:20, padding:32, cursor:'pointer', transition:'all 0.2s ease', position:'relative', overflow:'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(124,58,237,0.14)'; e.currentTarget.style.borderColor=THEME.accent }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#EDE9FE' }}
            >
              <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:THEME.primaryLight, opacity:0.5 }} />
              <div style={{ position:'relative' }}>
                <div style={{ width:60, height:60, borderRadius:16, background:THEME.gradient, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, marginBottom:20, boxShadow:'0 4px 16px rgba(124,58,237,0.25)' }}>{role.icon}</div>
                <h3 style={{ fontSize:22, fontWeight:900, color:'#1C1C1E', marginBottom:8 }}>{role.title}</h3>
                <p style={{ color:'#6B6B6B', fontSize:14, lineHeight:1.65, marginBottom:22 }}>{role.desc}</p>
                <ul style={{ listStyle:'none', marginBottom:28 }}>
                  {role.features.map((f,i) => (
                    <li key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:7, fontSize:13, color:'#374151', fontWeight:600 }}>
                      <span style={{ width:18, height:18, borderRadius:'50%', background:THEME.gradient, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#fff', flexShrink:0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:THEME.gradient, color:'#fff', borderRadius:12, padding:'13px 18px', fontWeight:800, fontSize:14, boxShadow:'0 4px 14px rgba(124,58,237,0.3)' }}>
                  <span>{user?.role === role.id ? '→ Go to Dashboard' : 'Login / Register'}</span>
                  <span style={{ fontSize:18 }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign:'center', padding:'28px 48px', borderTop:'1px solid #F3F0FF', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
        <div style={{ width:22, height:22, borderRadius:6, background:THEME.gradient, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>⚡</div>
        <span style={{ fontWeight:900, color:THEME.primary, fontSize:14 }}>Lynq</span>
        <span style={{ color:'#C4B5FD', fontSize:12 }}>· Event-driven delivery · Built for Bharat</span>
      </div>
    </div>
  )
}
