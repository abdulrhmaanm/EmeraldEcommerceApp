/**
 * Client-safe API helpers — calls go through our Next.js proxy (/api/proxy/...)
 * instead of directly to ecommerce.routemisr.com, eliminating CORS errors.
 *
 * All functions accept an explicit token string read from useSession().data.accessToken
 */

const PROXY = '/api/proxy';

// ─── CART ────────────────────────────────────────────────────────────────────

export async function clientAddToCart(productId: string, token: string) {
    const res = await fetch(`${PROXY}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ productId }),
    });
    return res.json();
}

export async function clientRemoveFromCart(productId: string, token: string) {
    const res = await fetch(`${PROXY}/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', token },
    });
    const data = await res.json();
    return res.ok
        ? { data, success: true, message: data.message }
        : { data, success: false, message: data.message };
}

export async function clientUpdateQtyCart(productId: string, count: number, token: string) {
    const res = await fetch(`${PROXY}/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ count }),
    });
    const data = await res.json();
    return res.ok
        ? { data, success: true, message: data.message }
        : { data, success: false, message: data.message };
}

export async function clientRemoveUserCart(token: string) {
    const res = await fetch(`${PROXY}/cart`, {
        method: 'DELETE',
        headers: { token },
    });
    return res.json();
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────

export async function clientGetWishList(token: string) {
    const res = await fetch(`${PROXY}/wishlist`, { headers: { token } });
    if (!res.ok) return null;
    return res.json();
}

export async function clientAddToWishList(productId: string, token: string) {
    const res = await fetch(`${PROXY}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    return res.ok
        ? { data, success: true, message: 'Added to wishlist' }
        : { success: false, message: data.message };
}

export async function clientRemoveFromWishList(productId: string, token: string) {
    const res = await fetch(`${PROXY}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', token },
    });
    const data = await res.json();
    return res.ok
        ? { data, success: true, message: data.message }
        : { data, success: false, message: data.message };
}
