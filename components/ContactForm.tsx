"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);
    const nextErrors: Record<string, string> = {};
    const email = String(values.email || "");

    if (!String(values.name || "").trim()) nextErrors.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Please enter a valid email.";
    if (String(values.message || "").trim().length < 10) nextErrors.message = "Please enter at least 10 characters.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      return;
    }

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      setStatus("error");
      setMessage("Something went wrong. Please email hello@promoguard.example instead.");
      return;
    }

    setStatus("success");
    setMessage("Thanks. Your message was received and is ready for follow-up.");
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-card border border-line bg-white p-6 shadow-sm">
      <label className="grid gap-2 text-sm font-bold text-navy">
        Name
        <input className={`min-h-11 rounded-card border px-3 py-2 font-normal text-ink ${errors.name ? "border-red-500" : "border-line"}`} name="name" required />
        {errors.name ? <span className="text-xs font-bold text-red-700">{errors.name}</span> : null}
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Email
        <input className={`min-h-11 rounded-card border px-3 py-2 font-normal text-ink ${errors.email ? "border-red-500" : "border-line"}`} name="email" type="email" required />
        {errors.email ? <span className="text-xs font-bold text-red-700">{errors.email}</span> : null}
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Message
        <textarea className={`min-h-32 rounded-card border px-3 py-2 font-normal text-ink ${errors.message ? "border-red-500" : "border-line"}`} name="message" required />
        {errors.message ? <span className="text-xs font-bold text-red-700">{errors.message}</span> : null}
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-11 items-center justify-center rounded-card bg-accent px-4 py-3 text-sm font-extrabold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
      {message ? (
        <p className={`m-0 rounded-card px-3 py-2 text-sm font-bold ${status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-accent-dark"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
