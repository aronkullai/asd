import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Register"
};

export default function RegisterPage() {
  return (
    <main className="bg-soft py-16">
      <AuthForm mode="register" />
    </main>
  );
}
