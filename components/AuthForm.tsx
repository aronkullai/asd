"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/components/AuthProvider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const isRegister = mode === "register";
  const passwordRules = [
    { label: "At least 10 characters", valid: password.length >= 10 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special symbol", valid: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~;]/.test(password) }
  ];
  const passwordErrors = passwordRules.filter((rule) => !rule.valid).map((rule) => rule.label.toLowerCase());
  const canSubmit =
    email.includes("@") &&
    password.length > 0 &&
    (!isRegister || (passwordErrors.length === 0 && password === confirmPassword && acceptedTerms));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setFieldErrors({});

    if (!email.includes("@")) {
      setStatus("error");
      setMessage("Enter a valid email.");
      return;
    }
    if (isRegister && passwordErrors.length) {
      setStatus("error");
      setFieldErrors({ password: `Missing: ${passwordErrors.join(", ")}.` });
      setMessage("Please strengthen your password.");
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setStatus("error");
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      setMessage("Please confirm the same password.");
      return;
    }
    if (isRegister && !acceptedTerms) {
      setStatus("error");
      setMessage("Confirm you are 18+ and accept the terms.");
      return;
    }

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword, acceptedTerms })
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setFieldErrors(payload?.fieldErrors || {});
      setMessage(payload?.error || "Authentication failed.");
      return;
    }

    setStatus("success");
    setMessage(isRegister ? "Account created. Taking you to your account..." : "Logged in. Taking you to your account...");
    await refreshAuth();
    window.setTimeout(() => {
      router.push(isRegister ? "/account" : "/account");
      router.refresh();
    }, 900);
  }

  return (
    <form onSubmit={submit} className="mx-auto grid w-[min(100%,460px)] gap-4 rounded-card border border-line bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.12em] text-accent-dark">{isRegister ? "Create account" : "Welcome back"}</p>
        <h1 className="text-3xl font-black text-navy">{isRegister ? "Register" : "Log in"}</h1>
        <p className="mt-2 text-sm text-muted">
          {isRegister ? "Save preferences and access admin tools when enabled." : "Log in to continue to PromoGuard."}
        </p>
      </div>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Email
        <input className="min-h-11 rounded-card border border-line px-3 py-2 font-normal text-ink" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Password
        <span className="relative">
          <input className={`min-h-11 w-full rounded-card border px-3 py-2 pr-12 font-normal text-ink ${fieldErrors.password ? "border-red-500" : "border-line"}`} value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} />
          <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-card text-muted hover:bg-soft">
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" aria-hidden="true" />
          </button>
        </span>
        {isRegister ? (
          <ul className="grid gap-1 text-xs text-muted">
            {passwordRules.map((rule) => (
              <li key={rule.label} className={rule.valid ? "font-bold text-accent-dark" : ""}>
                {rule.valid ? "OK" : "--"} {rule.label}
              </li>
            ))}
          </ul>
        ) : null}
        {fieldErrors.password ? <span className="text-xs font-bold text-red-700">{fieldErrors.password}</span> : null}
      </label>
      {isRegister ? (
        <label className="grid gap-2 text-sm font-bold text-navy">
          Confirm password
          <input className={`min-h-11 rounded-card border px-3 py-2 font-normal text-ink ${fieldErrors.confirmPassword ? "border-red-500" : "border-line"}`} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type={showPassword ? "text" : "password"} autoComplete="new-password" />
          {fieldErrors.confirmPassword ? <span className="text-xs font-bold text-red-700">{fieldErrors.confirmPassword}</span> : null}
        </label>
      ) : null}
      {isRegister ? (
        <label className="flex gap-3 rounded-card border border-line bg-soft p-3 text-sm font-bold text-navy">
          <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
          <span>I am 18+ and accept the <Link href="/terms" className="text-blue-800">Terms</Link>.</span>
          {fieldErrors.acceptedTerms ? <span className="text-xs font-bold text-red-700">{fieldErrors.acceptedTerms}</span> : null}
        </label>
      ) : null}
      <button type="submit" disabled={status === "loading" || !canSubmit} className="min-h-11 rounded-card bg-accent px-4 py-3 font-extrabold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60">
        {status === "loading" ? "Please wait..." : isRegister ? "Create account" : "Log in"}
      </button>
      {message ? (
        <p className={`rounded-card px-3 py-2 text-sm font-bold ${status === "success" ? "bg-emerald-50 text-accent-dark" : "bg-red-50 text-red-700"}`}>
          {message}
        </p>
      ) : null}
      <p className="text-center text-sm text-muted">
        {isRegister ? "Already have an account?" : "Need an account?"}{" "}
        <Link href={isRegister ? "/login" : "/register"} className="font-extrabold text-blue-800">
          {isRegister ? "Log in" : "Register"}
        </Link>
      </p>
    </form>
  );
}
