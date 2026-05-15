export function formatPrice(price: number, lang = 'en'): string {
  if (lang === 'ar') return `${price.toLocaleString('ar-EG')} ج.م`
  return `EGP ${price.toLocaleString('en-EG')}`
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 3) + '...' : str
}

export function generateOrderRef(): string {
  return 'SHN-' + Date.now().toString(36).toUpperCase()
}
