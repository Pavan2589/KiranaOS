import React from 'react'

export const STATUS_CONFIG = {
  CREATED:   { label:'Placing…',   color:'#6B6B6B', bg:'#F2F2F7',  dot:'#AEAEB2' },
  ASSIGNED:  { label:'Finding',    color:'#E8730A', bg:'#FFF3E8',  dot:'#FC8019' },
  ACCEPTED:  { label:'Preparing',  color:'#0C831F', bg:'#E8F5E9',  dot:'#0C831F' },
  PICKED_UP: { label:'On the way', color:'#1A73E8', bg:'#E8F0FF',  dot:'#1A73E8' },
  REJECTED:  { label:'Re-routing', color:'#C0392B', bg:'#FDEAEA',  dot:'#E02020' },
  DELIVERED: { label:'Delivered',  color:'#0C831F', bg:'#E8F5E9',  dot:'#0C831F' }
}

export function StatusBadge({ status, pulse }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.CREATED
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, color:cfg.color, background:cfg.bg }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:cfg.dot, display:'inline-block', animation: pulse && ['ASSIGNED','ACCEPTED'].includes(status) ? 'pulse-dot 1.2s infinite' : 'none' }} />
      {cfg.label}
    </span>
  )
}

export function OrderCard({ order, actions, compact }) {
  return (
    <div style={{ background:'#fff', borderRadius:14, padding:compact?'12px 14px':'16px', marginBottom:10, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1px solid #F0F0F5' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#AEAEB2', marginBottom:2 }}>{order.id}</div>
          <div style={{ fontWeight:700, fontSize:15 }}>{order.customerSnapshot?.name || order.customerId}</div>
        </div>
        <StatusBadge status={order.status} pulse />
      </div>
      {!compact && (
        <div style={{ marginBottom:8 }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {order.items?.map((item, i) => (
              <span key={i} style={{ background:'#F9F9FB', border:'1px solid #E5E5EA', borderRadius:8, padding:'3px 9px', fontSize:12, fontWeight:500 }}>
                {item.name||item.id} ×{item.qty}
              </span>
            ))}
          </div>
        </div>
      )}
      {order.assignedStoreName && (
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#6B6B6B', marginBottom:actions?8:0 }}>
          <span>🏪</span>
          <span>{order.assignedStoreName}</span>
          {order.distanceMeters && <span style={{ color:'#AEAEB2' }}>· {order.distanceMeters}m · ~{order.etaMinutes}min</span>}
        </div>
      )}
      {order.totalAmount > 0 && !compact && (
        <div style={{ fontSize:13, fontWeight:700, marginBottom:actions?8:0 }}>₹{order.totalAmount}</div>
      )}
      {actions && <div style={{ display:'flex', gap:8, marginTop:4 }}>{actions}</div>}
    </div>
  )
}

export function Btn({ children, onClick, variant='primary', small, disabled }) {
  const styles = {
    primary: { background:'#0C831F', color:'#fff' },
    success: { background:'#0C831F', color:'#fff' },
    danger:  { background:'#FDEAEA', color:'#E02020', border:'1px solid #F5B5B5' },
    blue:    { background:'#E8F0FE', color:'#1A73E8' },
    ghost:   { background:'#F2F2F7', color:'#6B6B6B' },
  }
  const s = styles[variant] || styles.primary
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...s, border: s.border || 'none',
      borderRadius:8, padding: small ? '6px 14px' : '9px 18px',
      fontSize: small ? 12 : 13, fontWeight:700, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1, fontFamily:'Nunito,sans-serif', transition:'all 0.15s'
    }}>{children}</button>
  )
}

export function Toggle({ checked, onChange, color='#0C831F' }) {
  return (
    <label style={{ position:'relative', display:'inline-flex', alignItems:'center', cursor:'pointer', width:42, height:24 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity:0, width:0, height:0 }} />
      <span style={{
        position:'absolute', inset:0, borderRadius:12, transition:'background 0.2s',
        background: checked ? color : '#ccc'
      }}>
        <span style={{
          position:'absolute', left: checked ? 20 : 2, top:2, width:20, height:20,
          borderRadius:'50%', background:'#fff', transition:'left 0.2s',
          boxShadow:'0 1px 4px rgba(0,0,0,0.2)'
        }} />
      </span>
    </label>
  )
}

export function LiveDot({ color='#0C831F' }) {
  return (
    <span style={{ width:8, height:8, borderRadius:'50%', background:color, display:'inline-block', animation:'pulse-dot 1.2s infinite' }} />
  )
}

export function Toast({ msg, type='success' }) {
  if (!msg) return null
  const bg = type==='error' ? '#E02020' : type==='info' ? '#FC8019' : '#1C1C1E'
  return (
    <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:bg, color:'#fff', borderRadius:12, padding:'14px 24px', fontSize:14, fontWeight:700, boxShadow:'0 4px 24px rgba(0,0,0,0.2)', zIndex:1000, whiteSpace:'nowrap' }}>
      {msg}
    </div>
  )
}

export function AppHeader({ title, subtitle, user, onLogout, children, connected }) {
  return (
    <header style={{ background:'#fff', borderBottom:'1px solid #E8E8E8', padding:'0 32px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'#0C831F', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🏪</div>
          <span style={{ fontSize:16, fontWeight:900, color:'#1C1C1E', letterSpacing:-0.5 }}>KiranaOS</span>
        </div>
        {title && <>
          <span style={{ color:'#E0E0E0' }}>|</span>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:'#1C1C1E' }}>{title}</div>
            {subtitle && <div style={{ fontSize:11, color:'#6B6B6B', marginTop:-2 }}>{subtitle}</div>}
          </div>
        </>}
        {children}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        {connected !== undefined && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', background:connected?'#E8F5E9':'#F5F5F5', borderRadius:16, fontSize:11, fontWeight:700, color:connected?'#0C831F':'#999' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:connected?'#0C831F':'#ccc', display:'inline-block', animation:connected?'pulse-dot 1.5s infinite':'none' }} />
            {connected?'Live':'Offline'}
          </div>
        )}
        {user && (
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#1C1C1E' }}>{user.name}</div>
              <div style={{ fontSize:11, color:'#6B6B6B' }}>{user.phone}</div>
            </div>
            <button onClick={onLogout} style={{ background:'#F5F5F5', border:'1px solid #E0E0E0', borderRadius:8, padding:'6px 12px', fontSize:12, fontWeight:700, cursor:'pointer', color:'#6B6B6B', fontFamily:'Nunito,sans-serif' }}>Logout</button>
          </div>
        )}
      </div>
    </header>
  )
}

export function EmptyState({ emoji, title, desc }) {
  return (
    <div style={{ textAlign:'center', padding:'40px 24px', color:'#6B6B6B' }}>
      <div style={{ fontSize:40, marginBottom:10 }}>{emoji}</div>
      <div style={{ fontSize:16, fontWeight:800, color:'#1C1C1E', marginBottom:6 }}>{title}</div>
      {desc && <div style={{ fontSize:13 }}>{desc}</div>}
    </div>
  )
}

export function SectionTitle({ children, extra }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'16px 0 10px', fontSize:15, fontWeight:800, color:'#1C1C1E' }}>
      {children}
      {extra}
    </div>
  )
}
