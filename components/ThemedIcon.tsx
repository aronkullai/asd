"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faDice,
  faLock,
  faShieldHalved,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useTheme } from "@/components/ThemeProvider";

type ThemedIconType = "casino" | "security" | "star" | "check" | "lock";
type ThemedIconSize = "sm" | "md" | "lg";

const icons: Record<ThemedIconType, IconDefinition> = {
  casino: faDice,
  security: faShieldHalved,
  star: faStar,
  check: faCheckCircle,
  lock: faLock
};

const sizes: Record<ThemedIconSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5"
};

const colors: Record<ThemedIconType, { light: string; dark: string }> = {
  casino: { light: "text-blue-800", dark: "text-blue-300" },
  security: { light: "text-accent-dark", dark: "text-emerald-300" },
  star: { light: "text-amber-500", dark: "text-amber-300" },
  check: { light: "text-accent", dark: "text-emerald-300" },
  lock: { light: "text-slate-700", dark: "text-slate-200" }
};

export function ThemedIcon({
  type,
  size = "md",
  className = ""
}: {
  type: ThemedIconType;
  size?: ThemedIconSize;
  className?: string;
}) {
  const { theme } = useTheme();
  return (
    <FontAwesomeIcon
      icon={icons[type]}
      className={`${sizes[size]} ${colors[type][theme]} ${className}`}
      aria-hidden="true"
    />
  );
}
