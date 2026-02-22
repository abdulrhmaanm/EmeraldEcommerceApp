"use server"

import { getUserToken } from "@/lib/serverUtilis";

export async function getUserCart() {
  try {
    const token = await getUserToken();
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
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


export async function removeUserCart() {
  try {
    const token = await getUserToken();
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      method: "DELETE",
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

export async function addToCart(productId: string) {
  try {
    const token = await getUserToken();
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token as string,
      },
      body: JSON.stringify({productId})
    });

    const data = await res.json();
    console.log("Cart API raw data:", data);

    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}
export async function removeFromCart(productId: string) {
  try {
    const token = await getUserToken();
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
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

export async function UpdateQtyCart(productId: string , count : number) {
  try {
    const token = await getUserToken();
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
      method: "PUT",
      headers: {
        
        "Content-Type": "application/json",
        token: token as string,
      },
      body: JSON.stringify({count})
    });

    const data = await res.json();
    console.log("Cart API raw data:", data);
    if(res.ok){
      return{
        data:data,
        success:true,
        message:data.message || "Quantity updated successfully"
      }
    }
    if (!res.ok){
        return{
        data:data,
        success:false,
        message:data.message || "Failed to update quantity"
      }
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}