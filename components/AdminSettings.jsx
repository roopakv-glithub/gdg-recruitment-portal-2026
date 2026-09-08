"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarClock, ShieldCheck, ShieldX } from "lucide-react";

function localInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default function AdminSettings({ initialDeadline, initialRequests }) {
  const [deadline, setDeadline] = useState(localInputValue(initialDeadline));
  const [requests, setRequests] = useState(initialRequests);
  const [busy, setBusy] = useState("");

  async function saveDeadline(event) {
    event.preventDefault();
    setBusy("deadline");
    const response = await fetch("/api/recruitment-settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deadline: new Date(deadline).toISOString() }) });
    const result = await response.json();
    setBusy("");
    response.ok ? toast.success("Application deadline updated.") : toast.error(result.error || "Could not update deadline.");
  }

  async function review(requestId, decision) {
    setBusy(requestId);
    const response = await fetch("/api/admin-access", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestId, decision }) });
    const result = await response.json();
    setBusy("");
    if (!response.ok) return toast.error(result.error || "Could not review request.");
    setRequests((current) => current.map((item) => item.id === requestId ? { ...item, status: decision } : item));
    toast.success(decision === "approved" ? "Admin access granted." : "Request rejected.");
  }

  const pending = requests.filter((request) => request.status === "pending");
  return <section className="admin-control-grid">
    <form className="admin-control-card" onSubmit={saveDeadline}>
      <div className="admin-control-title"><CalendarClock /><div><span>RECRUITMENT CONTROL</span><h2>Application deadline</h2></div></div>
      <p>The public countdown and server submission lock use this exact time.</p>
      <label htmlFor="deadline">Deadline in your local timezone</label>
      <div className="admin-deadline-row"><input id="deadline" type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} required /><button disabled={busy === "deadline"}>Save deadline</button></div>
    </form>
    <div className="admin-control-card">
      <div className="admin-control-title"><ShieldCheck /><div><span>ACCESS CONTROL</span><h2>Admin requests <b>{pending.length}</b></h2></div></div>
      {!pending.length ? <p>No pending requests.</p> : <div className="admin-request-list">{pending.map((request) => <article key={request.id}><div><strong>{request.name || "Unnamed user"}</strong><span>{request.email}</span></div><div><button disabled={busy === request.id} onClick={() => review(request.id, "approved")}><ShieldCheck /> Approve</button><button className="reject" disabled={busy === request.id} onClick={() => review(request.id, "rejected")}><ShieldX /> Reject</button></div></article>)}</div>}
    </div>
  </section>;
}
