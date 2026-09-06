import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { getServerSession } from "@/lib/server-auth";
import { demoMode } from "@/lib/demo";
import { normalizeDepartmentName } from "@/lib/department-names";
import { reviews } from "@/constants";

export const dynamic = "force-dynamic";

const MAX_APPLICATIONS = 2;
const MAX_ANSWER_LENGTH = 5000;
const departmentsByNormalizedName = new Map(
  reviews.map((department) => [normalizeDepartmentName(department.name), department.name]),
);

const text = (value, maxLength = 200) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

function validateSubmission(payload) {
  const normalizedDepartment = normalizeDepartmentName(payload?.Department);
  const Department = departmentsByNormalizedName.get(normalizedDepartment);
  if (!Department) return { error: "Please select a valid department" };

  const Name = text(payload.Name, 120);
  const RegistrationNumber = text(payload.RegistrationNumber, 9).toUpperCase();
  const Phone = text(payload.Phone, 10);
  if (!Name) return { error: "Full name is required" };
  if (!/^\d{2}[A-Z]{3}\d{4}$/.test(RegistrationNumber)) {
    return { error: "Registration number must look like 25BCE5612" };
  }
  if (!/^\d{10}$/.test(Phone)) return { error: "Enter a valid 10-digit phone number" };

  const rawQuestions = payload.Questions;
  if (!rawQuestions || typeof rawQuestions !== "object" || Array.isArray(rawQuestions)) {
    return { error: "Invalid department answers" };
  }

  const Questions = {};
  let totalAnswerLength = 0;
  for (const [question, answer] of Object.entries(rawQuestions)) {
    if (typeof question !== "string" || typeof answer !== "string") continue;
    const cleanQuestion = text(question, 500);
    const cleanAnswer = text(answer, MAX_ANSWER_LENGTH);
    totalAnswerLength += cleanAnswer.length;
    if (cleanQuestion) Questions[cleanQuestion] = cleanAnswer;
  }
  if (totalAnswerLength > 25000) return { error: "Your answers are too long" };

  return {
    data: {
      Name,
      RegistrationNumber,
      Phone,
      Gender: text(payload.Gender, 30),
      "Year of Study": text(payload["Year of Study"], 10),
      "Why do you want to join Organization Name?": text(
        payload["Why do you want to join Organization Name?"],
        MAX_ANSWER_LENGTH,
      ),
      Department,
      Questions,
    },
  };
}

function deadlineHasPassed() {
  const configuredDeadline = process.env.APPLICATION_DEADLINE;
  if (!configuredDeadline) return false;
  const deadline = new Date(configuredDeadline);
  return !Number.isNaN(deadline.valueOf()) && Date.now() > deadline.valueOf();
}

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    if (!demoMode && deadlineHasPassed()) {
      return NextResponse.json({ message: "The submission deadline has passed" }, { status: 403 });
    }

    const validation = validateSubmission(await req.json());
    if (validation.error) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }

    const db = await connect();
    const userEmail = session.user.email.trim().toLowerCase();
    const submission = {
      ...validation.data,
      Email: userEmail,
      shortlisted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const collection = db.collection("formData");

    if (demoMode) {
      const existing = await collection.where("Email", "==", userEmail).get();
      const departments = existing.docs.map((doc) => normalizeDepartmentName(doc.data().Department));
      if (departments.includes(normalizeDepartmentName(submission.Department))) {
        return NextResponse.json({ message: `You have already applied for ${submission.Department}` }, { status: 409 });
      }
      if (existing.size >= MAX_APPLICATIONS) {
        return NextResponse.json({ message: "You can submit up to two applications" }, { status: 409 });
      }
      await collection.add(submission);
    } else {
      const userKey = createHash("sha256").update(userEmail).digest("hex");
      const applicationKey = createHash("sha256")
        .update(`${userEmail}\0${normalizeDepartmentName(submission.Department)}`)
        .digest("hex");
      const stateRef = db.collection("applicationUsers").doc(userKey);
      const applicationRef = collection.doc(applicationKey);

      await db.runTransaction(async (transaction) => {
        const [stateSnapshot, applicationSnapshot] = await Promise.all([
          transaction.get(stateRef),
          transaction.get(applicationRef),
        ]);
        if (applicationSnapshot.exists) {
          const error = new Error(`You have already applied for ${submission.Department}`);
          error.code = "ALREADY_SUBMITTED";
          throw error;
        }

        const departments = Array.isArray(stateSnapshot.data()?.departments)
          ? stateSnapshot.data().departments
          : [];
        if (departments.length >= MAX_APPLICATIONS) {
          const error = new Error("You can submit up to two applications");
          error.code = "LIMIT_REACHED";
          throw error;
        }

        transaction.set(applicationRef, submission);
        transaction.set(stateRef, {
          email: userEmail,
          departments: [...departments, submission.Department],
          count: departments.length + 1,
          updatedAt: new Date(),
        }, { merge: true });
      });
    }

    return NextResponse.json({ message: "Form submitted successfully!" });
  } catch (error) {
    if (error?.code === "ALREADY_SUBMITTED" || error?.code === "LIMIT_REACHED") {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    console.error("Form submission error:", error);
    return NextResponse.json({ message: "Error submitting form" }, { status: 500 });
  }
}
