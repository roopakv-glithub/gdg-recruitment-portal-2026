import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { deliverQueuedEmail, emailDeliveryConfigured, processPendingEmails } from "@/lib/email-delivery";

export const dynamic = "force-dynamic";

function authorized(req) {
  const expected = process.env.EMAIL_WORKER_SECRET;
  const supplied = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !supplied) return false;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export async function POST(req) {
  if (!authorized(req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!emailDeliveryConfigured()) return NextResponse.json({ message: "Email provider is not configured" }, { status: 503 });

  try {
    const body = await req.json().catch(() => ({}));
    const db = await connect();
    if (typeof body.jobId === "string" && body.jobId.trim()) {
      const result = await deliverQueuedEmail(db, body.jobId.trim());
      return NextResponse.json({ result });
    }
    const results = await processPendingEmails(db, Number(body.limit) || 10);
    return NextResponse.json({ processed: results.length, results });
  } catch (error) {
    console.error("Email worker error:", error);
    return NextResponse.json({ message: "Email processing failed" }, { status: 500 });
  }
}
