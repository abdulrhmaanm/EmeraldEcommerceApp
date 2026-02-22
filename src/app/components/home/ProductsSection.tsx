import React from "react";
import { Heart, Eye } from "lucide-react";
import SectionTitle from "../shared/SectionTitle";
import { IProduct } from "@/app/interfaces/ProductsInterface";
import { getProducts } from "@/app/apis/ProductsApi";
import  Link  from 'next/link';
import AddToCartBtn from "@/app/(store)/products/AddToCartBtn";
import Image from "next/image";


export default async function ProductsSection() {
  const { data: products }: { data: IProduct[] } = await getProducts(8);

  return (
    <div>

      <div>
        <SectionTitle title="Our Products" subtitle="Explore Our Products" />
      </div>
      


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
  {products.map((product) => (
    <div
      key={product._id}
      className="group relative rounded-lg bg-white shadow-md overflow-hidden flex flex-col w-full"
    >

      <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition">
        <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
      </div>


<Link href={`/products/${product._id}`}>
      <div className="relative flex justify-center items-center h-[200px]">
        <Image
        width={250}
        height={270}
          src={product.imageCover}
          alt={product.title}
          className="h-full object-contain"
        />





      </div>
</Link>
      <div className="relative flex justify-center items-center h-[50px]">
            <AddToCartBtn productId={product._id} className="absolute bottom-0 left-0 w-full bg-black text-white py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition"/>
    
      </div>


      <div className="p-4 flex flex-col">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
          {product.title}
        </h3>


        <div className="flex items-center gap-2 mt-2">
          <span className="text-red-500 font-semibold">
            {product.priceAfterDiscount ?? product.price} EGP
          </span>
          {product.priceAfterDiscount && (
            <span className="text-gray-400 line-through text-sm">
              {product.price} EGP 
            </span>
          )}
        </div>

        <div className="flex items-center mt-2 text-yellow-500">
          {"★".repeat(Math.round(product.ratingsAverage || 0))}
          {"☆".repeat(5 - Math.round(product.ratingsAverage || 0))}
          <span className="ml-2 text-gray-500 text-sm">
            ({product.ratingsQuantity})
          </span>
        </div>
      </div>
    </div>
  ))}
</div>

<div>
<button 
  type="button" 
  className="w-full max-w-xs mx-auto block bg-red-500 text-white font-semibold py-3 mt-10 rounded-md hover:bg-red-700 transition">
  <Link href="/products" className="w-full">View All Products</Link>
</button>

</div>


    </div>
  );
}
