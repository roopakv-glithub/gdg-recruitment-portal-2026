import "server-only";
import { connect } from "@/lib/db";

const SETTINGS_COLLECTION = "siteConfig";
const SETTINGS_DOCUMENT = "recruitment";

export async function getRecruitmentSettings() {
  const db = await connect();
  const snapshot = await db.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOCUMENT).get();
  const stored = snapshot.exists ? snapshot.data() : {};
  const deadline = stored?.deadline?.toDate?.() || (stored?.deadline ? new Date(stored.deadline) : null);
  const fallback = process.env.APPLICATION_DEADLINE ? new Date(process.env.APPLICATION_DEADLINE) : null;
  const selected = deadline && !Number.isNaN(deadline.valueOf()) ? deadline : fallback;
  return { deadline: selected && !Number.isNaN(selected.valueOf()) ? selected.toISOString() : null };
}

export async function setRecruitmentDeadline(deadline, adminEmail) {
  const db = await connect();
  await db.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOCUMENT).set({
    deadline,
    updatedAt: new Date(),
    updatedBy: adminEmail,
  }, { merge: true });
}
