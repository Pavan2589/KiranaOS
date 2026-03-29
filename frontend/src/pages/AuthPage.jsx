import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const THEME = {
  primary:      '#0C831F',
  primaryLight: '#E8F5E9',
  primaryDark:  '#08681A',
  accent:       '#34A853',
  gradient:     'linear-gradient(135deg, #0C831F 0%, #08681A 100%)',
}

const ROLE_CONFIG = {
  customer: {
    label: 'Customer',
    icon: '🛒',
    color: THEME.primary,
    demo: { phone: '+919876543210', password: 'demo123' },
    registerFields: ['name','phone','password','address'],
  },
  owner: {
    label: 'Shop Owner',
    icon: '🏪',
    color: THEME.primary,
    demo: { phone: '+919876543210', password: 'demo123' },
    registerFields: ['name','storeName','phone','password','address','verType','verId'],
  },
  rider: {
    label: 'Delivery Rider',
    icon: '🏍️',
    color: THEME.primary,
    demo: { phone: '+919876543210', password: 'demo123' },
    registerFields: ['name','phone','password','vehicleType'],
  },
}

const iStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #BBF7D0',
  borderRadius: 10,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'Nunito, sans-serif',
  background: '#FAFFFE',
  color: '#1C1C1E',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: '#08681A',
  marginBottom: 4,
  display: 'block',
  letterSpacing: 0.3,
}

