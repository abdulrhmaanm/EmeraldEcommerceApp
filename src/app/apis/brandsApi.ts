export async function getBrands(limit: number = 999) {
    try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands?limit=${limit}`);
        if (!res.ok) {
            throw new Error(res.statusText||"Failed to fetch brands");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        return {error: error as string};
    }
}
export async function getBrandsDetails(id :string) {
    try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${id}`);
        if (!res.ok) {
            throw new Error(res.statusText||"Failed to fetch brands");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        return {error: error as string};
    }
}