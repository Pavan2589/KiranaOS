// SocketContext.jsx — KiranaOS v3 (with rider location tracking)
import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [stores, setStores] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [riders, setRiders] = useState([])
  const [riderLocations, setRiderLocations] = useState({}) // riderId → {lat,lng}

  useEffect(() => {
    const s = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling']
    })
    s.on('connect', () => setConnected(true))
    s.on('disconnect', () => setConnected(false))
    s.on('init', ({ stores, orders, customers, riders }) => {
      setStores(stores); setOrders(orders); setCustomers(customers); setRiders(riders)
      // Init rider locations map
      const locs = {}
      riders.forEach(r => { if (r.currentLat) locs[r.id] = { lat: r.currentLat, lng: r.currentLng } })
      setRiderLocations(locs)
    })
    s.on('order:update', ({ order }) => {
      if (!order) return
      setOrders(prev => {
        const idx = prev.findIndex(o => o.id === order.id)
        if (idx >= 0) { const n = [...prev]; n[idx] = order; return n }
        return [order, ...prev]
      })
    })
    s.on('order:new', ({ order }) => {
      if (!order) return
      setOrders(prev => {
        const idx = prev.findIndex(o => o.id === order.id)
        if (idx >= 0) { const n = [...prev]; n[idx] = order; return n }
        return [order, ...prev]
      })
    })
    s.on('store:status', ({ store }) => {
      if (!store) return
      setStores(prev => prev.map(st => st.id === store.id ? store : st))
    })
    s.on('rider:location', ({ riderId, lat, lng }) => {
      setRiderLocations(prev => ({ ...prev, [riderId]: { lat, lng } }))
      setRiders(prev => prev.map(r => r.id === riderId ? { ...r, currentLat: lat, currentLng: lng } : r))
    })
    setSocket(s)
    return () => s.disconnect()
  }, [])

  return (
    <SocketContext.Provider value={{ socket, connected, stores, setStores, orders, setOrders, customers, riders, riderLocations }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
