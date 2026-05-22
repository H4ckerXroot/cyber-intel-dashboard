import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md";
  className?: string;
}

export function BrandLogo({ size = "md", className }: BrandLogoProps) {
  const dim = size === "sm" ? 32 : 36;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect
        x="1"
        y="1"
        width="34"
        height="34"
        rx="8"
        fill="#0c1424"
        stroke="#2563eb"
        strokeWidth="1.25"
        strokeOpacity="0.55"
      />
      <path
        d="M18 7L26 11V18C26 23.5 22.5 27.5 18 29C13.5 27.5 10 23.5 10 18V11L18 7Z"
        stroke="#3b82f6"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="rgba(59,130,246,0.12)"
      />
      <path
        d="M18 14V22M15 17H21"
        stroke="#60a5fa"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="17.5" r="2" fill="#22d3ee" fillOpacity="0.9" />
    </svg>
  );
}
