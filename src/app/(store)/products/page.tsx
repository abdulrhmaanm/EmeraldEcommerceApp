import React from "react";
import { IProduct } from "@/app/interfaces/ProductsInterface";
import { getProducts } from "@/app/apis/ProductsApi";
import Link from "next/link";
import AddToCartBtn from "./AddToCartBtn";
import AddToWishListBtn from "@/app/whishlist/AddToWishListBtn";
import Image from "next/image";
import { Star, Package } from "lucide-react";

export default async function ProductsPage() {
  const { data: products }: { data: IProduct[] } = await getProducts(999);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-emerald-900 text-white">
        <div className="container mx-auto px-4 py-12 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">Browse</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold">Our Products</h1>
            <p className="text-emerald-100/60 mt-1 text-sm">{products.length} products available</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <Link href={`/products/${product._id}`}>
                <div className="relative h-52 bg-gray-50 overflow-hidden">
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.priceAfterDiscount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      SALE
                    </span>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Category */}
                {(product.category as unknown as { name?: string })?.name && (
                  <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1">
                    {(product.category as unknown as { name?: string }).name}
                  </p>
                )}

                {/* Title */}
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm hover:text-emerald-600 transition mb-2">
                    {product.title}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.ratingsAverage || 0) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">({product.ratingsQuantity})</span>
                </div>

                {/* Price + Actions */}
                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-gray-900">
                      {product.priceAfterDiscount ?? product.price} EGP
                    </span>
                    {product.priceAfterDiscount && (
                      <span className="text-xs text-gray-400 line-through">{product.price}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AddToCartBtn productId={product._id} variant="responsive" />
                    <AddToWishListBtn productId={product._id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
