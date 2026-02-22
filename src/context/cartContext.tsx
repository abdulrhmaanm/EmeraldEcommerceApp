'use client';

import { ICartResponse } from '@/app/interfaces/cartInterface';
import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';

interface ICartContext {
  cartDetails: ICartResponse | null;
  refreshCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  setCartDetails: React.Dispatch<React.SetStateAction<ICartResponse | null>>;
}

const CartContext = createContext<ICartContext | null>(null);

export function CartContextProvider({ children }: { children: React.ReactNode }) {
  const [cartDetails, setCartDetails] = useState<ICartResponse | null>(null);

  async function fetchCart() {
    try {
      const { getUserCart } = await import('@/app/apis/cartApi');
      const data = await getUserCart();
      if (data) setCartDetails(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }

  async function refreshCart() {
    try {
      const { getUserCart } = await import('@/app/apis/cartApi');
      const res = await getUserCart();
      setCartDetails(res ?? null);
    } catch (err) {
      console.error('Failed to refresh cart:', err);
      setCartDetails(null);
    }
  }

  useEffect(() => {
    // Small delay after hydration to avoid server-action-during-render crash
    const timer = setTimeout(() => { fetchCart(); }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CartContext.Provider value={{ cartDetails, setCartDetails, fetchCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartContextProvider');
  return context;
}