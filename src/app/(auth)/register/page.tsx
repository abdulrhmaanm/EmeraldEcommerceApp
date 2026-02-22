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

const registerFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    rePassword: z.string().min(6, "Please confirm your password"),
    phone: z
      .string()
      .regex(/^[0-9]{10,15}$/, "Phone must be 10–15 digits"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

type RegisterFormPayload = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: RegisterFormPayload) {
    setLoading(true);
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Registration failed", {
          position: "top-center",
        });
      } else {
        toast.success("Account created successfully!", {
          position: "top-center",
        });
        router.push("/login");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  const form = useForm<RegisterFormPayload>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50/30 p-4 lg:p-8">
      <div className="flex w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex-row-reverse">

        {/* Right Side - Image / Branding */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-emerald-900 text-white relative p-12 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470"
              alt="Emerald Collection Fashion"
              fill
              sizes="50vw"
              className="object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
          </div>

          <div className="relative z-10 text-right">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight mb-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">E</span>
              Emerald
            </Link>
          </div>

          <div className="relative z-10 mt-auto text-right">
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Join the exclusive club.</h2>
            <p className="text-emerald-100/80 text-lg max-w-md ml-auto">Create an account to unlock premium features, fast checkout, and personalized recommendations.</p>
          </div>
        </div>

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Create Account</h2>
              <p className="text-gray-500 text-lg">Sign up securely and start shopping</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 text-base rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50 transition-all"
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="h-12 text-base rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50 transition-all"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          className="h-12 text-base rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50 transition-all"
                          placeholder="0123456789"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="h-12 text-base rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50 transition-all"
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
                    name="rePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="h-12 text-base rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50 transition-all"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 mt-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Sign Up <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <p className="mt-8 text-center text-gray-500">
              Already have an account?{" "}
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
