'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { MayoristaProduct } from '@/lib/types/mayorista'

export interface CartItem extends MayoristaProduct {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: MayoristaProduct, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('[CART_SYSTEM] Initializing Cart Context...')
    const savedCart = localStorage.getItem('maxtech-cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        console.log('[CART_SYSTEM] Loaded items from LocalStorage:', parsed.length)
        setItems(parsed)
      } catch (e) {
        console.error('[CART_SYSTEM] Failed to load cart from localStorage', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isLoaded) {
      console.log('[CART_SYSTEM] Saving state to LocalStorage. Total Items:', items.length)
      localStorage.setItem('maxtech-cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (product: MayoristaProduct, quantity = 1) => {
    console.log('[CART_ACTION] Attempting to add product:', product.name, '| ID:', product.id)
    
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      let newItems: CartItem[]

      if (existingItem) {
        console.log('[CART_ACTION] Product already in cart. Incrementing quantity.')
        newItems = prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        console.log('[CART_ACTION] New product added to cart.')
        newItems = [...prevItems, { ...product, quantity }]
      }
      
      console.log('[CART_SYSTEM] Computed new state. Items count:', newItems.length)
      return newItems
    })
  }

  const removeItem = (productId: string) => {
    console.log('[CART_ACTION] Removing product ID:', productId)
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    console.log('[CART_ACTION] Updating quantity for ID:', productId, '| New Quantity:', quantity)
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    console.log('[CART_ACTION] Clearing all items in cart.')
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}
