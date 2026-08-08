export const OCCASION_THEMES = ['azadi', 'eid', 'blackFriday', 'elevenEleven', 'general'] as const

export type OccasionTheme = (typeof OCCASION_THEMES)[number]

export type SaleThemeConfig = {
  label: string
  icon: string
  primaryColor: string
  accentColor: string
  gradient: string
}

export const SALE_THEMES: Record<OccasionTheme, SaleThemeConfig> = {
  azadi: {
    label: 'Azadi Sale',
    icon: '🇵🇰',
    primaryColor: '#01411C',
    accentColor: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #01411C 0%, #0f4b29 100%)',
  },
  eid: {
    label: 'Eid Sale',
    icon: '🌙',
    primaryColor: '#b38b00',
    accentColor: '#10b981',
    gradient: 'linear-gradient(135deg, #b38b00 0%, #047857 100%)',
  },
  blackFriday: {
    label: 'Black Friday',
    icon: '🛍️',
    primaryColor: '#0d0d0d',
    accentColor: '#fbbf24',
    gradient: 'linear-gradient(135deg, #000000 0%, #f59e0b 100%)',
  },
  elevenEleven: {
    label: '11.11 Sale',
    icon: '⚡',
    primaryColor: '#064e3b',
    accentColor: '#34d399',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
  },
  general: {
    label: 'General Sale',
    icon: '🔥',
    primaryColor: '#047857',
    accentColor: '#ffffff',
    gradient: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
  },
}
