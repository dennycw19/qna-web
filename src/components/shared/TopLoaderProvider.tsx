"use client";

import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";

export function TopLoaderProvider() {
  const { theme } = useTheme();
  return (
    <NextTopLoader
      height={3}
      color={theme === "dark" ? "#cba6f7" : "#8839ef"}
      showSpinner={false}
      zIndex={999999}
    />
  );
}
