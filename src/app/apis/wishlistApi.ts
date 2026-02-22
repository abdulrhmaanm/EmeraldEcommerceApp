import { getUserToken } from "@/lib/serverUtilis";

export async function getUserWishList() {
  try {
    const token = await getUserToken();
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
      headers: {
        token: token as string,
      },
    });

    const data = await res.json();
    console.log("Cart API raw data:", data);

    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}

export async function addToWishList(productId: string) {
  try {
    const token = await getUserToken();
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token as string,
      },
      body: JSON.stringify({ productId }), // ✅ productId must be inside body
    });

    const data = await res.json();
    console.log("Wishlist API raw data:", data);

    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return { data, success: true, message: "Added to wishlist" };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return { success: false, message: "Failed to add to wishlist" };
  }
}



export async function removeFromWishList(productId: string) {
  try {
    const token = await getUserToken();
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        
        "Content-Type": "application/json",
        token: token as string,
      },
    });

    const data = await res.json();
    console.log("Cart API raw data:", data);
    if(res.ok){
      return{
        data:data,
        success:true,
        message:data.message
      }
    }
    if (!res.ok){
        return{
        data:data,
        success:false,
        message:data.message
      }
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}
