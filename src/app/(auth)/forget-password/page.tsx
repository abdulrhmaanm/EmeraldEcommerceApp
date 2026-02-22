"use client";

import pic1 from "@/assets/images/75f394c0a1c7dc5b68a42239311e510f54d8cd59.jpg";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


// ✅ Validation schema
const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgetPasswordPayload = z.infer<typeof forgetPasswordSchema>;

export default function ForgetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: ForgetPasswordPayload) {
    setLoading(true);
    try {

      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        toast.error("Failed to send reset link", { position: "top-center" });
      } else {
        toast.success("Password reset link sent to your email", {
          position: "top-center",
        });
        router.push("/forget-password/verify");
      }
    } catch (error) {
      console.log("Unexpected error:", error);
      toast.error("Something went wrong", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  const form = useForm<ForgetPasswordPayload>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-xl overflow-hidden">

        <div className="hidden md:relative md:flex items-center justify-center bg-emerald-900 overflow-hidden min-h-[400px]">
          <Image
            src={pic1}
            alt="Forget password illustration"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
          />
          <div className="relative z-10 text-center text-white px-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl font-extrabold mx-auto mb-4">E</div>
            <h3 className="text-2xl font-bold">Reset your password</h3>
            <p className="text-emerald-200/70 mt-2 text-sm">We&apos;ll send a verification code to your email.</p>
          </div>
        </div>


        <div className="p-16 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-3">Forgot Password?</h2>
          <p className="text-gray-500 mb-8 text-lg">
            Enter your email and we’ll send you a reset link
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 text-lg"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-lg flex items-center gap-2 rounded-xl font-bold shadow-lg shadow-emerald-600/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Link
                  href="/login"
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold transition"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
