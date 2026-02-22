"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      {/* Emerald animated ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-emerald-50 flex items-center justify-center">
          <span className="text-emerald-600 font-extrabold text-lg">E</span>
        </div>
      </div>
      <p className="text-emerald-700 font-semibold tracking-wide">Loading…</p>
    </div>
  );
}
