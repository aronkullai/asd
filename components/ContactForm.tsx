"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    if (!response.ok) {
      setStatus("error");
      setMessage("Something went wrong. Please email hello@promoguard.example instead.");
      return;
    }

    setStatus("success");
    setMessage("Thanks. Your message was logged and is ready to connect to an email provider.");
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-card border border-line bg-white p-6 shadow-sm">
      <label className="grid gap-2 text-sm font-bold text-navy">
        Name
        <input className="min-h-11 rounded-card border border-line px-3 py-2 font-normal text-ink" name="name" required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Email
        <input className="min-h-11 rounded-card border border-line px-3 py-2 font-normal text-ink" name="email" type="email" required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Message
        <textarea className="min-h-32 rounded-card border border-line px-3 py-2 font-normal text-ink" name="message" required />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-11 items-center justify-center rounded-card bg-accent px-4 py-3 text-sm font-extrabold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
      {message ? <p className={`m-0 text-sm font-bold ${status === "error" ? "text-red-700" : "text-accent-dark"}`}>{message}</p> : null}
    </form>
  );
}
