'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, Heart, Minus, Plus, Truck, RotateCcw, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { clientAddToCart, clientAddToWishList, clientRemoveFromWishList, clientGetWishList } from '@/app/apis/clientApi';
import { useCart } from '@/context/cartContext';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    priceAfterDiscount?: number;
    imageCover: string;
    images: string[];
    ratingsAverage: number;
    ratingsQuantity: number;
    category: { name: string };
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const COLORS = [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#f5f5f5' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Navy', hex: '#1e3a5f' },
];

export default function ProductDetailsClient({ product }: { product: Product }) {
    const [selectedImage, setSelectedImage] = useState(product.imageCover);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Black');
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const { data: session, status } = useSession();
    const { refreshCart } = useCart();

    const getToken = useCallback(
        () => (session as Session)?.accessToken,
        [session]
    );

    // Check if already wishlisted
    useEffect(() => {
        if (status !== 'authenticated') return;
        const token = getToken();
        if (!token) return;
        (async () => {
            try {
                const res = await clientGetWishList(token);
                if (res?.data?.some((item: { _id?: string }) => item._id === product._id)) {
                    setWishlisted(true);
                }
            } catch { /* ignore */ }
        })();
    }, [status, product._id, getToken]);

    const handleAddToCart = async () => {
        if (isAdding) return;
        if (status !== 'authenticated') {
            toast.error('Please log in to add items to cart', { position: 'top-center' });
            return;
        }
        const token = getToken();
        if (!token) {
            toast.error('Session expired, please log in again', { position: 'top-center' });
            return;
        }

        setIsAdding(true);
        try {
            const res = await clientAddToCart(product._id, token);
            console.log('Add to cart response:', res);
            // API returns status:'success', not message:'success'
            if (res?.status === 'success') {
                toast.success(res.message || 'Added to Cart! 🛒', {
                    position: 'top-center',
                    style: { background: '#059669', color: '#fff', border: 'none', borderRadius: '12px' },
                    icon: '🛒',
                });
                // refreshCart fetches fully-populated product data
                await refreshCart();
            } else {
                toast.error(res?.message || 'Failed to add to cart', { position: 'top-center' });
            }
        } catch (e) {
            console.error(e);
            toast.error('Something went wrong', { position: 'top-center' });
        } finally {
            setIsAdding(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (wishlistLoading) return;
        if (status !== 'authenticated') {
            toast.error('Please log in to use your wishlist', { position: 'top-center' });
            return;
        }
        const token = getToken();
        if (!token) return;

        setWishlistLoading(true);
        try {
            if (wishlisted) {
                const res = await clientRemoveFromWishList(product._id, token);
                if (res?.success) { setWishlisted(false); toast.success('Removed from Wishlist'); }
                else toast.error(res?.message || 'Failed');
            } else {
                const res = await clientAddToWishList(product._id, token);
                if (res?.success) { setWishlisted(true); toast.success('Added to Wishlist ❤️'); }
                else toast.error(res?.message || 'Failed');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setWishlistLoading(false); }
    };

    const displayPrice = product.priceAfterDiscount ?? product.price;
    const allImages = [product.imageCover, ...(product.images?.filter(i => i !== product.imageCover) ?? [])];

    return (
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 bg-white rounded-3xl p-6 lg:p-12 shadow-sm border border-gray-100">
            {/* ── Left: Image Gallery ─────────────────────────────────────────── */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                {/* Main image */}
                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    <Image
                        src={selectedImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-contain p-6"
                        priority
                    />
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-1">
                        {allImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${selectedImage === img
                                    ? 'border-emerald-500 shadow-md shadow-emerald-100'
                                    : 'border-gray-100 hover:border-gray-300'
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`View ${idx + 1}`}
                                    fill
                                    sizes="80px"
                                    className="object-contain p-2"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Right: Details ──────────────────────────────────────────────── */}
            <div className="w-full lg:w-1/2 flex flex-col">
                {/* Category */}
                <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-3">
                    {product.category?.name}
                </p>

                {/* Title */}
                <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {product.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < Math.floor(product.ratingsAverage ?? 0)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-200 fill-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-500">
                        {product.ratingsAverage?.toFixed(1)} ({product.ratingsQuantity} reviews)
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-8">
                    <p className="text-4xl font-black text-gray-900">{displayPrice} EGP</p>
                    {product.priceAfterDiscount && (
                        <p className="text-xl text-gray-400 line-through">{product.price} EGP</p>
                    )}
                </div>

                {/* Color selection */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                        Colour: <span className="font-normal normal-case text-gray-600">{selectedColor}</span>
                    </h3>
                    <div className="flex gap-3">
                        {COLORS.map(color => (
                            <button
                                key={color.name}
                                onClick={() => setSelectedColor(color.name)}
                                title={color.name}
                                className={`w-10 h-10 rounded-full border-2 transition shadow-sm ${selectedColor === color.name
                                    ? 'border-emerald-500 ring-2 ring-emerald-400 ring-offset-2 scale-110'
                                    : 'border-gray-200 hover:scale-105'
                                    }`}
                                style={{ backgroundColor: color.hex }}
                            />
                        ))}
                    </div>
                </div>

                {/* Size selection */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                        Size: <span className="font-normal normal-case text-gray-600">{selectedSize}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {SIZES.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-[48px] h-11 px-3 rounded-xl font-semibold text-sm transition-all ${selectedSize === size
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Qty + Add to Cart + Wishlist */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-11 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-11 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-70"
                    >
                        {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                        {isAdding ? 'Adding…' : 'Add to Cart'}
                    </button>

                    <button
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition ${wishlisted
                            ? 'border-red-400 bg-red-50 text-red-500'
                            : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50'
                            }`}
                        aria-label="Add to wishlist"
                    >
                        {wishlistLoading
                            ? <Loader2 className="w-5 h-5 animate-spin" />
                            : <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                        }
                    </button>
                </div>

                {/* Description */}
                {product.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 border-t pt-6">
                        {product.description}
                    </p>
                )}

                {/* Delivery info */}
                <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4 px-5 py-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Truck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">Free Delivery</p>
                            <p className="text-xs text-gray-500">Enter your postal code for delivery availability</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-5 py-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <RotateCcw className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">Free 30-Day Returns</p>
                            <p className="text-xs text-gray-500">Hassle-free returns on all orders</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
