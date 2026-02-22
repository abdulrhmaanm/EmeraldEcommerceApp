'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import React from 'react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

interface IWishlistContext {
    wishlistCount: number;
    wishlistIds: string[];
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<IWishlistContext>({
    wishlistCount: 0,
    wishlistIds: [],
    refreshWishlist: async () => { },
});

export function WishlistContextProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);

    const getToken = useCallback(
        () => (session as Session)?.accessToken,
        [session]
    );

    const refreshWishlist = useCallback(async () => {
        const token = getToken();
        if (!token) { setWishlistIds([]); return; }
        try {
            const res = await fetch('/api/proxy/wishlist', { headers: { token } });
            if (!res.ok) { setWishlistIds([]); return; }
            const data = await res.json();
            const items: { _id?: string; id?: string }[] = data?.data ?? [];
            const ids = items.map((p) => p?._id ?? p?.id ?? '').filter(Boolean);
            setWishlistIds(ids);
        } catch {
            setWishlistIds([]);
        }
    }, [getToken]);

    useEffect(() => {
        if (status === 'authenticated') {
            refreshWishlist();
        } else if (status === 'unauthenticated') {
            setWishlistIds([]);
        }
    }, [status, refreshWishlist]);

    return (
        <WishlistContext.Provider value={{ wishlistCount: wishlistIds.length, wishlistIds, refreshWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
