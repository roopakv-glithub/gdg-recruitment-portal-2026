"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function UserButton({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleSignOut = () => {
    setIsOpen(false);
    // Simply redirect to the auth sign-out page
    router.push("/auth/signout");
  };

  const getInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <span>
      <strong>{user.name || user.email}</strong>
      {" "}
      <button type="button" onClick={handleSignOut}>
        Sign Out
      </button>
    </span>
  );
} 