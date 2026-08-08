export type Product = {
  id: number
  name: string
  category: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  badge?: string
  img: string
  gallery?: string[]
  tag?: string
  description?: string
  features: string[]
  specs: Record<string, string>
  inStock: boolean
  stock?: number
  freeShipping?: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'SecureNet ProFirewall X9',
    category: 'Firewalls',
    brand: 'SecureNet',
    price: 2499,
    originalPrice: 2999,
    rating: 4.9,
    reviews: 312,
    badge: 'Best Seller',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=450&fit=crop&auto=format',
    tag: 'Enterprise Grade',
    description: 'Industry-leading next-generation firewall with AI-driven threat detection, deep packet inspection, and zero-day protection for enterprise networks.',
    features: ['AI-Powered Threat Detection', 'Deep Packet Inspection', 'Zero-Day Protection', 'SSL/TLS Inspection', 'Centralized Management Console', '99.999% Uptime SLA'],
    specs: { Throughput: '40 Gbps', Connections: '5M concurrent', 'VPN Tunnels': '10,000', Interfaces: '24x 10GbE', 'Form Factor': '2U Rack', Warranty: '5 Years' },
    inStock: true,
    stock: 142,
    freeShipping: true,
  },
  {
    id: 2,
    name: 'VaultTech 4K NightVision Camera',
    category: 'Cameras',
    brand: 'VaultTech',
    price: 899,
    rating: 4.7,
    reviews: 578,
    badge: 'New',
    img: 'https://images.unsplash.com/photo-1607000975636-f0a9b0e2f148?w=600&h=450&fit=crop&auto=format',
    tag: 'AI-Powered',
    description: 'Ultra-HD 4K surveillance camera with AI-based person detection, license plate recognition, and color night vision up to 50m.',
    features: ['4K Ultra HD Resolution', 'AI Person Detection', 'Color Night Vision 50m', 'License Plate Recognition', 'IP67 Weatherproof', 'H.265+ Compression'],
    specs: { Resolution: '4K (3840×2160)', Sensor: '1/1.8" CMOS', 'Night Vision': '50m Color', FOV: '110° Wide', Storage: 'MicroSD + NAS', Warranty: '3 Years' },
    inStock: true,
    stock: 8,
  },
  {
    id: 3,
    name: 'ArmorCore Biometric Access Panel',
    category: 'Access Control',
    brand: 'ArmorCore',
    price: 1299,
    rating: 4.8,
    reviews: 204,
    badge: undefined,
    img: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=450&fit=crop&auto=format',
    tag: 'Military Grade',
    description: 'Multi-factor biometric access control panel supporting fingerprint, iris scan, and facial recognition with MIL-SPEC enclosure.',
    features: ['Fingerprint + Iris + Face ID', 'MIL-SPEC Enclosure', 'Offline Mode 90 Days', 'Anti-Tamper Alarm', '10,000 User Capacity', 'Cloud Management'],
    specs: { 'Auth Methods': '3-Factor Bio', Capacity: '10,000 users', Response: '<0.3 seconds', 'IP Rating': 'IP66', Power: 'PoE + Battery', Warranty: '5 Years' },
    inStock: true,
    stock: 34,
    freeShipping: true,
  },
  {
    id: 4,
    name: 'CipherShield Managed Switch 48P',
    category: 'Networking',
    brand: 'CipherShield',
    price: 3199,
    rating: 4.6,
    reviews: 87,
    badge: 'Popular',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=450&fit=crop&auto=format',
    tag: 'PoE+',
    description: '48-port managed PoE+ switch with hardware encryption, 802.1X authentication, and comprehensive Layer 3 routing capabilities.',
    features: ['48x PoE+ Ports (802.3at)', 'Hardware AES-256 Encryption', '802.1X Port Authentication', 'Layer 3 Routing', 'Redundant Power Supply', 'SNMP v3 Management'],
    specs: { Ports: '48x PoE+ + 4x SFP+', 'PoE Budget': '740W', Switching: '176 Gbps', 'MAC Table': '64K entries', 'Form Factor': '1U Rack', Warranty: 'Lifetime' },
    inStock: true,
    stock: 67,
  },
  {
    id: 5,
    name: 'GuardianX SIEM Platform',
    category: 'Monitoring',
    brand: 'GuardianX',
    price: 4799,
    rating: 4.9,
    reviews: 145,
    badge: 'Enterprise',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=450&fit=crop&auto=format',
    tag: 'Real-time',
    description: 'Enterprise SIEM platform with ML-powered anomaly detection, automated incident response, and compliance reporting for SOC teams.',
    features: ['ML Anomaly Detection', 'Automated SOAR Playbooks', 'MITRE ATT&CK Mapping', 'Compliance Reports (SOC2, PCI-DSS)', '1M Events/sec Ingestion', '360-Day Log Retention'],
    specs: { Ingestion: '1M events/sec', Retention: '360 days hot', Deployment: 'On-prem / Cloud', Integrations: '500+ connectors', Users: 'Unlimited', Warranty: 'Annual License' },
    inStock: true,
    stock: 23,
  },
  {
    id: 6,
    name: 'SecureNet EdgeRouter Pro',
    category: 'Networking',
    brand: 'SecureNet',
    price: 1699,
    rating: 4.5,
    reviews: 263,
    badge: undefined,
    img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=450&fit=crop&auto=format',
    tag: 'SD-WAN Ready',
    description: 'Software-defined WAN router with built-in security stack, multi-ISP failover, and centralized cloud orchestration.',
    features: ['SD-WAN Orchestration', 'Multi-ISP Failover', 'Built-in IPS/IDS', 'Zero Trust Network Access', 'Cloud Management Portal', 'QoS Traffic Shaping'],
    specs: { Throughput: '10 Gbps', WAN: '4x Multi-ISP', VPN: '2,000 tunnels', CPU: '8-Core ARM', Memory: '16GB RAM', Warranty: '3 Years' },
    inStock: true,
    stock: 5,
  },
  {
    id: 7,
    name: 'VaultTech Smart Doorbell 360',
    category: 'Cameras',
    brand: 'VaultTech',
    price: 349,
    originalPrice: 449,
    rating: 4.4,
    reviews: 891,
    badge: 'Sale',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop&auto=format',
    tag: '2-Way Audio',
    description: 'Smart video doorbell with 360° panoramic view, AI visitor recognition, package detection, and encrypted cloud storage.',
    features: ['360° Panoramic Lens', 'AI Visitor Recognition', 'Package Detection', '2-Way Noise-Cancelling Audio', 'Encrypted Cloud Storage', 'Smart Home Integration'],
    specs: { Resolution: '2K HDR', FOV: '360° Panoramic', Audio: '2-Way HD', Storage: 'Cloud 30 days', Power: 'Wired / Battery', Warranty: '2 Years' },
    inStock: true,
    stock: 311,
  },
  {
    id: 8,
    name: 'ArmorCore Server Rack Lock',
    category: 'Access Control',
    brand: 'ArmorCore',
    price: 599,
    rating: 4.7,
    reviews: 156,
    badge: undefined,
    img: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&h=450&fit=crop&auto=format',
    tag: 'Tamper Proof',
    description: 'High-security rack cabinet lock with NFC authentication, tamper alarm, and full audit log for data center compliance.',
    features: ['NFC Card + PIN Authentication', 'Tamper Alert System', 'Full Audit Log', 'Fits Standard 19" Racks', 'Battery Backup 72h', 'Remote Management'],
    specs: { Auth: 'NFC + PIN', Compatibility: 'Universal 19" Rack', Log: '10,000 events', Alarm: '120dB Siren', Battery: '72h Backup', Warranty: '3 Years' },
    inStock: true,
    stock: 44,
  },
]

export const CATEGORIES = ['All', 'Firewalls', 'Cameras', 'Access Control', 'Networking', 'Monitoring']
export const BRANDS = ['SecureNet', 'VaultTech', 'ArmorCore', 'CipherShield', 'GuardianX']
