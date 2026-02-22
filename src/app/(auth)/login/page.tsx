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
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const loginFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, { message: "Password required" }).min(6, "Password must be at least 6 characters long"),
});
type loginFormPayLoad = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: loginFormPayLoad) {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.error) {
        console.log("Login failed:", res.error);
        toast.error("Incorrect Email or Password", { position: "top-center" });
      } else {
        console.log("Login success:", res);
        toast.success("Login successful!", { position: "top-center" });
        router.push("/");
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }

  const form = useForm<loginFormPayLoad>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50/30 p-4 lg:p-8">
      <div className="flex w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">

        {/* Left Side - Image / Branding */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-emerald-900 text-white relative p-12 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070"
              alt="Emerald Collection"
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
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Welcome back to your curated lifestyle.</h2>
            <p className="text-emerald-100/80 text-lg max-w-md">Access your account to manage orders, view saved items, and discover new arrivals tailored for you.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Log In</h2>
              <p className="text-gray-500 text-lg">Enter your details to access your account</p>
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
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                        <Link href="/forget-password" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition">
                          Forgot Password?
                        </Link>
                      </div>
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
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Log In <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <p className="mt-8 text-center text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-emerald-600 font-bold hover:text-emerald-700 transition">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
