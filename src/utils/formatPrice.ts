export function formatPrice(amount: number | string) {
  const currency = (window as any).appSettings?.currency || 'Rs'
  return `${currency} ${amount}`
}
