'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const { totalItems } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
          : 'bg-white py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-blue-600 font-outfit uppercase group-hover:scale-105 transition-transform">
                MAX<span className="text-gray-900">TECH</span>
              </span>
            </Link>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <Link href="/catalog" className="hover:text-blue-600 transition-colors">Catálogo</Link>
            <Link href="/catalog?category=Laptop" className="hover:text-blue-600 transition-colors">Laptops</Link>
            <Link href="/catalog?category=GPU" className="hover:text-blue-600 transition-colors">Gaming</Link>
            <Link href="/api-docs" className="hover:text-blue-600 transition-colors">API</Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-5">
            <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            
            <Link href="/cart" className="p-2 text-gray-400 hover:text-gray-900 transition-all relative group">
              <motion.div
                key={totalItems}
                initial={{ scale: 1 }}
                animate={{ scale: totalItems > 0 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </motion.div>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-[8px] font-black text-white flex items-center justify-center rounded-full border-2 border-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            <Link href="/admin" className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu (AnimatePresence) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-4 text-sm font-bold uppercase tracking-widest text-gray-600">
              <Link href="/catalog" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Productos</Link>
              <Link href="/catalog?category=Laptop" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Laptops</Link>
              <Link href="/catalog?category=GPU" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Gaming</Link>
              <Link href="/api-docs" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>API Docs</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