export default function AuthPage() {
  const { role } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.customer

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '', storeName: '', phone: '', password: '',
    address: '', verType: 'GSTIN', verId: '', vehicleType: 'bike'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function fillDemo() {
    setForm(f => ({ ...f, phone: cfg.demo.phone, password: cfg.demo.password }))
  }

  function focusInput(e) {
    e.target.style.borderColor = THEME.primary
    e.target.style.boxShadow = `0 0 0 3px ${THEME.primaryLight}`
  }
  function blurInput(e) {
    e.target.style.borderColor = '#BBF7D0'
    e.target.style.boxShadow = 'none'
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await api.post(`/auth/${role}/${mode}`, form)
      login(data.user)
      navigate(`/${role}`)
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong. Check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'Nunito, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '36px 40px',
        width: '100%',
        maxWidth: 460,
        boxShadow: '0 20px 60px rgba(12,131,31,0.12)',
        border: '1px solid #D1FAE5',
      }}>

        {/* Back link */}
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: THEME.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
          ← Back to home
        </button>

        {/* Logo + title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: THEME.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 12px', boxShadow: '0 4px 16px rgba(12,131,31,0.3)'
          }}>
            {cfg.icon}
          </div>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#1C1C1E', marginBottom: 4 }}>
            {mode === 'login' ? `Welcome back` : `Join as ${cfg.label}`}
          </div>
          <div style={{ color: '#6B6B6B', fontSize: 14 }}>
            {mode === 'login' ? `Sign in to your ${cfg.label} account` : `Create your free account`}
          </div>
        </div>

        {/* Role tabs */}
        <div style={{ display: 'flex', background: '#F0FDF4', borderRadius: 10, padding: 3, marginBottom: 20, gap: 2 }}>
          {Object.entries(ROLE_CONFIG).map(([r, c]) => (
            <button key={r} onClick={() => { navigate(`/auth/${r}`); setError('') }}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none',
                fontFamily: 'Nunito, sans-serif', fontSize: 12, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.15s',
                background: role === r ? '#fff' : 'transparent',
                color: role === r ? THEME.primary : '#9CA3AF',
                boxShadow: role === r ? '0 1px 6px rgba(12,131,31,0.15)' : 'none',
              }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Login / Register toggle */}
        <div style={{ display: 'flex', background: '#F0FDF4', borderRadius: 10, padding: 3, marginBottom: 24 }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.2s',
                background: mode === m ? THEME.gradient : 'transparent',
                color: mode === m ? '#fff' : '#9CA3AF',
                boxShadow: mode === m ? '0 2px 10px rgba(12,131,31,0.3)' : 'none',
              }}>
              {m === 'login' ? 'Log In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Demo credentials hint (login only) */}
        {mode === 'login' && (
          <div style={{
            background: '#F0FDF4', border: '1px solid #BBF7D0',
            borderRadius: 10, padding: '10px 14px', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: THEME.primary, marginBottom: 2 }}>🔑 DEMO CREDENTIALS</div>
              <div style={{ fontSize: 12, color: '#6B6B6B', fontFamily: 'Space Mono, monospace' }}>
                {cfg.demo.phone} / {cfg.demo.password}
              </div>
            </div>
            <button onClick={fillDemo} style={{
              background: THEME.gradient, color: '#fff', border: 'none',
              borderRadius: 8, padding: '6px 12px', fontSize: 12,
              fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap'
            }}>
              Fill in →
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 18, color: '#B91C1C', fontSize: 13, fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Priya Sharma" required style={iStyle}
                  onFocus={focusInput} onBlur={blurInput} />
              </div>
            )}

            {mode === 'register' && role === 'owner' && (
              <div>
                <label style={labelStyle}>Store Name *</label>
                <input value={form.storeName} onChange={e => set('storeName', e.target.value)}
                  placeholder="e.g. Shri Ram Kirana" required style={iStyle}
                  onFocus={focusInput} onBlur={blurInput} />
              </div>
            )}

            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+91 98765 43210" required style={iStyle}
                onFocus={focusInput} onBlur={blurInput} />
            </div>

            <div>
              <label style={labelStyle}>Password *</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'} required style={iStyle}
                onFocus={focusInput} onBlur={blurInput} />
            </div>

            {mode === 'register' && role !== 'rider' && (
              <div>
                <label style={labelStyle}>Address</label>
                <input value={form.address} onChange={e => set('address', e.target.value)}
                  placeholder="House, Street, Area, City" style={iStyle}
                  onFocus={focusInput} onBlur={blurInput} />
              </div>
            )}

            {mode === 'register' && role === 'owner' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: '0 0 110px' }}>
                  <label style={labelStyle}>Verification</label>
                  <select value={form.verType} onChange={e => set('verType', e.target.value)}
                    style={iStyle} onFocus={focusInput} onBlur={blurInput}>
                    <option>GSTIN</option><option>UDYAM</option><option>PAN</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>ID Number</label>
                  <input value={form.verId} onChange={e => set('verId', e.target.value)}
                    placeholder="e.g. 29ABCDE1234F1Z5" style={iStyle}
                    onFocus={focusInput} onBlur={blurInput} />
                </div>
              </div>
            )}

            {mode === 'register' && role === 'rider' && (
              <div>
                <label style={labelStyle}>Vehicle Type</label>
                <select value={form.vehicleType} onChange={e => set('vehicleType', e.target.value)}
                  style={iStyle} onFocus={focusInput} onBlur={blurInput}>
                  <option value="bike">🏍️ Bike</option>
                  <option value="scooter">🛵 Scooter</option>
                  <option value="cycle">🚲 Cycle</option>
                </select>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', marginTop: 22, padding: '13px',
            background: loading ? '#86EFAC' : THEME.gradient,
            color: '#fff', border: 'none', borderRadius: 12,
            fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Nunito, sans-serif',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(12,131,31,0.35)',
            transition: 'all 0.2s',
          }}>
            {loading ? '⏳ Please wait…' : mode === 'login' ? `Sign In →` : `Create Account →`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#9CA3AF' }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            style={{ background: 'none', border: 'none', color: THEME.primary, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
            {mode === 'login' ? 'Register here' : 'Login here'}
          </button>
        </div>

        {/* Branding */}
        <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid #E8F5E9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: THEME.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🏪</div>
            <span style={{ fontWeight: 900, fontSize: 15, color: THEME.primary, letterSpacing: -0.5 }}>KiranaOS</span>
          </div>
          <div style={{ fontSize: 11, color: THEME.accent, marginTop: 3, opacity: 0.8 }}>Hyperlocal kirana delivery</div>
        </div>
      </div>
    </div>
  )
}