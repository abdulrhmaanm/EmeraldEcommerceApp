'use client';

import { clientAddToCart } from '@/app/apis/clientApi';
import { useCart } from '@/context/cartContext';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

interface AddToCartBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  productId: string;
  variant?: 'default' | 'icon' | 'responsive';
}

export default function AddToCartBtn({
  productId,
  variant = 'default',
  className = '',
  ...props
}: AddToCartBtnProps) {
  const { refreshCart } = useCart();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    if (loading) return;
    if (status !== 'authenticated') {
      toast.error('Please log in to add items to cart', { position: 'top-center' });
      return;
    }

const token = (session as unknown as Session)?.accessToken;
    if (!token) {
      toast.error('Session expired, please log in again', { position: 'top-center' });
      return;
    }

    setLoading(true);
    try {
      const res = await clientAddToCart(productId, token);
      // API returns status:'success', not message:'success'
      if (res?.status === 'success') {
        toast.success(res.message || 'Added to Cart! 🛒', {
          position: 'top-center',
          style: { background: '#059669', color: '#fff', border: 'none', borderRadius: '12px' },
          icon: '🛒',
        });
        // refreshCart fetches fully-populated cart data (imageCover etc.)
        await refreshCart();
      } else {
        toast.error(res?.message || 'Failed to add to cart', { position: 'top-center' });
      }
    } catch (e) {
      console.error('Add to cart error:', e);
      toast.error('Something went wrong', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }

  // Icon-only variant (small square button)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition disabled:opacity-60 touch-manipulation ${className}`}
        aria-label="Add to Cart"
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
      </button>
    );
  }

  // Responsive: icon on mobile, icon+text on sm+
  if (variant === 'responsive') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl transition disabled:opacity-60 touch-manipulation
          w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 sm:text-sm ${className}`}
        aria-label="Add to Cart"
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4 flex-shrink-0" />}
        <span className="hidden sm:inline">{loading ? 'Adding…' : 'Add to Cart'}</span>
      </button>
    );
  }

  // Default: full button with text always visible
  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition disabled:opacity-60 touch-manipulation ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
      {loading ? 'Adding…' : 'Add to Cart'}
    </button>
  );
}
