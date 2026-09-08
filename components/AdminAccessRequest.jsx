"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function AdminAccessRequest({ user }) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  async function submit(event) {
    event.preventDefault(); setState("sending"); setMessage("");
    const response = await fetch("/api/admin-access", { method: "POST" });
    const result = await response.json();
    setState(response.ok ? "sent" : "idle");
    setMessage(response.ok ? "Your request is pending. An administrator has been notified." : result.error || "Could not send your request.");
  }
  return <main className="auth-card journey-panel admin-request-page">
    <ShieldCheck className="admin-request-icon" />
    <span className="journey-eyebrow">SECURE ACCESS</span><h1>Request admin access</h1>
    <p>Signed in as <strong>{user.email}</strong>. Access is granted only after an existing administrator reviews your request.</p>
    {state === "sent" ? <div className="journey-alert" role="status">{message}</div> : <form onSubmit={submit}>{message && <p role="alert">{message}</p>}<button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Request admin access"}</button></form>}
  </main>;
}
