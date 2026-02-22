import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/product/ProductDetailsClient';

async function getProduct(id: string) {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ ProductId: string }> }) {
  // Next.js params is a Promise in v15
  const { ProductId } = await params;
  const product = await getProduct(ProductId);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetailsClient product={product} />
    </div>
  );
}
