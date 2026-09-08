import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import AdminAccessRequest from "@/components/AdminAccessRequest";
import { getServerSession, isAdminUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export default async function RequestAdminPage() {
  const session = await getServerSession();
  if (!session) redirect("/auth/signin?next=/admin/request");
  if (isAdminUser(session.user)) redirect("/admin");
  return <div className="journey-page"><NavBar /><AdminAccessRequest user={{ name: session.user.name, email: session.user.email }} /></div>;
}
