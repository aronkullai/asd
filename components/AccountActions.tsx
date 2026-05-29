"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AccountActions() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function logout() {
    setStatus("loading");
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      setStatus("error");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={logout}
        disabled={status === "loading"}
        className="min-h-11 rounded-card bg-navy px-4 py-3 font-extrabold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {status === "loading" ? "Logging out..." : "Log out"}
      </button>
      {status === "error" ? <p className="text-sm font-bold text-red-700">Could not log out. Try again.</p> : null}
    </div>
  );
}

