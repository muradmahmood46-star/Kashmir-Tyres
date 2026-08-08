import { formatPrice } from '../../utils/formatPrice'
import { useState, useEffect } from 'react'
import { useApp, type TrustedOrg, type HeroStat } from '../../context/AppContext'

type Tab = 'general' | 'security' | 'notifications' | 'integrations' | 'billing' | 'storefront'

const TABS: { id: Tab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'security', label: 'Security & Access' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'billing', label: 'Billing' },
  { id: 'storefront', label: 'Storefront' },
]

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? 'bg-[#10b981]' : 'bg-[#dce5f4]'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function Settings() {
  const { trustedOrgs, addTrustedOrg, updateTrustedOrg, deleteTrustedOrg, heroStats, updateHeroStat, settings, updateSettings } = useApp()
  const [tab, setTab] = useState<Tab>('general')
  const [saved, setSaved] = useState(false)
  const [orgForm, setOrgForm] = useState({ name: '', industry: '' })
  const [editingOrg, setEditingOrg] = useState<TrustedOrg | null>(null)
  const [statDrafts, setStatDrafts] = useState<Record<string, { value: string; label: string }>>({})
  const [savedStats, setSavedStats] = useState<Record<string, boolean>>({})
  const [bannerImageDraft, setBannerImageDraft] = useState(settings?.bannerImage || '')
  const [bannerSaved, setBannerSaved] = useState(false)
  const [bannerTextDraft, setBannerTextDraft] = useState({
    bannerLabel: settings?.bannerLabel || '',
    bannerTitle: settings?.bannerTitle || '',
    bannerSubtext: settings?.bannerSubtext || ''
  })
  const [bannerTextSaved, setBannerTextSaved] = useState(false)
  const [general, setGeneral] = useState(settings)
  
  useEffect(() => {
    setGeneral(settings)
    if (!bannerImageDraft || bannerImageDraft === settings?.bannerImage) {
      setBannerImageDraft(settings?.bannerImage || '')
    }
    setBannerTextDraft({
      bannerLabel: settings?.bannerLabel || '',
      bannerTitle: settings?.bannerTitle || '',
      bannerSubtext: settings?.bannerSubtext || ''
    })
  }, [settings])
  const [security, setSecurity] = useState({
    mfa: true,
    ssoEnabled: false,
    sessionTimeout: '8',
    ipWhitelist: false,
    auditLog: true,
    apiKeys: true,
  })
  const [notifications, setNotifications] = useState({
    threatAlerts: true,
    orderUpdates: true,
    loginAlerts: true,
    weeklyReport: false,
    systemMaintenance: true,
    emailDigest: true,
  })

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerImageDraft(reader.result as string)
        setBannerSaved(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (tab === 'general') {
      updateSettings(general)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35]">Settings</h2>
        <p className="text-xs text-[#7c96cc] mt-0.5">Manage your organization and platform configuration</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-44 shrink-0">
          <nav className="space-y-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all ${tab === t.id ? 'bg-[#1a2d5a] text-white' : 'text-[#4a65ab] hover:bg-[#f0f4fb]'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-xl border border-[#dce5f4] bg-white overflow-hidden">
          {tab === 'general' && (
            <div>
              <div className="border-b border-[#f0f4fb] px-6 py-4">
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">General Settings</h3>
                <p className="text-xs text-[#7c96cc]">Organization profile and regional preferences</p>
              </div>
              <div className="p-6 space-y-5">
                {/* Logo */}
                <div className="flex items-center gap-4 pb-5 border-b border-[#f0f4fb]">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#1a2d5a] to-[#10b981] flex items-center justify-center text-white text-xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>CV</div>
                  <div>
                    <p className="text-xs font-semibold text-[#0d1b35] mb-1">Organization Logo</p>
                    <p className="text-[11px] text-[#7c96cc] mb-2">PNG, JPG or SVG. Max 2MB. 512×512px recommended.</p>
                    <button className="rounded-lg border border-[#dce5f4] px-3 py-1.5 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Upload Logo</button>
                  </div>
                </div>

                {[
                  { label: 'Organization Name', key: 'orgName' },
                  { label: 'Default Timezone', key: 'timezone' },
                  { label: 'Language', key: 'language' },
                  { label: 'Date Format', key: 'dateFormat' },
                  { label: 'Currency', key: 'currency' },
                ].map(({ label, key }) => (
                  <div key={key} className="grid grid-cols-3 items-center gap-4">
                    <label className="text-xs font-semibold text-[#213870]">{label}</label>
                    <input
                      value={(general as any)[key]}
                      onChange={(e) => setGeneral({ ...general, [key]: e.target.value })}
                      className="col-span-2 rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div>
              <div className="border-b border-[#f0f4fb] px-6 py-4">
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">Security & Access</h3>
                <p className="text-xs text-[#7c96cc]">Authentication, session, and access control settings</p>
              </div>
              <div className="divide-y divide-[#f0f4fb]">
                {[
                  { key: 'mfa', label: 'Multi-Factor Authentication', desc: 'Require TOTP or hardware key for all admin logins' },
                  { key: 'ssoEnabled', label: 'Single Sign-On (SSO)', desc: 'SAML 2.0 / OIDC integration with your identity provider' },
                  { key: 'ipWhitelist', label: 'IP Allowlisting', desc: 'Restrict admin access to approved IP ranges only' },
                  { key: 'auditLog', label: 'Full Audit Logging', desc: 'Log every action for compliance and forensics review' },
                  { key: 'apiKeys', label: 'API Key Management', desc: 'Allow administrators to generate and revoke API keys' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#0d1b35]">{label}</p>
                      <p className="text-xs text-[#7c96cc]">{desc}</p>
                    </div>
                    <Toggle enabled={(security as any)[key]} onChange={() => setSecurity({ ...security, [key]: !(security as any)[key] })} />
                  </div>
                ))}
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0d1b35]">Session Timeout</p>
                    <p className="text-xs text-[#7c96cc]">Automatically log out inactive sessions</p>
                  </div>
                  <select value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} className="rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3 py-1.5 text-sm text-[#213870] focus:border-[#4a65ab] focus:outline-none transition-all">
                    {['1', '4', '8', '24', '72'].map((h) => <option key={h} value={h}>{h} hour{h !== '1' ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <div className="border-b border-[#f0f4fb] px-6 py-4">
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">Notification Preferences</h3>
                <p className="text-xs text-[#7c96cc]">Choose which alerts and updates to receive</p>
              </div>
              <div className="divide-y divide-[#f0f4fb]">
                {[
                  { key: 'threatAlerts', label: 'Threat Alerts', desc: 'Immediate notification on critical security events', critical: true },
                  { key: 'loginAlerts', label: 'Suspicious Login Alerts', desc: 'Alert on login from new device or location', critical: true },
                  { key: 'orderUpdates', label: 'Order & Shipment Updates', desc: 'Status changes for active orders' },
                  { key: 'weeklyReport', label: 'Weekly Security Report', desc: 'Summary digest every Monday morning' },
                  { key: 'systemMaintenance', label: 'Maintenance Notices', desc: 'Planned downtime and update announcements' },
                  { key: 'emailDigest', label: 'Daily Email Digest', desc: 'Consolidated summary of platform activity' },
                ].map(({ key, label, desc, critical }) => (
                  <div key={key} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#0d1b35]">{label}</p>
                        {critical && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold uppercase text-red-600">Critical</span>}
                      </div>
                      <p className="text-xs text-[#7c96cc]">{desc}</p>
                    </div>
                    <Toggle enabled={(notifications as any)[key]} onChange={() => setNotifications({ ...notifications, [key]: !(notifications as any)[key] })} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'integrations' && (
            <div>
              <div className="border-b border-[#f0f4fb] px-6 py-4">
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">Integrations</h3>
                <p className="text-xs text-[#7c96cc]">Connect CyberVault with your existing tools</p>
              </div>
              <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { name: 'Microsoft Azure AD', desc: 'SSO and directory sync', status: 'Connected', color: 'bg-[#d1fae5] text-[#047857]' },
                  { name: 'Slack', desc: 'Real-time alert notifications', status: 'Connected', color: 'bg-[#d1fae5] text-[#047857]' },
                  { name: 'Splunk SIEM', desc: 'Log forwarding and correlation', status: 'Not Connected', color: 'bg-[#f0f4fb] text-[#4a65ab]' },
                  { name: 'PagerDuty', desc: 'Incident escalation and on-call', status: 'Not Connected', color: 'bg-[#f0f4fb] text-[#4a65ab]' },
                  { name: 'ServiceNow', desc: 'ITSM ticket creation', status: 'Not Connected', color: 'bg-[#f0f4fb] text-[#4a65ab]' },
                  { name: 'Jira', desc: 'Security issue tracking', status: 'Not Connected', color: 'bg-[#f0f4fb] text-[#4a65ab]' },
                ].map((int) => (
                  <div key={int.name} className="flex items-center justify-between rounded-lg border border-[#dce5f4] p-4 hover:border-[#b3c3e6] transition-all">
                    <div>
                      <p className="text-sm font-semibold text-[#0d1b35]">{int.name}</p>
                      <p className="text-[11px] text-[#7c96cc]">{int.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${int.color}`}>{int.status}</span>
                      <button className="text-xs font-semibold text-[#4a65ab] hover:text-[#1a2d5a] transition-colors">
                        {int.status === 'Connected' ? 'Configure' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'billing' && (
            <div>
              <div className="border-b border-[#f0f4fb] px-6 py-4">
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">Billing & Subscription</h3>
                <p className="text-xs text-[#7c96cc]">Manage your plan, invoices, and payment method</p>
              </div>
              <div className="p-6 space-y-5">
                {/* Current plan */}
                <div className="rounded-xl bg-gradient-to-r from-[#0d1b35] to-[#1a2d5a] p-5 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7c96cc] mb-1">Current Plan</p>
                      <p style={{ fontFamily: 'Fraunces, serif' }} className="text-2xl font-semibold">Enterprise</p>
                      <p className="text-sm text-[#7c96cc] mt-1">Unlimited users · All features · 24/7 Priority Support</p>
                    </div>
                    <span className="rounded-full bg-[#10b981] px-3 py-1 text-[10px] font-bold uppercase text-white">Active</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <span style={{ fontFamily: 'Fraunces, serif' }} className="text-3xl font-bold">Rs 4,800</span>
                      <span className="text-[#7c96cc] ml-1">/month</span>
                    </div>
                    <p className="text-xs text-[#7c96cc]">Next renewal: Sep 1, 2026</p>
                  </div>
                </div>

                {/* Payment method */}
                <div>
                  <p className="text-xs font-semibold text-[#213870] mb-3">Payment Method</p>
                  <div className="flex items-center justify-between rounded-lg border border-[#dce5f4] p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 rounded-md bg-[#1a2d5a] flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <div>
                        <p className="text-sm font-semibold text-[#0d1b35]">Visa ending in 4821</p>
                        <p className="text-xs text-[#7c96cc]">Expires 09/2028</p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-[#4a65ab] hover:text-[#1a2d5a] transition-colors">Update</button>
                  </div>
                </div>

                {/* Invoices */}
                <div>
                  <p className="text-xs font-semibold text-[#213870] mb-3">Recent Invoices</p>
                  <div className="rounded-lg border border-[#dce5f4] overflow-hidden">
                    {[
                      { period: 'August 2026', amount: 'Rs 4,800', status: 'Paid', date: 'Aug 1, 2026' },
                      { period: 'July 2026', amount: 'Rs 4,800', status: 'Paid', date: 'Jul 1, 2026' },
                      { period: 'June 2026', amount: 'Rs 4,800', status: 'Paid', date: 'Jun 1, 2026' },
                    ].map((inv, i) => (
                      <div key={inv.period} className={`flex items-center justify-between px-4 py-3 text-xs ${i > 0 ? 'border-t border-[#f0f4fb]' : ''}`}>
                        <div>
                          <p className="font-semibold text-[#0d1b35]">{inv.period}</p>
                          <p className="text-[#7c96cc]">{inv.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#0d1b35]">{inv.amount}</span>
                          <span className="rounded-full bg-[#d1fae5] px-2 py-0.5 text-[10px] font-semibold text-[#047857]">{inv.status}</span>
                          <button className="text-[#4a65ab] hover:text-[#1a2d5a] font-semibold transition-colors">PDF</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Storefront tab */}
          {tab === 'storefront' && (
            <div className="p-6 space-y-6">

              {/* SOC Banner Image */}
              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35] mb-0.5">SOC Banner Image</h3>
                <p className="text-xs text-[#7c96cc] mb-4">Background image for the "24/7 Security Operations" section on the homepage.</p>
                <div className="rounded-xl border border-[#dce5f4] overflow-hidden">
                  {bannerImageDraft && (
                    <div className="relative h-32 bg-[#f0f4fb]">
                      <img src={bannerImageDraft} alt="Banner preview" className="w-full h-full object-cover opacity-80" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b35]/60 to-transparent flex items-center px-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#10b981]">24/7 Security Operations</p>
                          <p style={{ fontFamily: 'Fraunces, serif' }} className="text-white text-sm font-semibold">Your Threats Never Sleep.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4 flex gap-3">
                    <label className="flex-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#dce5f4] bg-[#f8fafd] py-4 cursor-pointer hover:bg-white hover:border-[#4a65ab] transition-all">
                      <span className="text-sm font-semibold text-[#4a65ab]">Upload Image</span>
                      <span className="text-xs text-[#7c96cc]">PNG, JPG, up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => { updateSettings({ bannerImage: bannerImageDraft }); setBannerSaved(true); setTimeout(() => setBannerSaved(false), 1500) }}
                      disabled={bannerImageDraft === settings?.bannerImage && !bannerSaved}
                      className={`rounded-lg px-4 py-2 text-xs font-semibold h-fit mt-auto transition-all ${bannerSaved ? 'bg-[#10b981] text-white' : bannerImageDraft !== settings?.bannerImage ? 'bg-[#1a2d5a] text-white hover:bg-[#213870]' : 'bg-[#f0f4fb] text-[#b3c3e6] cursor-default'}`}
                    >
                      {bannerSaved ? '✓ Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f0f4fb]" />

              {/* Banner Text */}
              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35] mb-0.5">Banner Text</h3>
                <p className="text-xs text-[#7c96cc] mb-4">Text displayed over the SOC Banner Image.</p>
                <div className="rounded-xl border border-[#dce5f4] bg-[#f8fafd] p-4 space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-[#4a65ab] mb-1.5 block">Label</label>
                    <input
                      value={bannerTextDraft.bannerLabel}
                      onChange={(e) => { setBannerTextDraft({ ...bannerTextDraft, bannerLabel: e.target.value }); setBannerTextSaved(false) }}
                      placeholder="e.g. 24/7 Security Operations"
                      className="w-full rounded-lg border border-[#dce5f4] bg-white px-3 py-2 text-sm focus:border-[#4a65ab] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-[#4a65ab] mb-1.5 block">Title</label>
                    <textarea
                      value={bannerTextDraft.bannerTitle}
                      onChange={(e) => { setBannerTextDraft({ ...bannerTextDraft, bannerTitle: e.target.value }); setBannerTextSaved(false) }}
                      placeholder="e.g. Your Threats Never Sleep. Neither Do We."
                      rows={2}
                      className="w-full rounded-lg border border-[#dce5f4] bg-white px-3 py-2 text-sm focus:border-[#4a65ab] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-[#4a65ab] mb-1.5 block">Subtext</label>
                    <textarea
                      value={bannerTextDraft.bannerSubtext}
                      onChange={(e) => { setBannerTextDraft({ ...bannerTextDraft, bannerSubtext: e.target.value }); setBannerTextSaved(false) }}
                      placeholder="e.g. Round-the-clock monitoring..."
                      rows={2}
                      className="w-full rounded-lg border border-[#dce5f4] bg-white px-3 py-2 text-sm focus:border-[#4a65ab] focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={() => { updateSettings(bannerTextDraft); setBannerTextSaved(true); setTimeout(() => setBannerTextSaved(false), 1500) }}
                    disabled={(bannerTextDraft.bannerLabel === settings?.bannerLabel && bannerTextDraft.bannerTitle === settings?.bannerTitle && bannerTextDraft.bannerSubtext === settings?.bannerSubtext) && !bannerTextSaved}
                    className={`w-full rounded-lg px-4 py-2 text-xs font-semibold transition-all ${bannerTextSaved ? 'bg-[#10b981] text-white' : (bannerTextDraft.bannerLabel !== settings?.bannerLabel || bannerTextDraft.bannerTitle !== settings?.bannerTitle || bannerTextDraft.bannerSubtext !== settings?.bannerSubtext) ? 'bg-[#1a2d5a] text-white hover:bg-[#213870]' : 'bg-[#f0f4fb] text-[#b3c3e6] cursor-default'}`}
                  >
                    {bannerTextSaved ? '✓ Saved' : 'Save Text'}
                  </button>
                </div>
              </div>

              <div className="border-t border-[#f0f4fb]" />

              {/* Website Top Images */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">Website Top Images</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4a65ab]">{(settings?.sliderImages || []).length} / 10</span>
                </div>
                <p className="text-xs text-[#7c96cc] mb-4">Background sliding images for the homepage hero section. Recommended size: 1920x1080px. Max 10 images.</p>
                
                <div className="flex flex-col gap-3">
                  {(settings?.sliderImages || []).map((imgUrl, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-[#dce5f4] bg-[#f8fafd] p-2">
                      <div className="flex items-center gap-3">
                        <img src={imgUrl} alt={`Slider ${i+1}`} className="h-10 w-16 rounded object-cover" />
                        <span className="text-xs font-semibold text-[#0d1b35]">Image {i + 1}</span>
                      </div>
                      <button
                        onClick={() => {
                          const newImages = [...(settings?.sliderImages || [])]
                          newImages.splice(i, 1)
                          updateSettings({ sliderImages: newImages })
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  
                  {(!settings?.sliderImages || settings.sliderImages.length < 10) && (
                    <div 
                      className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#dce5f4] bg-[#f8fafd] py-6 hover:border-[#4a65ab] hover:bg-[#f0f4fb] transition-all"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        const file = e.dataTransfer.files[0]
                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            updateSettings({ sliderImages: [...(settings?.sliderImages || []), reader.result as string] })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              updateSettings({ sliderImages: [...(settings?.sliderImages || []), reader.result as string] })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <svg className="mb-2 h-6 w-6 text-[#b3c3e6] group-hover:text-[#4a65ab] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs font-semibold text-[#4a65ab]">Add Image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-[#f0f4fb]" />

              {/* Hero Stats */}
              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35] mb-0.5">Homepage Stats</h3>
                <p className="text-xs text-[#7c96cc] mb-4">The four key numbers shown in the hero stats bar.</p>
                <div className="grid grid-cols-2 gap-3">
                  {heroStats.map((stat) => {
                    const draft = statDrafts[stat.id] ?? { value: stat.value, label: stat.label }
                    const isDirty = draft.value !== stat.value || draft.label !== stat.label
                    const isSaved = savedStats[stat.id]
                    const setDraft = (patch: Partial<typeof draft>) =>
                      setStatDrafts((prev) => ({ ...prev, [stat.id]: { ...draft, ...patch } }))
                    return (
                      <div key={stat.id} className={`rounded-xl border bg-[#f8fafd] p-3 space-y-2 transition-all ${isDirty ? 'border-[#4a65ab]' : 'border-[#dce5f4]'}`}>
                        <input
                          value={draft.value}
                          onChange={(e) => setDraft({ value: e.target.value })}
                          placeholder="e.g. 4,200+"
                          className="w-full rounded-lg border border-[#dce5f4] bg-white px-3 py-2 text-sm font-bold text-[#10b981] focus:border-[#4a65ab] focus:outline-none transition-all"
                          style={{ fontFamily: 'Fraunces, serif' }}
                        />
                        <input
                          value={draft.label}
                          onChange={(e) => setDraft({ label: e.target.value })}
                          placeholder="e.g. Enterprise Clients"
                          className="w-full rounded-lg border border-[#dce5f4] bg-white px-3 py-2 text-xs text-[#4a65ab] focus:border-[#4a65ab] focus:outline-none transition-all"
                        />
                        <button
                          onClick={() => {
                            updateHeroStat({ ...stat, ...draft })
                            setSavedStats((prev) => ({ ...prev, [stat.id]: true }))
                            setTimeout(() => setSavedStats((prev) => ({ ...prev, [stat.id]: false })), 1500)
                          }}
                          disabled={!isDirty && !isSaved}
                          className={`w-full rounded-lg py-1.5 text-[11px] font-semibold transition-all ${isSaved ? 'bg-[#10b981] text-white' : isDirty ? 'bg-[#1a2d5a] text-white hover:bg-[#213870]' : 'bg-[#f0f4fb] text-[#b3c3e6] cursor-default'}`}
                        >
                          {isSaved ? '✓ Saved' : 'Save'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="border-t border-[#f0f4fb]" />

              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35] mb-0.5">Trusted Organizations</h3>
                <p className="text-xs text-[#7c96cc]">These appear in the "Trusted by leading organizations" banner on the homepage.</p>
              </div>

              {/* Add / Edit form */}
              <div className="rounded-xl border border-[#dce5f4] bg-[#f8fafd] p-4 space-y-3">
                <p className="text-xs font-semibold text-[#213870]">{editingOrg ? 'Edit Organization' : 'Add Organization'}</p>
                <div className="flex gap-3">
                  <input
                    value={orgForm.name}
                    onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                    placeholder="Organization name…"
                    className="flex-1 rounded-lg border border-[#dce5f4] bg-white px-3 py-2 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
                  />
                  <input
                    value={orgForm.industry}
                    onChange={(e) => setOrgForm({ ...orgForm, industry: e.target.value })}
                    placeholder="Industry (optional)…"
                    className="w-40 rounded-lg border border-[#dce5f4] bg-white px-3 py-2 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
                  />
                  <button
                    onClick={() => {
                      if (!orgForm.name.trim()) return
                      if (editingOrg) {
                        updateTrustedOrg({ ...editingOrg, ...orgForm })
                        setEditingOrg(null)
                      } else {
                        addTrustedOrg({ id: `org-${Date.now()}`, ...orgForm })
                      }
                      setOrgForm({ name: '', industry: '' })
                    }}
                    disabled={!orgForm.name.trim()}
                    className="rounded-lg bg-[#1a2d5a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#213870] disabled:opacity-40 transition-all"
                  >
                    {editingOrg ? 'Update' : 'Add'}
                  </button>
                  {editingOrg && (
                    <button onClick={() => { setEditingOrg(null); setOrgForm({ name: '', industry: '' }) }} className="rounded-lg border border-[#dce5f4] px-3 py-2 text-xs font-semibold text-[#7c96cc] hover:bg-white transition-all">
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="rounded-xl border border-[#dce5f4] bg-white overflow-hidden">
                {trustedOrgs.length === 0 && (
                  <p className="px-5 py-8 text-center text-sm text-[#b3c3e6]">No organizations yet. Add one above.</p>
                )}
                <div className="divide-y divide-[#f0f4fb]">
                  {trustedOrgs.map((org, idx) => (
                    <div key={org.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#f8fafd] transition-colors">
                      <span className="text-xs font-mono text-[#dce5f4] w-5 shrink-0">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: 'Fraunces, serif' }} className="text-sm font-semibold text-[#0d1b35]">{org.name}</p>
                        {org.industry && <p className="text-[10px] uppercase tracking-widest text-[#7c96cc]">{org.industry}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => { setEditingOrg(org); setOrgForm({ name: org.name, industry: org.industry }) }}
                          className="flex items-center gap-1.5 rounded-lg border border-[#dce5f4] px-3 py-1.5 text-[11px] font-semibold text-[#1a2d5a] hover:bg-[#f0f4fb] transition-all"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTrustedOrg(org.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-[11px] font-semibold text-red-500 hover:bg-red-50 transition-all"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          {tab !== 'integrations' && tab !== 'billing' && tab !== 'storefront' && (
            <div className="border-t border-[#f0f4fb] px-6 py-4 flex justify-end">
              <button
                onClick={handleSave}
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${saved ? 'bg-[#10b981] text-white' : 'bg-[#1a2d5a] text-white hover:bg-[#213870]'}`}
              >
                {saved ? '✓ Saved Successfully' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
