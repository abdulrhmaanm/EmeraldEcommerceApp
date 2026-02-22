'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cartContext';
import { clientRemoveFromCart, clientRemoveUserCart, clientUpdateQtyCart } from '@/app/apis/clientApi';
import Loading from '@/app/loading';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

const EMERALD_TOAST = { style: { background: '#059669', color: '#fff', border: 'none', borderRadius: '12px' } };
const ERROR_TOAST = { style: { background: '#dc2626', color: '#fff', border: 'none', borderRadius: '12px' } };

export default function CartPage() {
  const { cartDetails, refreshCart } = useCart();
  const { data: session } = useSession();
  const getToken = () => (session as Session)?.accessToken;

  /* ── Loading state ── */
  if (cartDetails === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  /* ── Helpers ── */
  async function removeCart() {
    const token = getToken();
    if (!token) return;
    const res = await clientRemoveUserCart(token);
    if (res?.message === 'success' || res?.status === 'success') {
      toast.success('Cart emptied', { position: 'top-center', ...EMERALD_TOAST });
      await refreshCart();
    } else {
      toast.error(res?.message || 'Failed to empty cart', { position: 'top-center', ...ERROR_TOAST });
    }
  }

  async function removeItem(productId: string) {
    const token = getToken();
    if (!token) return;
    const res = await clientRemoveFromCart(productId, token);
    if (res?.success) {
      toast.success('Item removed', { position: 'top-center', ...EMERALD_TOAST });
      // Refresh to get fully-populated cart (res.data lacks imageCover)
      await refreshCart();
    } else {
      toast.error(res?.message || 'Failed to remove item', { position: 'top-center', ...ERROR_TOAST });
    }
  }

  async function updateQty(productId: string, count: number) {
    if (count < 1) return;
    const token = getToken();
    if (!token) return;
    const res = await clientUpdateQtyCart(productId, count, token);
    if (res?.success) {
      // Refresh to get populated cart data
      await refreshCart();
    } else {
      toast.error(res?.message || 'Failed to update quantity', { position: 'top-center', ...ERROR_TOAST });
    }
  }

  /* ── Data ── */
  const products = cartDetails?.data?.products ?? [];
  const totalCartPrice = cartDetails?.data?.totalCartPrice ?? 0;
  const tax = totalCartPrice * 0.08;
  const finalTotal = totalCartPrice + tax;

  /* ── Empty cart ── */
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <ShoppingCart className="w-20 h-20 text-emerald-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-1">Your cart is empty</p>
          <p className="text-gray-500">Browse our products and add something you like!</p>
        </div>
        <Link href="/products" className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── Cart Items ── */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <div className="flex justify-between items-center border-b pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">{products.length} item{products.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="divide-y divide-gray-50">
            {products.map((item: { _id: string; count: number; price: number; product?: { imageCover?: string; images?: string[]; title?: string; _id?: string; id?: string } }) => {
              const imageSrc: string = item.product?.imageCover || item.product?.images?.[0] || '';
              const title: string = item.product?.title || 'Product';
              const productId: string = item.product?._id || item.product?.id || '';

              return (
                <div key={item._id} className="flex gap-5 py-6 hover:bg-emerald-50/20 transition px-2 rounded-2xl">
                  {/* Image — only render if we have a valid src */}
                  <div className="w-28 h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-100">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        sizes="112px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm lg:text-base">{title}</h3>
                        <p className="text-xs text-gray-400 mt-1 font-medium">Unit: {item.price?.toFixed(2)} EGP</p>
                      </div>
                      <p className="font-bold text-emerald-600 whitespace-nowrap text-base">
                        {(item.price * item.count)?.toFixed(2)} EGP
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Qty picker */}
                      <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                        <button
                          onClick={() => updateQty(productId, item.count - 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-9 text-center font-bold text-gray-900 text-sm">{item.count}</span>
                        <button
                          onClick={() => updateQty(productId, item.count + 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(productId)}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 size={15} />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t flex justify-between items-center">
            <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              ← Continue Shopping
            </Link>
            <button onClick={removeCart} className="text-sm text-red-400 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition font-medium">
              Empty Cart
            </button>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-gray-50 rounded-3xl p-8 sticky top-24 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal ({cartDetails?.numOfCartItems ?? products.length} items)</span>
                <span className="font-semibold text-gray-900">{totalCartPrice.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-gray-900">{tax.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-emerald-600">{finalTotal.toFixed(2)} EGP</span>
            </div>

            <div className="mb-4 flex gap-2">
              <input type="text" placeholder="Promo Code" className="flex-1 border-2 border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition" />
              <button className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition">Apply</button>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-13 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 text-base">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
