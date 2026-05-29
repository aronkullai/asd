"use client";

import { useMemo } from "react";
import { CasinoLogo } from "@/components/CasinoLogo";
import { useTheme } from "@/components/ThemeProvider";
import type { CasinoLogoConfig } from "@/lib/types";

type CasinoIconProps = {
  casinoSlug: string;
  text?: string;
  iconConfig?: CasinoLogoConfig;
  size?: "sm" | "md" | "lg";
};

const iconFileBySlug: Record<string, string> = {
  stake: "stake",
  rainbet: "rainbet",
  roobet: "roobet",
  "celsius-casino": "celsius",
  "spartans-casino": "spartans",
  shuffle: "shuffle",
  "bc-game": "bcgame",
  bitcasino: "bitcasino"
};

function initialsFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function CasinoIcon({ casinoSlug, text, iconConfig, size = "md" }: CasinoIconProps) {
  const { theme } = useTheme();
  const themedConfig = useMemo<CasinoLogoConfig | undefined>(() => {
    const fileBase = iconFileBySlug[casinoSlug] || casinoSlug.replace(/-/g, "");
    const themePrefix = theme === "dark" ? "d" : "l";
    const defaultPath = `/icons/casinos/${theme}/${themePrefix}_${fileBase}.png`;
    const baseConfig: CasinoLogoConfig = iconConfig || {
      symbol: "shield",
      gradient: ["#0b1f33", "#17212b", "#1f9d7a"],
      accent: "#b7f7df"
    };

    return {
      ...baseConfig,
      imageSrc: theme === "dark"
        ? baseConfig.darkImageSrc || defaultPath
        : baseConfig.lightImageSrc || defaultPath
    };
  }, [casinoSlug, iconConfig, theme]);

  return <CasinoLogo text={text || initialsFromSlug(casinoSlug)} iconConfig={themedConfig} size={size} />;
}
