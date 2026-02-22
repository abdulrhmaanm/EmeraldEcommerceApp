import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import AddToCartBtn from '../(store)/products/AddToCartBtn';
import AddToWishlistBtn from './AddToWishListBtn';
import { getUserWishList } from '../apis/wishlistApi';
import { IProduct } from '../interfaces/ProductsInterface';

export default async function WishListPage() {
  const res = await getUserWishList();
  const products: IProduct[] = res?.data || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-12">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">My Wishlist</h1>
            <p className="text-emerald-100/70">{products.length} saved item{products.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love and come back to them anytime.</p>
            <Link
              href="/products"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <Link href={`/products/${product._id}`}>
                  <div className="relative h-52 bg-gray-50 overflow-hidden">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-emerald-600 transition text-sm">
                      {product.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-gray-600">{product.ratingsAverage}</span>
                    <span className="text-xs text-gray-400">({product.ratingsQuantity})</span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        {product.priceAfterDiscount ?? product.price} EGP
                      </span>
                      {product.priceAfterDiscount && (
                        <span className="text-sm text-gray-400 line-through">{product.price} EGP</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <AddToCartBtn
                        productId={product._id}
                        className="flex-1"
                      />
                      <AddToWishlistBtn productId={product._id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
