import { getBrandsDetails } from "@/app/apis/brandsApi";
import { IBrand } from "@/app/interfaces/BrandInterface";
import { getProducts } from "@/app/apis/ProductsApi";
import { IProduct } from "@/app/interfaces/ProductsInterface";
import Image from "next/image";
import Link from "next/link";
import AddToCartBtn from "../../products/AddToCartBtn";
import AddToWishListBtn from "@/app/whishlist/AddToWishListBtn";
import { Star } from "lucide-react";

export default async function BrandDetailsPage({
  params,
}: {
  params: Promise<{ brandId: string }>;
}) {
  const { brandId } = await params;
  const { data: brand }: { data: IBrand } = await getBrandsDetails(brandId);
  const { data: products }: { data: IProduct[] } = await getProducts(999);
  const filtered = products.filter((p: IProduct) => (p.brand as unknown as { _id?: string })?._id === brandId);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Brand Hero */}
      <div className="bg-emerald-900 text-white">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-emerald-700 flex-shrink-0 bg-white flex items-center justify-center p-4">
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              sizes="160px"
              className="object-contain p-4"
              priority
            />
          </div>
          <div>
            <p className="text-emerald-300 text-sm font-bold uppercase tracking-widest mb-2">Brand</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-3">{brand.name}</h1>
            <p className="text-emerald-100/70 text-lg">{filtered.length} products available</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400 text-lg">No products found for this brand.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product: IProduct) => (
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
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-600">{product.ratingsAverage}</span>
                    <span className="text-xs text-gray-400 ml-1">({product.ratingsQuantity})</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                      {product.priceAfterDiscount ?? product.price} EGP
                    </p>
                    <div className="flex gap-2 items-center">
                      <AddToCartBtn productId={product._id} />
                      <AddToWishListBtn productId={product._id} />
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
