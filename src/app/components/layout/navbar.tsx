'use client';

import { Heart, MenuIcon, Package, ShoppingCart, User, X } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useCart } from '@/context/cartContext';
import { useWishlist } from '@/context/wishlistContext';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const links = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/categories', label: 'Categories' },
  { path: '/brands', label: 'Brands' },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const { cartDetails } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg">
              E
            </span>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">Emerald</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {status === 'loading' ? null : status === 'unauthenticated' ? (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-lg border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-700 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/whishlist" className="relative p-2 rounded-lg hover:bg-gray-100 transition" aria-label="Wishlist">
                  <Heart className="w-5 h-5 text-gray-600" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition" aria-label="Cart">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  {(cartDetails?.numOfCartItems || 0) > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartDetails?.numOfCartItems}
                    </span>
                  )}
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-emerald-700" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                        {session?.user?.name || 'Account'}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-6 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className="py-2 font-semibold text-gray-700 hover:text-emerald-700 transition"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-4 mt-2 flex flex-col gap-2">
              {status === 'unauthenticated' ? (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full text-center py-3 rounded-xl border-2 border-gray-200 font-bold hover:border-emerald-500 hover:text-emerald-700 transition">
                    Log In
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="w-full text-center py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {/* Authenticated mobile links */}
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 px-2 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition">
                    <User className="w-5 h-5" /> Profile
                  </Link>
                  <Link href="/whishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 px-2 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition">
                    <Heart className="w-5 h-5" />
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 px-2 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                    {(cartDetails?.numOfCartItems || 0) > 0 && (
                      <span className="ml-auto bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {cartDetails?.numOfCartItems}
                      </span>
                    )}
                  </Link>
                  <Link href="/allorders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 px-2 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition">
                    <Package className="w-5 h-5" /> My Orders
                  </Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-3 py-3 px-2 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition w-full text-left">
                    Sign Out
                  </button>
                </>
              )}
            </div>

          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
