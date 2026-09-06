import { connect, serializeFirestoreData } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const db = await connect();
    const snapshot = await db.collection("formData").get();
    const applicants = snapshot.docs.map((doc) => ({
      id: doc.id,
      _id: doc.id,
      ...serializeFirestoreData(doc.data()),
    }));

    return NextResponse.json({ applicants });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}
