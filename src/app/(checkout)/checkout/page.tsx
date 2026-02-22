"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MapPin, Phone, Building2, CreditCard, Banknote, ShoppingBag, CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cartContext";
import Loading from "@/app/loading";
import Image from "next/image";
import { createCashOrder, createBankOrder } from "@/app/apis/ordersApi";
import { useRouter } from "next/navigation";

// ── Validation schema ────────────────────────────────────────────────────────
const checkoutFormSchema = z.object({
  address: z.string().min(5, "Street address is required (min 5 characters)"),
  city: z.string().min(2, "City is required"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Phone must be 10–15 digits"),
});
type CheckoutFormPayload = z.infer<typeof checkoutFormSchema>;

// ── Component ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<"cod" | "bank">("cod");
  const { cartDetails, refreshCart } = useCart();
  const router = useRouter();

  const form = useForm<CheckoutFormPayload>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { address: "", city: "", phone: "" },
  });

  const { formState: { errors } } = form;

  if (!cartDetails) return <Loading />;

  const products = cartDetails.data?.products ?? [];
  const cartId = cartDetails.data?._id ?? '';

  if (!cartId || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag className="w-16 h-16 text-emerald-200" />
        <p className="text-2xl font-bold text-gray-900">Your cart is empty</p>
        <p className="text-gray-500">Add items before checking out.</p>
      </div>
    );
  }

  const subtotal = cartDetails.data?.totalCartPrice ?? 0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const onSubmit = async (values: CheckoutFormPayload) => {
    setLoading(true);
    try {
      const shippingAddress = { details: values.address, phone: values.phone, city: values.city };
      const EMERALD = { style: { background: "#059669", color: "#fff", border: "none", borderRadius: "12px" } };

      let res;
      if (payment === "cod") {
        res = await createCashOrder(cartId, shippingAddress);
      } else {
        res = await createBankOrder(cartId, shippingAddress, process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin);
      }

      if (res?.success) {
        toast.success(res.message || "Order placed! 🎉", { position: "top-center", ...EMERALD });
        // Clear the cart state immediately
        await refreshCart();
        if (payment === "bank" && res.data?.session?.url) {
          window.location.href = res.data.session.url;
        } else {
          router.push("/allorders");
        }
      } else {
        toast.error(res?.message || "Failed to place order", { position: "top-center" });
      }
    } catch {
      toast.error("Something went wrong. Please try again.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-emerald-900 text-white">
        <div className="container mx-auto px-4 py-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-0.5">Step 3 of 3</p>
            <h1 className="text-3xl font-extrabold">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

          {/* ── Left: Shipping + Payment form ── */}
          <div className="space-y-6">

            {/* Shipping Details Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-emerald-600 text-white text-sm font-bold rounded-full flex items-center justify-center">1</span>
                Shipping Details
              </h2>

              <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...form.register("address")}
                      placeholder="123 Main Street, Apt 4B"
                      className={`w-full pl-11 pr-4 py-3. h-12 border-2 rounded-xl text-sm focus:outline-none transition ${errors.address ? "border-red-300 focus:border-red-500 bg-red-50/50" : "border-gray-200 focus:border-emerald-500"}`}
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address.message}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Town / City *</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...form.register("city")}
                      placeholder="Cairo"
                      className={`w-full pl-11 pr-4 h-12 border-2 rounded-xl text-sm focus:outline-none transition ${errors.city ? "border-red-300 focus:border-red-500 bg-red-50/50" : "border-gray-200 focus:border-emerald-500"}`}
                    />
                  </div>
                  {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...form.register("phone")}
                      placeholder="01234567890"
                      type="tel"
                      className={`w-full pl-11 pr-4 h-12 border-2 rounded-xl text-sm focus:outline-none transition ${errors.phone ? "border-red-300 focus:border-red-500 bg-red-50/50" : "border-gray-200 focus:border-emerald-500"}`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>}
                </div>
              </form>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-emerald-600 text-white text-sm font-bold rounded-full flex items-center justify-center">2</span>
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPayment("cod")}
                  className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-left ${payment === "cod"
                    ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                >
                  {payment === "cod" && (
                    <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-emerald-500" />
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${payment === "cod" ? "bg-emerald-600" : "bg-gray-100"}`}>
                    <Banknote className={`w-6 h-6 ${payment === "cod" ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-bold text-sm ${payment === "cod" ? "text-emerald-700" : "text-gray-700"}`}>Cash on Delivery</p>
                    <p className="text-xs text-gray-400 mt-0.5">Pay when you receive</p>
                  </div>
                </button>

                {/* Bank / Card */}
                <button
                  type="button"
                  onClick={() => setPayment("bank")}
                  className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-left ${payment === "bank"
                    ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                >
                  {payment === "bank" && (
                    <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-emerald-500" />
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${payment === "bank" ? "bg-emerald-600" : "bg-gray-100"}`}>
                    <CreditCard className={`w-6 h-6 ${payment === "bank" ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-bold text-sm ${payment === "bank" ? "text-emerald-700" : "text-gray-700"}`}>Online Payment</p>
                    <p className="text-xs text-gray-400 mt-0.5">Credit / Debit card</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1">
                {products.map((item: { _id: string; product?: { imageCover?: string; title?: string; price?: number }; price: number; count: number }) => {
                  const img = item.product?.imageCover || "";
                  const title = item.product?.title || "Product";
                  return (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                        {img ? (
                          <Image src={img} alt={title} fill sizes="48px" className="object-contain p-1" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.count}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                        <p className="text-xs text-gray-400">{item.price} EGP each</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{(item.price * item.count).toFixed(2)} EGP</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{subtotal.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-gray-900">{tax.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-6">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-emerald-600">{total.toFixed(2)} EGP</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 text-base disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                ) : (
                  <>{payment === "bank" ? <CreditCard className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
                    {payment === "bank" ? "Pay Online" : "Place Order (COD)"}</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs">256-bit SSL secure checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
