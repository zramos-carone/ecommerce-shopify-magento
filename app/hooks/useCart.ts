'use client'

import { useState, useEffect } from 'react'
import type { MayoristaProduct } from '@/lib/types/mayorista'

export interface CartItem {
  product: MayoristaProduct
  quantity: number
}

const CART_STORAGE_KEY = 'ecommerce-cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    }
    setIsLoaded(true)
  }, [])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('Failed to save cart:', error)
      }
    }
  }, [items, isLoaded])

  const addToCart = (product: MayoristaProduct, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevItems, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  return {
    items,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
  }
}
