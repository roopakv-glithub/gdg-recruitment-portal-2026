"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

const EMPTY = { days: 0, hours: 0, minutes: 0, seconds: 0, closed: false };

function calculate(deadline) {
  if (!deadline) return EMPTY;
  const remaining = new Date(deadline).getTime() - Date.now();
  if (!Number.isFinite(remaining) || remaining <= 0) return { ...EMPTY, closed: true };
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
    closed: false,
  };
}

export default function DeadlineCountdown({ initialDeadline = null }) {
  const [deadline, setDeadline] = useState(initialDeadline);
  const [time, setTime] = useState(EMPTY);

  useEffect(() => {
    if (initialDeadline) return;
    fetch("/api/recruitment-settings").then((response) => response.json()).then((data) => {
      if (data.deadline) setDeadline(data.deadline);
    }).catch(() => {});
  }, [initialDeadline]);

  useEffect(() => {
    setTime(calculate(deadline));
    if (!deadline) return;
    const timer = window.setInterval(() => setTime(calculate(deadline)), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  if (!deadline) return null;
  return <aside className="deadline-widget" aria-live="polite">
    <div className="deadline-heading"><Clock3 aria-hidden="true" /><div><span>APPLICATION DEADLINE</span><strong>{time.closed ? "Applications closed" : "Time remaining"}</strong></div></div>
    {!time.closed && <div className="deadline-units">
      {[[time.days,"Days"],[time.hours,"Hours"],[time.minutes,"Minutes"],[time.seconds,"Seconds"]].map(([value,label]) => <div key={label}><b>{String(value).padStart(2,"0")}</b><span>{label}</span></div>)}
    </div>}
    <time dateTime={deadline}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(deadline))} IST</time>
  </aside>;
}
