'use client'

import { useCartContext } from '@/context/CartContext'
import { MayoristaProduct } from '@/lib/types/mayorista'

export function useCart() {
  const { 
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    totalPrice 
  } = useCartContext()

  return {
    cart: items,
    addToCart: (product: MayoristaProduct, quantity?: number) => addItem(product, quantity),
    removeFromCart: (productId: string) => removeItem(productId),
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  }
}
