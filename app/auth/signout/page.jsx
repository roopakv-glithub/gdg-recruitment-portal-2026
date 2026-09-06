"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        await authClient.signOut();
        toast.success("Signed out successfully");
        router.push("/");
      } catch (error) {
        console.error("Sign out error:", error);
        toast.error("Failed to sign out");
        router.push("/");
      }
    };

    performSignOut();
  }, [router]);

  return (
    <div>
      <p>Signing out...</p>
    </div>
  );
} 