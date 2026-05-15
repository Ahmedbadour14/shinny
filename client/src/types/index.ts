export interface Product {
  id: number
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  price: number
  images: string[]
  category: string
  colors: string[]
  sizes: string[]
  stock: number
  featured: boolean
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor: string
  selectedSize: string
}

export interface Order {
  id: number
  orderNumber: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  paymentMethod: 'paymob' | 'fawry' | 'cod'
  paymentStatus: string
  status: string
  total: number
  items: CartItem[]
  promoCode?: string
  discount: number
  fawryRef?: string
  createdAt: string
}

export interface CheckoutForm {
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  paymentMethod: 'paymob' | 'fawry' | 'cod'
}
