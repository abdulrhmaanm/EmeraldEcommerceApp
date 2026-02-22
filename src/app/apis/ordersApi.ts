import { getUserId, getUserToken } from "@/lib/serverUtilis";


export async function createCashOrder(
  cartId: string,
  shippingAddress: { details: string; phone: string; city: string }
) {
  try {
    const token = await getUserToken();

    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token as string,
        },
        body: JSON.stringify({ shippingAddress }),
      }
    );

    const data = await res.json();
    return {
      success: res.ok,
      message: data.message || (res.ok ? "Cash order placed" : "Failed to place order"),
      data,
    };
  } catch (error) {
    console.error(" Cash order error:", error);
    return { success: false, message: "Unexpected error", data: null };
  }
}


export async function createBankOrder(
  cartId: string,
  shippingAddress: { details: string; phone: string; city: string },
  redirectUrl: string
) {
  try {
    const token = await getUserToken();

    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${redirectUrl}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token as string,
        },
        body: JSON.stringify({ shippingAddress }),
      }
    );

    const data = await res.json();
    return {
      success: res.ok,
      message: data.message || (res.ok ? "Bank checkout session created" : "Failed to create session"),
      data,
    };
  } catch (error) {
    console.error(" order error:", error);
    return { success: false, message: "Unexpected error", data: null };
  }
}


export async function getUserOrders() {
  try {
    const userId = await getUserId();
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`, {
      method: "GET",
      headers: {
        
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("Cart API raw data:", data);
    if(res.ok){
      return{
        data:data,
        success:true,
        message:data.message || "Orders fetched successfully"
      }
    }
    if (!res.ok){
        return{
        data:data,
        success:false,
        message:data.message || "Failed to fetch orders"
      }
    }
  } catch (error) {
    console.error("Error fetching : ", error);
  }
}