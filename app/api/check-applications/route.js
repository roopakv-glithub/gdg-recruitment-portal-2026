import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { getServerSession } from "@/lib/server-auth";
import { normalizeDepartmentName } from "@/lib/department-names";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const email = session.user.email.trim().toLowerCase();

    const db = await connect();
    const snapshot = await db
      .collection("formData")
      .where("Email", "==", email)
      .select("Department")
      .get();
    const submittedDepartments = snapshot.docs.map((doc) => normalizeDepartmentName(doc.data().Department)).filter(Boolean);

    return NextResponse.json({ count: snapshot.size, submittedDepartments }, { status: 200 });
  } catch (error) {
    console.error("Error checking applications:", error);
    return NextResponse.json(
      {
        message: "Internal server error inside check-applications dir",
      },
      { status: 500 }
    );
  }
}
