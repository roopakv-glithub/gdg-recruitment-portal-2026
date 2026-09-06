"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "./ThemeToggle";

function AccountMenu({ user }) {
  const initials = (user.name || user.email || "User")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="account-menu">
      <button className="account-trigger" type="button" aria-haspopup="menu" aria-label="Open account menu">
        {user.image ? <img src={user.image} alt="" referrerPolicy="no-referrer" /> : <span>{initials}</span>}
      </button>
      <div className="account-popover" role="menu">
        <div className="account-identity">
          <strong>{user.name || "Signed in"}</strong>
          <span>{user.email}</span>
        </div>
        <Link href="/auth/signout" role="menuitem">
          <LogOut aria-hidden="true" />
          Sign out
        </Link>
      </div>
    </div>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const signInHref = pathname.startsWith("/join/") ? `/auth/signin?next=${encodeURIComponent(pathname)}` : "/auth/signin";
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="portal-header">
      <nav className="portal-nav" aria-label="Main navigation">
        <Link href="/" className="portal-brand">
          <img className="theme-dark-image" src="/assets/reference-logo.png" width="123" height="73" alt="" />
          <img className="theme-light-image" src="/assets/reference-logo-light.png" width="94" height="57" alt="" />
          <span>Recruitment Portal</span>
        </Link>
        <div className="portal-nav-actions">
          <ThemeToggle />
          <Link href="/departments" className="departments-link">Departments</Link>
          {session?.user?.role === "admin" && <Link href="/admin">Admin Panel</Link>}
          {session?.user ? (
            <AccountMenu user={session.user} />
          ) : (
            <Link href={signInHref} className="signin-button" aria-busy={isPending}><UserRound aria-hidden="true" /> Sign In</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
