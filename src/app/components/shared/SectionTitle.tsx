import React from "react";

export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-15">
      <h2 className="font-semibold text-red-500 mb-5 relative before:content-[''] before:absolute before:top-1/2 before:start-0 ps-9 before:rounded-sm before:-translate-y-1/2 before:w-5 before:h-10 before:bg-red-500">{title}</h2>
      <span className="tex-4xl font-semibold mb-15">{subtitle}</span>
    </div>
  );
}
