import { NextResponse } from "next/server";
import { getRecruitmentSettings, setRecruitmentDeadline } from "@/lib/recruitment-settings";
import { requireAdmin } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getRecruitmentSettings(), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Could not read recruitment settings:", error);
    return NextResponse.json({ deadline: null }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await request.json();
  const deadline = new Date(body?.deadline);
  if (!body?.deadline || Number.isNaN(deadline.valueOf())) {
    return NextResponse.json({ error: "Enter a valid deadline" }, { status: 400 });
  }
  await setRecruitmentDeadline(deadline, session.user.email);
  return NextResponse.json({ deadline: deadline.toISOString() });
}
