'use client';

import { useState } from 'react';
import { clientAddToWishList, clientRemoveFromWishList } from '@/app/apis/clientApi';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useWishlist } from '@/context/wishlistContext';
import type { Session } from 'next-auth';

interface AddToWishlistBtnProps {
  productId: string;
}

export default function AddToWishlistBtn({ productId }: AddToWishlistBtnProps) {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const { wishlistIds, refreshWishlist } = useWishlist();

  // Derive initial state from context (no extra API call needed)
  const inWishlist = wishlistIds.includes(productId);

  async function handleToggle() {
    if (loading) return;
    if (status !== 'authenticated') {
      toast.error('Please log in to use your wishlist', { position: 'top-center' });
      return;
    }

    const token = (session as Session)?.accessToken;
    if (!token) {
      toast.error('Session expired, please log in again', { position: 'top-center' });
      return;
    }

    setLoading(true);
    try {
      if (inWishlist) {
        const res = await clientRemoveFromWishList(productId, token);
        if (res?.success) {
          await refreshWishlist();
          toast.success('Removed from Wishlist', { position: 'top-center' });
        } else {
          toast.error(res?.message || 'Failed to remove', { position: 'top-center' });
        }
      } else {
        const res = await clientAddToWishList(productId, token);
        if (res?.success) {
          await refreshWishlist();
          toast.success('Added to Wishlist ❤️', { position: 'top-center' });
        } else {
          toast.error(res?.message || 'Failed to add', { position: 'top-center' });
        }
      }
    } catch {
      toast.error('Something went wrong', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${inWishlist
        ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
        : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50'
        } disabled:opacity-50`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
      )}
    </button>
  );
}
