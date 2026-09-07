import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, FileLock2, Inbox } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { connect, serializeFirestoreData } from "@/lib/db";
import { getServerSession } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

const reasonQuestion = "Why do you want to join Organization Name?";

function cleanApplication(doc, email) {
  const stored = serializeFirestoreData(doc.data());
  return {
    id: doc.id,
    name: stored.Name || "Not provided",
    registrationNumber: stored.RegistrationNumber || "Not provided",
    email,
    phone: stored.Phone || "Not provided",
    gender: stored.Gender || "Not provided",
    year: stored["Year of Study"] || "Not provided",
    reason: stored[reasonQuestion] || "No response provided",
    department: stored.Department || "Department",
    questions: stored.Questions && typeof stored.Questions === "object" && !Array.isArray(stored.Questions)
      ? stored.Questions
      : {},
    createdAt: stored.createdAt || null,
  };
}

function formatDate(value) {
  if (!value) return "Submission date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Submission date unavailable";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(date);
}

function Response({ label, value, wide = false }) {
  return <div className={`submitted-response ${wide ? "submitted-response--wide" : ""}`}><dt>{label}</dt><dd>{String(value || "No response provided")}</dd></div>;
}

export default async function ApplicationsPage({ searchParams }) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect("/auth/signin?next=%2Fapplications");

  const email = session.user.email.trim().toLowerCase();
  const params = await searchParams;
  const requestedDepartment = typeof params?.department === "string" ? params.department : "";
  const db = await connect();
  const snapshot = await db.collection("formData").where("Email", "==", email).get();
  const applications = snapshot.docs
    .map((doc) => cleanApplication(doc, email))
    .sort((a, b) => Number(b.department === requestedDepartment) - Number(a.department === requestedDepartment));

  return <div className="journey-page">
    <NavBar />
    <main className="journey-container submitted-applications-page">
      <div className="journey-breadcrumb"><Link href="/">Home</Link><span>/</span><span>My applications</span></div>
      <header className="submitted-applications-header">
        <span className="journey-eyebrow">YOUR SUBMISSIONS</span>
        <h1>My applications</h1>
        <p>Review exactly what you submitted. Submitted responses are locked and cannot be edited.</p>
      </header>

      {applications.length ? <>
        <div className="read-only-banner" role="status"><FileLock2 aria-hidden="true" /><div><strong>Read-only applications</strong><span>Your responses are safely stored. Contact the recruitment team if a correction is essential.</span></div></div>
        <div className="submitted-applications-list">
          {applications.map((application, index) => {
            const answers = Object.entries(application.questions).filter(([question]) => question !== reasonQuestion);
            return <article className={`journey-panel submitted-application ${application.department === requestedDepartment ? "is-focused" : ""}`} key={application.id}>
              <div className="submitted-application-heading">
                <div><span className="journey-eyebrow">APPLICATION {String(index + 1).padStart(2, "0")}</span><h2>{application.department}</h2></div>
                <span className="submitted-status"><CheckCircle2 size={16} /> Submitted</span>
              </div>
              <div className="submitted-date"><CalendarDays size={16} /><span>{formatDate(application.createdAt)}</span></div>
              <dl className="submitted-response-grid">
                <Response label="Full name" value={application.name} />
                <Response label="Registration number" value={application.registrationNumber} />
                <Response label="Email address" value={application.email} />
                <Response label="Phone" value={application.phone} />
                <Response label="Gender" value={application.gender} />
                <Response label="Year of study" value={application.year === "Not provided" ? application.year : `Year ${application.year}`} />
                <Response label={reasonQuestion} value={application.reason} wide />
              </dl>
              <section className="submitted-answers">
                <h3>Department responses</h3>
                {answers.length ? <dl>{answers.map(([question, answer]) => <Response key={question} label={question} value={answer || "No response provided"} wide />)}</dl> : <p>No additional department questions were required.</p>}
              </section>
            </article>;
          })}
        </div>
      </> : <section className="journey-panel submitted-empty"><Inbox size={44} /><h2>No submitted applications yet</h2><p>Choose a department and complete the application form. Your submitted response will appear here.</p><Link className="journey-primary" href="/departments">Explore departments</Link></section>}
      <Link className="journey-back submitted-back" href="/departments"><ArrowLeft size={16} /> Back to departments</Link>
    </main>
    <Footer />
  </div>;
}
