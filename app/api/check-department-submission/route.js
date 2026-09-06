import { connect } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { normalizeDepartmentName } from "@/lib/department-names";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401 }
      );
    }

    const user = session.user;
    const userEmail = user.email;

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const department = searchParams.get("department");

    if (!email || !department) {
      return new Response(
        JSON.stringify({ error: "Missing email or department" }),
        { status: 400 }
      );
    }

    if (email !== userEmail) {
      return new Response(
        JSON.stringify({ error: "You can only check your own submissions" }),
        { status: 403 }
      );
    }

    const db = await connect();
    const snapshot = await db
      .collection("formData")
      .where("Email", "==", email)
      .get();

    const submitted = snapshot.docs.some(doc => normalizeDepartmentName(doc.data().Department) === normalizeDepartmentName(department));
    return new Response(JSON.stringify({ submitted }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error checking department submission:", error);
    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
    });
  }
}
