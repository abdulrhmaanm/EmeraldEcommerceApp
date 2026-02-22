"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Loader2, ShieldCheck, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const verifyCodeSchema = z.object({
  resetCode: z.string().length(6, "Code must be exactly 6 digits"),
});
type VerifyCodePayload = z.infer<typeof verifyCodeSchema>;

export default function VerifyCodePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<VerifyCodePayload>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { resetCode: "" },
  });

  const codeValue = watch("resetCode") ?? "";

  async function onSubmit(values: VerifyCodePayload) {
    setLoading(true);
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) {
        toast.error("Invalid or expired code — please try again");
      } else {
        toast.success("Code verified! Set your new password.");
        router.push("/forget-password/reset");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Subtle orb */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-emerald-600 to-teal-500" />

          <div className="p-10">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Verify Your Code</h1>
              <p className="text-gray-500 text-sm">
                Enter the 6-digit code we sent to your email address.
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {[0, 1, 2].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i <= 1 ? 'w-8 bg-emerald-600' : 'w-4 bg-gray-200'}`} />
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Code input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                  Verification Code
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("resetCode")}
                    placeholder="• • • • • •"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className={`w-full pl-12 pr-4 h-14 text-center text-2xl font-bold tracking-[0.5em] border-2 rounded-xl focus:outline-none transition ${errors.resetCode
                      ? "border-red-300 focus:border-red-500 bg-red-50/50"
                      : codeValue.length === 6
                        ? "border-emerald-400 bg-emerald-50/30"
                        : "border-gray-200 focus:border-emerald-500"
                      }`}
                  />
                </div>
                {/* Character counter */}
                <div className="flex justify-end mt-1.5 gap-1">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`w-6 h-1 rounded-full transition-all ${i < codeValue.length ? 'bg-emerald-500' : 'bg-gray-200'
                        }`}
                    />
                  ))}
                </div>
                {errors.resetCode && (
                  <p className="text-red-500 text-xs mt-1.5 text-center">{errors.resetCode.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-13 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-70 text-base"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Verifying…</>
                ) : (
                  <><ShieldCheck className="w-5 h-5" /> Verify Code</>
                )}
              </button>
            </form>

            {/* Back */}
            <div className="mt-6 text-center">
              <Link href="/forget-password" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to email entry
              </Link>
            </div>
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Didn&apos;t receive a code?{" "}
          <Link href="/forget-password" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Resend email
          </Link>
        </p>
      </div>
    </div>
  );
}
