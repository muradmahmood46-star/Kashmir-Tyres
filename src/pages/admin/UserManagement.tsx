import { useState } from 'react'

type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Suspended' | 'Pending'
  lastLogin: string
  joined: string
  avatar: string
}

const INITIAL_USERS: User[] = [
  { id: 'USR-001', name: 'Sarah Anderson', email: 'sarah.a@meridian.com', role: 'Super Admin', status: 'Active', lastLogin: '2026-08-05 09:14', joined: '2024-01-12', avatar: 'SA' },
  { id: 'USR-002', name: 'Marcus Chen', email: 'm.chen@meridian.com', role: 'Admin', status: 'Active', lastLogin: '2026-08-05 08:47', joined: '2024-02-28', avatar: 'MC' },
  { id: 'USR-003', name: 'Dr. Priya Nair', email: 'p.nair@atlashealth.com', role: 'Manager', status: 'Active', lastLogin: '2026-08-04 17:32', joined: '2024-03-15', avatar: 'PN' },
  { id: 'USR-004', name: 'James Okafor', email: 'j.okafor@northpoint.gov', role: 'Viewer', status: 'Suspended', lastLogin: '2026-07-29 11:05', joined: '2024-04-01', avatar: 'JO' },
  { id: 'USR-005', name: 'Lisa Tanaka', email: 'l.tanaka@vegaretail.com', role: 'Manager', status: 'Active', lastLogin: '2026-08-05 07:22', joined: '2024-05-10', avatar: 'LT' },
  { id: 'USR-006', name: 'Ryan Okonkwo', email: 'r.okonkwo@quantumc.com', role: 'Admin', status: 'Pending', lastLogin: '—', joined: '2026-08-04', avatar: 'RO' },
  { id: 'USR-007', name: 'Emily Zhao', email: 'e.zhao@meridian.com', role: 'Viewer', status: 'Active', lastLogin: '2026-08-03 15:44', joined: '2024-06-20', avatar: 'EZ' },
  { id: 'USR-008', name: 'Carlos Vega', email: 'c.vega@quantumc.com', role: 'Manager', status: 'Active', lastLogin: '2026-08-05 06:50', joined: '2024-07-08', avatar: 'CV' },
]

const ROLES = ['All Roles', 'Super Admin', 'Admin', 'Manager', 'Viewer']
const STATUS_FILTERS = ['All', 'Active', 'Suspended', 'Pending']

const statusStyle: Record<string, string> = {
  Active: 'bg-[#d1fae5] text-[#047857]',
  Suspended: 'bg-red-100 text-red-700',
  Pending: 'bg-amber-100 text-amber-700',
}

const roleStyle: Record<string, string> = {
  'Super Admin': 'bg-[#1a2d5a] text-white',
  Admin: 'bg-[#dce5f4] text-[#1a2d5a]',
  Manager: 'bg-[#f0f4fb] text-[#4a65ab]',
  Viewer: 'bg-gray-100 text-gray-500',
}

export default function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState<string[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Viewer')
  const [inviteSent, setInviteSent] = useState(false)

  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    if (roleFilter !== 'All Roles' && u.role !== roleFilter) return false
    if (statusFilter !== 'All' && u.status !== statusFilter) return false
    return true
  })

  const toggleSelect = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((u) => u.id))

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u))
  }

  const handleInvite = () => {
    setInviteSent(true)
    setTimeout(() => { setInviteSent(false); setShowInvite(false); setInviteEmail('') }, 1500)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35]">User Management</h2>
          <p className="text-xs text-[#7c96cc] mt-0.5">{users.filter(u => u.status === 'Active').length} active · {users.filter(u => u.status === 'Pending').length} pending</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#1a2d5a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#213870] transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Invite User
        </button>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#dce5f4] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35]">Invite New User</h3>
              <button onClick={() => setShowInvite(false)} className="text-[#b3c3e6] hover:text-[#4a65ab]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Email address</label>
                <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none transition-all" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all">
                  {['Admin', 'Manager', 'Viewer'].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <button onClick={handleInvite} className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-all ${inviteSent ? 'bg-[#10b981] text-white' : 'bg-[#1a2d5a] text-white hover:bg-[#213870]'}`}>
                {inviteSent ? '✓ Invitation Sent!' : 'Send Invitation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Users', val: users.length, color: 'text-[#1a2d5a]' },
          { label: 'Active', val: users.filter(u => u.status === 'Active').length, color: 'text-[#10b981]' },
          { label: 'Suspended', val: users.filter(u => u.status === 'Suspended').length, color: 'text-red-500' },
          { label: 'Pending', val: users.filter(u => u.status === 'Pending').length, color: 'text-amber-500' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#dce5f4] bg-white p-4">
            <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: 'Fraunces, serif' }}>{s.val}</p>
            <p className="text-xs text-[#7c96cc] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7c96cc]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="w-full rounded-lg border border-[#dce5f4] bg-white pl-9 pr-3.5 py-2 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none transition-all" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-lg border border-[#dce5f4] bg-white px-3 py-2 text-sm text-[#213870] focus:outline-none focus:border-[#4a65ab]">
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
        <div className="flex gap-1">
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${statusFilter === s ? 'bg-[#1a2d5a] text-white' : 'border border-[#dce5f4] text-[#4a65ab] hover:bg-[#f0f4fb]'}`}>{s}</button>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-[#7c96cc]">{selected.length} selected</span>
            <button className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-all">Suspend Selected</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#dce5f4] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f0f4fb] bg-[#f8fafd]">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-3.5 w-3.5 rounded border-[#b3c3e6] accent-[#1a2d5a]" />
              </th>
              {['User', 'ID', 'Role', 'Status', 'Last Login', 'Joined', 'Actions'].map((col) => (
                <th key={col} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4fb]">
            {filtered.map((u) => (
              <tr key={u.id} className={`group hover:bg-[#f8fafd] transition-colors ${selected.includes(u.id) ? 'bg-[#f0f4fb]' : ''}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} className="h-3.5 w-3.5 rounded border-[#b3c3e6] accent-[#1a2d5a]" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1a2d5a] to-[#2a4690] flex items-center justify-center text-white text-[10px] font-bold shrink-0">{u.avatar}</div>
                    <div>
                      <p className="text-xs font-semibold text-[#0d1b35]">{u.name}</p>
                      <p className="text-[10px] text-[#7c96cc]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-[11px] text-[#7c96cc]">{u.id}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${roleStyle[u.role]}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusStyle[u.status]}`}>{u.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-[#4a65ab]">{u.lastLogin}</td>
                <td className="px-4 py-3 text-xs text-[#7c96cc]">{u.joined}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="rounded-md border border-[#dce5f4] p-1.5 text-[#4a65ab] hover:border-[#4a65ab] hover:bg-[#f0f4fb] transition-all" title="Edit">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                    </button>
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`rounded-md border p-1.5 transition-all text-[11px] font-semibold px-2 ${u.status === 'Active' ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-[#d1fae5] text-[#047857] hover:bg-[#ecfdf5]'}`}
                      title={u.status === 'Active' ? 'Suspend' : 'Activate'}
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-[#f0f4fb] px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-[#7c96cc]">Showing {filtered.length} of {users.length} users</p>
          <div className="flex gap-1">
            {['←', '1', '2', '3', '→'].map((p) => (
              <button key={p} className={`h-7 w-7 rounded text-xs font-medium transition-all ${p === '1' ? 'bg-[#1a2d5a] text-white' : 'text-[#4a65ab] hover:bg-[#f0f4fb]'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
