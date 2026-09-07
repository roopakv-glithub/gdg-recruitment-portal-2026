import { NextResponse } from "next/server";
import { connect, serializeFirestoreData } from "@/lib/db";
import { getServerSession } from "@/lib/server-auth";

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
    const snapshot = await db.collection("formData").where("Email", "==", email).get();
    const data = snapshot.docs.map((doc) => {
      const stored = serializeFirestoreData(doc.data());
      return {
        id: doc.id,
        Name: stored.Name || "",
        RegistrationNumber: stored.RegistrationNumber || "",
        Email: email,
        Phone: stored.Phone || "",
        Gender: stored.Gender || "",
        "Year of Study": stored["Year of Study"] || "",
        "Why do you want to join Organization Name?": stored["Why do you want to join Organization Name?"] || "",
        Department: stored.Department || "",
        Questions: stored.Questions && typeof stored.Questions === "object" ? stored.Questions : {},
        createdAt: stored.createdAt || null,
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error loading applications:", error);
    return NextResponse.json(
      {
        message:
          "Could not load your applications",
      },
      { status: 500 }
    );
  }
}
