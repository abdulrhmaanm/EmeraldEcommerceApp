import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/app/apis/categoriesApi";
import { ICategory } from "@/app/interfaces/categoryInterface";
import { ArrowRight, Tag } from "lucide-react";

export default async function CategoriesPage() {
  const { data: categories }: { data: ICategory[] } = await getCategories();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-emerald-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-700 px-4 py-1.5 rounded-full text-emerald-200 text-sm font-semibold mb-4">
            <Tag className="w-4 h-4" /> Shop by Category
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">All Categories</h1>
          <p className="text-emerald-100/70 text-lg max-w-md mx-auto">
            Browse our curated selection of categories to find exactly what you need.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-52 bg-gray-50 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-white font-bold text-lg leading-tight">{category.name}</h2>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-emerald-600">Explore</span>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}