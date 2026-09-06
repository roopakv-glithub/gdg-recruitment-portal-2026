"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import { demoMode } from "@/lib/demo";

export default function SignInButton({ children, callbackURL = "/" }) {
  const handleSignIn = async () => {
    if (demoMode) {
      window.location.assign("/auth/signin");
      return;
    }
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      className="rounded-full"
      variant="outline"
      size="icon"
    >
      {children || <FaGoogle />}
    </Button>
  );
} 
