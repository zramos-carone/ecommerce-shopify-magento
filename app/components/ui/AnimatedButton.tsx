'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Link from 'next/link';

interface AnimatedButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glass';
}

export default function AnimatedButton({ 
  children, 
  href, 
  onClick, 
  className = '', 
  variant = 'primary' 
}: AnimatedButtonProps) {
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200',
    secondary: 'bg-gray-900 text-white hover:bg-black shadow-gray-200',
    glass: 'bg-white/20 backdrop-blur-md text-gray-900 border border-white/30 hover:bg-white/30 shadow-none'
  };

  const baseStyles = 'inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold rounded-xl transition-all shadow-lg';

  const content = (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return content;
}
