import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';
import type { Metadata } from 'next';
import type { ICategory } from './interfaces/categoryInterface';
import type { IProduct } from './interfaces/ProductsInterface';

export const metadata: Metadata = {
  title: 'Emerald – Curated Style for Modern Life',
  description: 'Shop the finest collection of clothing, accessories, and everyday essentials.',
};

async function getCategories() {
  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/categories', {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

async function getProducts() {
  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/products?limit=8', {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-emerald-900 text-white">
        {/* Background overlay image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20 mix-blend-overlay"
          />
        </div>

        <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Copy */}
          <div className="w-full md:w-1/2">
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-800/60 border border-emerald-700 text-emerald-200 text-sm font-semibold tracking-wide mb-6">
              NEW COLLECTION
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Curated Style for{' '}
              <span className="text-emerald-400">Modern Life</span>
            </h1>
            <p className="text-emerald-100/80 text-lg lg:text-xl mb-10 max-w-lg leading-relaxed">
              Discover the finest collection of clothing, accessories, and everyday essentials designed for comfort and elegance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-white text-emerald-950 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> Shop Now
              </Link>
              <a
                href="#categories"
                className="bg-emerald-800/50 border border-emerald-700 text-emerald-100 px-8 py-4 rounded-xl font-bold hover:bg-emerald-800 transition"
              >
                Explore
              </a>
            </div>
          </div>

          {/* Hero card */}
          <div className="w-full md:w-1/2 flex justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/50 rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470"
                alt="The Emerald Collection"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-emerald-300 font-bold mb-1">Featured</p>
                <h3 className="text-2xl font-bold text-white">The Emerald Collection</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────────────────── */}
      <section id="categories" className="py-20 lg:py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-gray-500 text-lg">Find exactly what you&apos;re looking for</p>
          </div>
          <Link
            href="/categories"
            className="hidden md:flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition"
          >
            View All <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.slice(0, 6).map((category: ICategory) => (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="group block"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100 bg-white group-hover:shadow-md transition-shadow">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <h3 className="text-center font-bold text-gray-900 group-hover:text-emerald-600 transition-colors uppercase tracking-wide text-sm">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Trending Now
            </h2>
            <p className="text-gray-500 text-lg">
              Our most popular products, freshly updated for the new season.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: IProduct) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden w-full">
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-4 bottom-4 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="w-full bg-emerald-600/95 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg text-sm">
                      <ShoppingBag className="w-4 h-4" /> Quick View
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
                    {product.category?.name}
                  </p>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      {product.ratingsAverage}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">
                      ({product.ratingsQuantity})
                    </span>
                  </div>
                  <div className="mt-auto">
                    <p className="text-xl font-bold text-gray-900">
                      {product.price} EGP
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 px-10 py-4 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-all"
            >
              View All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
