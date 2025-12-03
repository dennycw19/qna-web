"use client";

import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { useEffect, useState } from "react";

export function TopLoaderProvider() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // pastikan komponen hanya render setelah mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // hindari SSR mismatch

  // fallback color jika theme belum tersedia
  const loaderColor = theme === "dark" ? "#cba6f7" : "#8839ef";

  return (
    <NextTopLoader
      height={3}
      color={loaderColor}
      showSpinner={false}
      zIndex={999999}
    />
  );
}
