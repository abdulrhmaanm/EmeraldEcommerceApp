"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordPayload) {
    setLoading(true);
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          newPassword: values.password,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to reset password", { position: "top-center" });
      } else {
        toast.success("Password reset successful!", { position: "top-center" });
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50/30 p-4 lg:p-8">
      <div className="flex w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">

        {/* Left Side - Image / Branding */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-emerald-900 text-white relative p-12 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070"
              alt="Reset Password"
              fill
              sizes="50vw"
              className="object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
          </div>

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight mb-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">E</span>
              Emerald
            </Link>
          </div>

          <div className="relative z-10 mt-auto">
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Create a new password for your account.</h2>
            <p className="text-emerald-100/80 text-lg max-w-md">Choose a strong password to keep your account secure and your shopping experience safe.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Reset Password</h2>
              <p className="text-gray-500 text-lg">Enter your email and new password</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="h-14 text-base rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50 transition-all"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="h-14 text-base rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50 transition-all"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="h-14 text-base rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50 transition-all"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 mt-8"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <p className="mt-8 text-center text-gray-500">
              Remember your password?{" "}
              <Link href="/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
