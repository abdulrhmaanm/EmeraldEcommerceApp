export async function getProducts(limit: number = 999) {
    try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products?limit=${limit}`);
        if (!res.ok) {
            throw new Error(res.statusText||"Failed to fetch products");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return {error: error as string};
    }
}
export async function getProductsDetails(id :string) {
    try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
        if (!res.ok) {
            throw new Error(res.statusText||"Failed to fetch products");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return {error: error as string};
    }
}