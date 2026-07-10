interface IconProps {
  size?: number;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconGrid = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconList = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="4" cy="6" r="1" fill="currentColor" />
    <circle cx="4" cy="12" r="1" fill="currentColor" />
    <circle cx="4" cy="18" r="1" fill="currentColor" />
  </svg>
);

export const IconWallet = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M20 7H5a2 2 0 0 1 0-4h13v4" />
    <path d="M3 5v13a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1" />
    <circle cx="16.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconUpload = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);

export const IconSpark = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
    <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />
  </svg>
);

export const IconTarget = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </svg>
);

export const IconOut = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const IconTrendUp = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
);

export const IconCoins = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <ellipse cx="9" cy="6" rx="6" ry="3" />
    <path d="M3 6v6c0 1.66 2.69 3 6 3s6-1.34 6-3V6" />
    <path d="M3 12v6c0 1.66 2.69 3 6 3s6-1.34 6-3v-6" />
    <path d="M18 9c1.86.35 3 1.13 3 2.25V17c0 1.35-1.67 2.5-4 2.87" />
  </svg>
);

export const IconScale = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 3v18M5 21h14" />
    <path d="M5 7l14-2" />
    <path d="M5 7l-2.5 6a3 3 0 0 0 5 0L5 7zM19 5l-2.5 6a3 3 0 0 0 5 0L19 5z" />
  </svg>
);

export const LogoMark = ({ size = 17 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.2}>
    <path d="M3 15l4.5-5 3.5 3.5L21 4" />
    <path d="M15.5 4H21v5.5" />
    <path d="M3 20h18" />
  </svg>
);
