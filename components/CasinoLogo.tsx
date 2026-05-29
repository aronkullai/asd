"use client";

import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCloudRain,
  faCoins,
  faCrown,
  faDice,
  faGem,
  faShieldHalved,
  faSnowflake
} from "@fortawesome/free-solid-svg-icons";
import type { CasinoLogoConfig, CasinoLogoSymbol } from "@/lib/types";

type CasinoLogoProps = {
  text: string;
  size?: "sm" | "md" | "lg";
  iconConfig?: CasinoLogoConfig;
};

const sizeClass = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-20 w-20 text-2xl"
};

const iconClass = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7"
};

type LogoTheme = {
  background: string;
  foreground: string;
  icon: Parameters<typeof FontAwesomeIcon>[0]["icon"];
  iconColor: string;
  glint: string;
};

const symbolIcons: Record<CasinoLogoSymbol, LogoTheme["icon"]> = {
  bolt: faBolt,
  rain: faCloudRain,
  gem: faGem,
  snow: faSnowflake,
  shield: faShieldHalved,
  dice: faDice,
  coins: faCoins,
  crown: faCrown
};

const fallbackThemes: LogoTheme[] = [
  {
    background: "linear-gradient(135deg, #0b1f33 0%, #1f9d7a 100%)",
    foreground: "#ffffff",
    icon: faShieldHalved,
    iconColor: "#b7f7df",
    glint: "rgba(183, 247, 223, 0.28)"
  },
  {
    background: "linear-gradient(135deg, #1f2937 0%, #2563eb 100%)",
    foreground: "#ffffff",
    icon: faGem,
    iconColor: "#bfdbfe",
    glint: "rgba(191, 219, 254, 0.28)"
  },
  {
    background: "linear-gradient(135deg, #312e18 0%, #ca8a04 100%)",
    foreground: "#fffbea",
    icon: faCrown,
    iconColor: "#fde68a",
    glint: "rgba(253, 230, 138, 0.28)"
  }
];

function getFallbackTheme(text: string) {
  const hash = Array.from(text).reduce((total, character) => total + character.charCodeAt(0), 0);
  return fallbackThemes[hash % fallbackThemes.length];
}

function getConfiguredTheme(iconConfig?: CasinoLogoConfig): LogoTheme | null {
  if (!iconConfig) return null;

  const [from, via, to] = iconConfig.gradient;

  return {
    background: `linear-gradient(135deg, ${from} 0%, ${via} 52%, ${to} 100%)`,
    foreground: iconConfig.foreground ?? "#ffffff",
    icon: symbolIcons[iconConfig.symbol],
    iconColor: iconConfig.accent,
    glint: iconConfig.glint ?? "rgba(255, 255, 255, 0.24)"
  };
}

export function CasinoLogo({ text, size = "md", iconConfig }: CasinoLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const normalizedText = text.trim().slice(0, 3).toUpperCase();
  const theme = getConfiguredTheme(iconConfig) ?? getFallbackTheme(normalizedText);
  const imageSrc = iconConfig?.imageSrc && !imageFailed ? iconConfig.imageSrc : null;

  if (imageSrc) {
    return (
      <div
        className={`${sizeClass[size]} relative grid shrink-0 place-items-center overflow-hidden rounded-card border border-line bg-white shadow-sm`}
        aria-hidden={iconConfig?.imageAlt ? undefined : "true"}
      >
        <Image
          src={imageSrc}
          alt={iconConfig?.imageAlt ?? ""}
          fill
          sizes={size === "lg" ? "80px" : size === "md" ? "56px" : "40px"}
          className="object-contain p-1.5"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass[size]} relative grid shrink-0 place-items-center overflow-hidden rounded-card font-black shadow-sm`}
      style={{
        background: theme.background,
        color: theme.foreground,
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.28), 0 10px 22px rgba(11, 31, 51, 0.14)"
      }}
      aria-hidden="true"
    >
      <span
        className="absolute -right-3 -top-3 h-12 w-12 rounded-full"
        style={{ background: theme.glint }}
      />
      <FontAwesomeIcon
        icon={theme.icon}
        className={`${iconClass[size]} absolute bottom-1.5 right-1.5 opacity-80`}
        style={{ color: theme.iconColor }}
        aria-hidden="true"
      />
      <span className="relative z-10 leading-none drop-shadow-sm">{normalizedText}</span>
    </div>
  );
}
