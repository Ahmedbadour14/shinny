import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '../types'

interface CartState {
  items: CartItem[]
  promoCode: string | null
  discount: number
  addItem: (product: Product, quantity: number, color: string, size: string) => void
  removeItem: (productId: number) => void
  updateQty: (productId: number, quantity: number) => void
  clearCart: () => void
  applyPromo: (code: string, discount: number) => void
  removePromo: () => void
  getTotal: () => number
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,
      addItem: (product, quantity, selectedColor, selectedSize) => {
        set(state => {
          const existing = state.items.find(
            i => i.product.id === product.id && i.selectedColor === selectedColor && i.selectedSize === selectedSize
          )
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id && i.selectedColor === selectedColor && i.selectedSize === selectedSize
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, { product, quantity, selectedColor, selectedSize }] }
        })
      },
      removeItem: id => set(state => ({ items: state.items.filter(i => i.product.id !== id) })),
      updateQty: (id, quantity) => {
        if (quantity < 1) { get().removeItem(id); return }
        set(state => ({ items: state.items.map(i => i.product.id === id ? { ...i, quantity } : i) }))
      },
      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),
      applyPromo: (code, discount) => set({ promoCode: code, discount }),
      removePromo: () => set({ promoCode: null, discount: 0 }),
      getSubtotal: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      getTotal: () => {
        const sub = get().getSubtotal()
        return sub - (sub * get().discount) / 100
      },
      getItemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'shinny-cart' }
  )
)
