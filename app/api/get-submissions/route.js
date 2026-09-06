import { NextResponse } from "next/server";
import { connect, serializeFirestoreData } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const user = session.user;
    const userEmail = user.email;

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (email !== userEmail) {
      return NextResponse.json(
        { message: "You can only check your own applications" },
        { status: 403 }
      );
    }

    const db = await connect();
    const snapshot = await db.collection("formData").where("Email", "==", email).get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      _id: doc.id,
      ...serializeFirestoreData(doc.data()),
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error checking applications:", error);
    return NextResponse.json(
      {
        message:
          "Internal server error inside check-applications dir",
      },
      { status: 500 }
    );
  }
}
