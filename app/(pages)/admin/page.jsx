import React from "react";
import NavBar from "@/components/NavBar";
import { connect, serializeFirestoreData } from "@/lib/db";
import AdminContent from "@/components/AdminContent";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { getRecruitmentSettings } from "@/lib/recruitment-settings";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdmin();
  if (!session) redirect("/auth/signin?next=/admin");

  const db = await connect();
  const [snapshot, requestsSnapshot, settings] = await Promise.all([
    db.collection("formData").get(),
    db.collection("adminAccessRequests").get(),
    getRecruitmentSettings(),
  ]);
  const applicants = snapshot.docs.map((doc) => ({
    id: doc.id,
    _id: doc.id,
    ...serializeFirestoreData(doc.data()),
  }));
  const accessRequests = requestsSnapshot.docs.map((doc) => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));

  return (
    <main className="admin-page">
      <NavBar />
      <AdminContent applicants={applicants} deadline={settings.deadline} accessRequests={accessRequests} />
    </main>
  );
}
