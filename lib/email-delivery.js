import "server-only";

const MAX_ATTEMPTS = 5;
const PROCESSING_LEASE_MS = 2 * 60 * 1000;

export function emailDeliveryConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

function asDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function selectionMessage(job) {
  const name = String(job.recipientName || "Applicant").trim();
  const department = String(job.department || "your selected department").trim();
  const safeName = escapeHtml(name);
  const safeDepartment = escapeHtml(department);
  const portalUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "https://gdg-recruitment-portal-2026.vercel.app";
  const applicationsUrl = `${portalUrl.replace(/\/$/, "")}/applications`;

  return {
    subject: `You have been selected for ${department}`,
    text: `Hi ${name},\n\nCongratulations! You have been selected for ${department} in Recruitment Portal 2026.\n\nYou can review your submitted application at ${applicationsUrl}.\n\nThe recruitment team will contact you with the next steps.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#202124;line-height:1.65"><div style="height:5px;border-radius:5px;background:linear-gradient(90deg,#4285f4 0 25%,#ea4335 25% 50%,#fbbc05 50% 75%,#34a853 75%)"></div><h1 style="font-size:26px;margin:30px 0 14px">Congratulations, ${safeName}!</h1><p>You have been selected for <strong>${safeDepartment}</strong> in Recruitment Portal 2026.</p><p>The recruitment team will contact you with the next steps.</p><p style="margin:28px 0"><a href="${escapeHtml(applicationsUrl)}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#2d5cf4;color:#fff;text-decoration:none;font-weight:600">View your application</a></p><p style="font-size:12px;color:#5f6368">This message was sent because your application was shortlisted.</p></div>`,
  };
}

async function claimEmailJob(db, jobId) {
  const ref = db.collection("emailQueue").doc(jobId);
  let claimed = null;
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) return;
    const job = snapshot.data();
    if (["sent", "cancelled"].includes(job.status)) return;

    const now = new Date();
    const leaseUntil = asDate(job.processingLeaseUntil);
    const nextAttemptAt = asDate(job.nextAttemptAt);
    if (job.status === "processing" && leaseUntil && leaseUntil > now) return;
    if (nextAttemptAt && nextAttemptAt > now) return;

    const attempts = Number(job.attempts || 0) + 1;
    if (attempts > MAX_ATTEMPTS) {
      transaction.set(ref, { status: "failed", updatedAt: now, lastError: "Maximum delivery attempts reached" }, { merge: true });
      return;
    }

    claimed = { id: snapshot.id, ...job, attempts };
    transaction.set(ref, {
      status: "processing",
      attempts,
      processingStartedAt: now,
      processingLeaseUntil: new Date(now.getTime() + PROCESSING_LEASE_MS),
      updatedAt: now,
    }, { merge: true });
  });
  return claimed;
}

export async function deliverQueuedEmail(db, jobId) {
  if (!emailDeliveryConfigured()) return { status: "queued", reason: "Email provider is not configured" };

  const job = await claimEmailJob(db, jobId);
  if (!job) {
    const snapshot = await db.collection("emailQueue").doc(jobId).get();
    return { status: snapshot.data()?.status || "not-found" };
  }

  const ref = db.collection("emailQueue").doc(jobId);
  if (!job.recipientEmail || job.type !== "shortlisted") {
    await ref.set({ status: "failed", lastError: "Invalid email job", updatedAt: new Date() }, { merge: true });
    return { status: "failed", reason: "Invalid email job" };
  }

  try {
    const message = selectionMessage(job);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `recruitment-${job.id}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [job.recipientEmail],
        reply_to: process.env.EMAIL_REPLY_TO || undefined,
        ...message,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result?.message || `Email provider returned ${response.status}`);
      error.retryable = response.status === 429 || response.status >= 500;
      throw error;
    }

    await ref.set({
      status: "sent",
      provider: "resend",
      providerMessageId: result.id || null,
      sentAt: new Date(),
      updatedAt: new Date(),
      processingLeaseUntil: null,
      lastError: null,
    }, { merge: true });
    return { status: "sent", providerMessageId: result.id || null };
  } catch (error) {
    const retryable = error.retryable !== false && job.attempts < MAX_ATTEMPTS;
    const delayMinutes = Math.min(60, 2 ** Math.max(0, job.attempts - 1));
    await ref.set({
      status: retryable ? "pending" : "failed",
      nextAttemptAt: retryable ? new Date(Date.now() + delayMinutes * 60 * 1000) : null,
      processingLeaseUntil: null,
      lastError: String(error.message || "Email delivery failed").slice(0, 500),
      updatedAt: new Date(),
    }, { merge: true });
    return { status: retryable ? "queued" : "failed", reason: "Email delivery failed" };
  }
}

export async function processPendingEmails(db, limit = 10) {
  const snapshot = await db.collection("emailQueue").where("status", "in", ["pending", "processing"]).limit(Math.min(Math.max(limit, 1), 25)).get();
  const results = [];
  for (const doc of snapshot.docs) {
    results.push({ jobId: doc.id, ...(await deliverQueuedEmail(db, doc.id)) });
  }
  return results;
}
