import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

export function isAdminUser(user) {
  if (!user) return false;
  if (user.role === "admin") return true;

  const allowedEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(String(user.email || "").toLowerCase());
}

export async function requireAdmin() {
  const session = await getServerSession();
  return isAdminUser(session?.user) ? session : null;
}
