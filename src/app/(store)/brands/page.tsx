import React from "react";
import Link from "next/link";
import { IBrand } from "@/app/interfaces/BrandInterface";
import { getBrands } from "@/app/apis/brandsApi";
import Image from "next/image";
import { Layers } from "lucide-react";

export default async function BrandsPage() {
  const { data: brands }: { data: IBrand[] } = await getBrands(999);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-emerald-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-700 px-4 py-1.5 rounded-full text-emerald-200 text-sm font-semibold mb-4">
            <Layers className="w-4 h-4" /> Our Brands
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">All Brands</h1>
          <p className="text-emerald-100/70 text-lg max-w-md mx-auto">
            Discover our collection of premium brands curated for quality and style.
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/brands/${brand._id}`}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-3"
            >
              <div className="relative w-full h-28">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-sm text-gray-700 text-center group-hover:text-emerald-600 transition-colors">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}