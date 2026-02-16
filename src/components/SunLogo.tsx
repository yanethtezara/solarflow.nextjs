/**
 * SolarFlow sun logo - SVG scalable
 * Primary color: amber-600 (#d97706)
 */
interface SunLogoProps {
  /** Size in pixels (default: 48) */
  size?: number;
  /** Tailwind classes for color override (e.g. text-amber-500 on dark bg) */
  className?: string;
}

export default function SunLogo({ size = 48, className }: SunLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'text-amber-600'}
      aria-hidden
    >
      {/* Central circle */}
      <circle cx="24" cy="24" r="8" fill="currentColor" />
      {/* Rays */}
      <path
        d="M24 4v6M24 38v6M4 24h6M38 24h6M10.4 10.4l4.2 4.2M33.4 33.4l4.2 4.2M10.4 37.6l4.2-4.2M33.4 14.6l4.2-4.2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
