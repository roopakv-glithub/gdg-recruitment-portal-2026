import "server-only";
import nodemailer from "nodemailer";

const MAX_ATTEMPTS = 5;

export function emailDeliveryConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function transporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

export async function deliverQueuedEmail(db, jobId) {
  if (!emailDeliveryConfigured()) return { status: "queued" };
  const ref = db.collection("emailQueue").doc(jobId);
  let job = null;

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) return;
    const stored = snapshot.data();
    const leaseUntil = stored.processingLeaseUntil?.toDate?.() || (stored.processingLeaseUntil ? new Date(stored.processingLeaseUntil) : null);
    if (["sent", "cancelled"].includes(stored.status)) return;
    if (stored.status === "processing" && leaseUntil && leaseUntil > new Date()) return;
    const attempts = Number(stored.attempts || 0) + 1;
    if (attempts > MAX_ATTEMPTS) {
      transaction.set(ref, { status: "failed", lastError: "Maximum delivery attempts reached", updatedAt: new Date() }, { merge: true });
      return;
    }
    job = { ...stored, attempts };
    const now = new Date();
    transaction.set(ref, { status: "processing", attempts, processingLeaseUntil: new Date(now.getTime() + 2 * 60 * 1000), updatedAt: now }, { merge: true });
  });

  if (!job) {
    const snapshot = await ref.get();
    return { status: snapshot.data()?.status || "not-found" };
  }

  try {
    const info = await transporter().sendMail({
      from: process.env.EMAIL_FROM || `Recruitment Portal <${process.env.SMTP_USER}>`,
      to: job.recipientEmail,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.SMTP_USER,
      subject: job.subject,
      text: job.messageText,
      html: job.messageHtml || undefined,
    });
    await ref.set({ status: "sent", provider: "nodemailer-smtp", providerMessageId: info.messageId || null, sentAt: new Date(), updatedAt: new Date(), processingLeaseUntil: null, lastError: null }, { merge: true });
    return { status: "sent" };
  } catch (error) {
    await ref.set({ status: job.attempts >= MAX_ATTEMPTS ? "failed" : "pending", processingLeaseUntil: null, lastError: String(error.message || "Email delivery failed").slice(0, 500), updatedAt: new Date() }, { merge: true });
    console.error("Nodemailer delivery failed:", error.message);
    return { status: job.attempts >= MAX_ATTEMPTS ? "failed" : "queued" };
  }
}
