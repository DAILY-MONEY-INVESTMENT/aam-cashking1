export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#FFD84D" />
          <stop offset="100%" stopColor="#FFC800" />
        </linearGradient>
        <linearGradient id="red" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#E40000" />
          <stop offset="100%" stopColor="#8A0000" />
        </linearGradient>
      </defs>
      <path
        d="M32 2 L58 12 V34 C58 48 46 58 32 62 C18 58 6 48 6 34 V12 Z"
        fill="url(#red)"
        stroke="url(#gold)"
        strokeWidth="2"
      />
      <path
        d="M20 42 L26 24 L32 36 L38 24 L44 42"
        stroke="url(#gold)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="14" r="2.5" fill="#FFC800" />
    </svg>
  );
}

