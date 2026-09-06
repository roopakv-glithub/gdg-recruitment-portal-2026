import React from "react";
import NavBar from "@/components/NavBar";
import { connect, serializeFirestoreData } from "@/lib/db";
import AdminContent from "@/components/AdminContent";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdmin();
  if (!session) redirect("/auth/signin?next=/admin");

  const db = await connect();
  const snapshot = await db.collection("formData").get();
  const applicants = snapshot.docs.map((doc) => ({
    id: doc.id,
    _id: doc.id,
    ...serializeFirestoreData(doc.data()),
  }));

  return (
    <main>
      <NavBar />
      <AdminContent applicants={applicants} />
    </main>
  );
}
