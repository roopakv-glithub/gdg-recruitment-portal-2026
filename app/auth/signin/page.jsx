"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import DWASFWLoader from "@/components/GDGLoader";
import { demoMode } from "@/lib/demo";

const passwordAuthEnabled = process.env.NEXT_PUBLIC_ALLOW_PASSWORD_AUTH === "true";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [returnTo, setReturnTo] = useState(null);
  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    setReturnTo(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
  }, []);

  useEffect(() => {
    if (session?.user && !isPending && returnTo) {
      router.push(returnTo || "/");
    }
  }, [session, isPending, router, returnTo]);

  if (isPending) {
    return <DWASFWLoader />;
  }

  if (session?.user) {
    return (
      <div className="min-h-screen bg-[#0d0d11] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-sm text-zinc-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (mode === "signup" && !name) {
      toast.error("Please enter your name.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: returnTo || "/",
        });
        if (res?.error) {
          toast.error(res.error.message || "Failed to create account.");
        } else {
          toast.success("Account created successfully!");
          router.push(returnTo || "/");
        }
      } else {
        const res = await authClient.signIn.email({
          email,
          password,
          callbackURL: returnTo || "/",
        });
        if (res?.error) {
          toast.error(res.error.message || "Invalid credentials.");
        } else {
          toast.success("Signed in successfully!");
          router.push(returnTo || "/");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: returnTo || "/",
      });
      if (result?.error) throw new Error(result.error.message);
    } catch (error) {
      toast.error(error.message || "Google sign-in is not configured yet.");
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-card journey-panel">
      <h1>Recruitment 2026</h1>
      <p>Candidate Portal</p>
      {demoMode && (
        <div style={{ margin: "24px 0", padding: "20px", border: "1px solid #4285f4", borderRadius: "12px" }}>
          <h2>Try the demo</h2>
          <p>No account or Firebase setup needed. Demo applications are temporary and reset when the server restarts.</p>
          <Button disabled={submitting} onClick={async () => {
            setSubmitting(true);
            try {
              const response = await fetch("/api/auth/demo-login", { method: "POST" });
              if (!response.ok) throw new Error("Demo login failed");
              window.location.assign(returnTo || "/");
            } catch (error) {
              toast.error(error.message);
              setSubmitting(false);
            }
          }}>{submitting ? "Opening demo..." : "Continue as Demo Candidate"}</Button>
        </div>
      )}

      {!demoMode && <>
      <button className="google-signin-button" type="button" onClick={handleGoogleSignIn} disabled={submitting}>
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z"/>
          <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.38l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z"/>
          <path fill="#FBBC05" d="M6.39 13.92A6.02 6.02 0 0 1 6.07 12c0-.67.12-1.31.32-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.53l3.35-2.61Z"/>
          <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.51 3.82 1.5l2.88-2.87A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z"/>
        </svg>
        Continue with your VIT Google account
      </button>
      <Link className="admin-access-link" href="/admin/request">I’m an admin · Request admin access</Link>
      {passwordAuthEnabled && <>
      <div className="auth-divider"><span>or use email</span></div>
      <div className="auth-mode-switch">
        <button
          type="button"
          onClick={() => setMode("signin")}
          disabled={mode === "signin"}
        >
          Sign In
        </button>
        {" | "}
        <button
          type="button"
          onClick={() => setMode("signup")}
          disabled={mode === "signup"}
        >
          Create Account
        </button>
      </div>

      <h2>{mode === "signin" ? "Sign In" : "Create Account"}</h2>

      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="name">Full Name: </label>
            <br />
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="email">Email Address: </label>
          <br />
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="password">Password: </label>
          <br />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>
      </>}
      </>}
    </main>
  );
}
