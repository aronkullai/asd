"use client";

import { useState } from "react";

export function AdminPromoToggleButton({
  promoCodeId,
  isActive,
  disabled = false
}: {
  promoCodeId?: string;
  isActive: boolean;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function toggle() {
    if (!promoCodeId || disabled) return;
    setStatus("loading");
    const response = await fetch("/api/admin/promos/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promoCodeId, isActive: !isActive })
    });
    setStatus(response.ok ? "done" : "error");
  }

  return (
    <button
      type="button"
      disabled={disabled || !promoCodeId || status === "loading"}
      onClick={toggle}
      className="rounded-card border border-line bg-white px-3 py-2 text-xs font-extrabold text-blue-800 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {status === "loading" ? "Saving..." : status === "done" ? "Saved" : status === "error" ? "Retry" : isActive ? "Mark inactive" : "Mark active"}
    </button>
  );
}
