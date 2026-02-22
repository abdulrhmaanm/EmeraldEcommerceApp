import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl">
                E
              </span>
              <span className="text-xl font-extrabold text-white">Emerald</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Curated style for modern life. Premium products, unmatched quality, delivered to your door.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-emerald-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Shop</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "All Products", path: "/products" },
                { label: "Categories", path: "/categories" },
                { label: "Brands", path: "/brands" },
                { label: "New Arrivals", path: "/products" },
                { label: "Sale", path: "/products" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link href={path} className="hover:text-emerald-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Account</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "My Profile", path: "/profile" },
                { label: "My Orders", path: "/allorders" },
                { label: "My Wishlist", path: "/whishlist" },
                { label: "Shopping Cart", path: "/cart" },
                { label: "Sign In", path: "/login" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link href={path} className="hover:text-emerald-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">Get exclusive deals and new arrivals delivered to your inbox.</p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition flex-shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Emerald. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
