import { formatPrice } from '../../utils/formatPrice'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

type Order = {
  id: string
  client: string
  contact: string
  items: number
  amount: number
  date: string
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Pending' | 'Cancelled'
  payment: string
  tracking?: string
}



const STATUS_FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const statusStyle: Record<string, string> = {
  Delivered: 'bg-[#d1fae5] text-[#047857]',
  Shipped: 'bg-sky-100 text-sky-700',
  Processing: 'bg-[#dce5f4] text-[#1a2d5a]',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:3001/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const formatted = data.map((d: any) => ({
          id: d.orderNumber,
          client: JSON.parse(d.shippingAddress).company || 'Individual',
          contact: d.contactName,
          items: d.orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
          amount: d.totalAmount,
          date: new Date(d.createdAt).toISOString().split('T')[0],
          status: d.status,
          payment: d.paymentMethod,
          tracking: d.trackingNumber,
          dbId: d.id // keeping for status updates
        }))
        setOrders(formatted)
      })
  }, [token])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const orderToUpdate = orders.find(o => o.id === id)
      if (!orderToUpdate) return

      await fetch(`http://localhost:3001/api/admin/orders/${(orderToUpdate as any).dbId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus as any } : o))
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false
    if (search && !o.client.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalRevenue = filtered.reduce((s, o) => s + (o.status !== 'Cancelled' ? o.amount : 0), 0)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35]">Orders</h2>
          <p className="text-xs text-[#7c96cc] mt-0.5">{orders.length} total orders · ${totalRevenue.toLocaleString()} filtered revenue</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-[#dce5f4] bg-white px-4 py-2 text-xs font-semibold text-[#1a2d5a] hover:bg-[#f0f4fb] transition-all">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Orders', val: orders.length, style: 'text-[#1a2d5a]' },
          { label: 'Pending / Processing', val: orders.filter(o => ['Pending','Processing'].includes(o.status)).length, style: 'text-amber-600' },
          { label: 'Shipped', val: orders.filter(o => o.status === 'Shipped').length, style: 'text-sky-600' },
          { label: 'Delivered', val: orders.filter(o => o.status === 'Delivered').length, style: 'text-[#10b981]' },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-[#dce5f4] bg-white p-4">
            <p style={{ fontFamily: 'Fraunces, serif' }} className={`text-2xl font-bold ${k.style}`}>{k.val}</p>
            <p className="text-xs text-[#7c96cc] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7c96cc]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order ID or client…" className="w-full rounded-lg border border-[#dce5f4] bg-white pl-9 pr-3.5 py-2 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none transition-all" />
        </div>
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${statusFilter === s ? 'bg-[#1a2d5a] text-white' : 'border border-[#dce5f4] text-[#4a65ab] hover:bg-[#f0f4fb]'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#dce5f4] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f0f4fb] bg-[#f8fafd]">
              {['Order ID', 'Client', 'Items', 'Amount', 'Date', 'Payment', 'Status', 'Actions'].map((col) => (
                <th key={col} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4fb]">
            {filtered.map((o) => (
              <React.Fragment key={o.id}>
                <tr className="group hover:bg-[#f8fafd] transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}>
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-[11px] font-semibold text-[#1a2d5a]">{o.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-[#0d1b35]">{o.client}</p>
                    <p className="text-[10px] text-[#7c96cc]">{o.contact}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#4a65ab] font-medium">{o.items} units</td>
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: 'Fraunces, serif' }} className="text-sm font-bold text-[#0d1b35]">{formatPrice(o.amount.toLocaleString())}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#4a65ab]">{o.date}</td>
                  <td className="px-4 py-3 text-xs text-[#7c96cc]">{o.payment}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusStyle[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="rounded-md border border-[#dce5f4] px-2 py-1 text-[10px] font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">View</button>
                      {o.status === 'Pending' && (
                        <button onClick={(e) => { e.stopPropagation(); handleStatusChange(o.id, 'Processing') }} className="rounded-md border border-[#d1fae5] bg-[#ecfdf5] px-2 py-1 text-[10px] font-semibold text-[#047857] hover:bg-[#d1fae5] transition-all">Approve</button>
                      )}
                      {o.status === 'Processing' && (
                        <button onClick={(e) => { e.stopPropagation(); handleStatusChange(o.id, 'Shipped') }} className="rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700 hover:bg-sky-100 transition-all">Ship</button>
                      )}
                      {o.status === 'Shipped' && (
                        <button onClick={(e) => { e.stopPropagation(); handleStatusChange(o.id, 'Delivered') }} className="rounded-md border border-[#d1fae5] bg-[#ecfdf5] px-2 py-1 text-[10px] font-semibold text-[#047857] hover:bg-[#d1fae5] transition-all">Deliver</button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedId === o.id && (
                  <tr>
                    <td colSpan={8} className="px-4 py-4 bg-[#f8fafd] border-b border-[#dce5f4]">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="font-semibold text-[#213870] mb-1.5">Order Details</p>
                          <div className="space-y-1 text-[#4a65ab]">
                            <div className="flex justify-between"><span>Order ID</span><span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-[#0d1b35]">{o.id}</span></div>
                            <div className="flex justify-between"><span>Date</span><span className="text-[#0d1b35]">{o.date}</span></div>
                            <div className="flex justify-between"><span>Items</span><span className="text-[#0d1b35]">{o.items} units</span></div>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#213870] mb-1.5">Payment Info</p>
                          <div className="space-y-1 text-[#4a65ab]">
                            <div className="flex justify-between"><span>Method</span><span className="text-[#0d1b35]">{o.payment}</span></div>
                            <div className="flex justify-between"><span>Amount</span><span className="text-[#0d1b35] font-semibold">{formatPrice(o.amount.toLocaleString())}</span></div>
                            <div className="flex justify-between"><span>Tax (8%)</span><span className="text-[#0d1b35]">{formatPrice(Math.round(o.amount * 0.08).toLocaleString())}</span></div>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#213870] mb-1.5">Tracking</p>
                          {o.tracking ? (
                            <div>
                              <p style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-[10px] text-[#0d1b35] break-all">{o.tracking}</p>
                              <button className="mt-1.5 text-[10px] font-semibold text-[#10b981] hover:text-[#047857]">Track Package →</button>
                            </div>
                          ) : (
                            <p className="text-[#b3c3e6]">Not yet shipped</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="border-t border-[#f0f4fb] px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-[#7c96cc]">Showing {filtered.length} of {orders.length} orders</p>
          <div className="flex gap-1">
            {['←', '1', '2', '→'].map((p) => (
              <button key={p} className={`h-7 w-7 rounded text-xs font-medium transition-all ${p === '1' ? 'bg-[#1a2d5a] text-white' : 'text-[#4a65ab] hover:bg-[#f0f4fb]'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
