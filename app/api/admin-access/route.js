import { NextResponse } from "next/server";
import { connect, serializeFirestoreData } from "@/lib/db";
import { getServerSession, requireAdmin } from "@/lib/server-auth";
import { deliverQueuedEmail, emailDeliveryConfigured } from "@/lib/email-delivery";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const session = await getServerSession();
  if (!session?.user?.id || !session.user.email) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  if (session.user.role === "admin") return NextResponse.json({ error: "You already have admin access" }, { status: 409 });
  const reason = String((await request.json())?.reason || "").trim().slice(0, 500);
  if (reason.length < 10) return NextResponse.json({ error: "Briefly explain why you need access" }, { status: 400 });
  const db = await connect();
  const ref = db.collection("adminAccessRequests").doc(session.user.id);
  const existing = await ref.get();
  if (existing.exists && existing.data()?.status === "pending") return NextResponse.json({ status: "pending" });
  const requestData = { userId: session.user.id, name: session.user.name || "", email: session.user.email.toLowerCase(), reason, status: "pending", requestedAt: new Date(), reviewedAt: null, reviewedBy: null };
  await ref.set(requestData);

  const recipient = (process.env.ADMIN_EMAILS || "").split(",").map((value) => value.trim()).find(Boolean);
  if (recipient && emailDeliveryConfigured()) {
    const jobId = `admin-access-${session.user.id}-${Date.now()}`;
    await db.collection("emailQueue").doc(jobId).set({ recipientEmail: recipient, subject: "New Recruitment Portal admin-access request", messageText: `${requestData.name} (${requestData.email}) requested admin access.\n\nReason: ${reason}\n\nReview it in the admin panel.`, status: "pending", attempts: 0, createdAt: new Date(), updatedAt: new Date(), idempotencyKey: jobId });
    await deliverQueuedEmail(db, jobId);
  }
  return NextResponse.json({ status: "pending" });
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const db = await connect();
  const snapshot = await db.collection("adminAccessRequests").get();
  const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...serializeFirestoreData(doc.data()) })).sort((a,b) => String(b.requestedAt).localeCompare(String(a.requestedAt)));
  return NextResponse.json({ requests });
}

export async function PATCH(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { requestId, decision } = await request.json();
  if (!requestId || !["approved", "rejected"].includes(decision)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const db = await connect();
  const requestRef = db.collection("adminAccessRequests").doc(requestId);
  const requestSnapshot = await requestRef.get();
  if (!requestSnapshot.exists || requestSnapshot.data().status !== "pending") return NextResponse.json({ error: "Request is no longer pending" }, { status: 409 });
  if (decision === "approved") {
    const userSnapshot = await db.collection("user").where("id", "==", requestSnapshot.data().userId).limit(1).get();
    if (userSnapshot.empty) return NextResponse.json({ error: "Better Auth user was not found" }, { status: 404 });
    await userSnapshot.docs[0].ref.update({ role: "admin", updatedAt: new Date() });
  }
  await requestRef.update({ status: decision, reviewedAt: new Date(), reviewedBy: adminSession.user.email });
  return NextResponse.json({ status: decision });
}
