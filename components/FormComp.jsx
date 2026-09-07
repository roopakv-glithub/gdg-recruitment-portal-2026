"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, ShieldCheck, Save, UserRound } from "lucide-react";
import { QuestionnaireData } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { useSubmissions } from "@/components/SubmissionsProvider";
import { demoMode } from "@/lib/demo";

const questionsFor = name => (QuestionnaireData.find(item => item.department === name)?.questions || []).map(q => typeof q === "string" ? {name:q} : q);
const reasonQuestion = "Why do you want to join Organization Name?";
const emptyValues = {Name:"",RegistrationNumber:"",Phone:"",Gender:"","Year of Study":"",[reasonQuestion]:""};

export default function FormComp({ dept1, dept2 }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const departments = useMemo(() => [dept1,dept2].filter(Boolean),[dept1,dept2]);
  const { submittedDepartments, isLoadingSubmissions, markDepartmentsSubmitted } = useSubmissions();
  const [values,setValues] = useState(emptyValues);
  const [answers,setAnswers] = useState({});
  const [ready,setReady] = useState(false);
  const [submitting,setSubmitting] = useState(false);
  const [error,setError] = useState("");
  const [success,setSuccess] = useState(false);
  const [draftSaved,setDraftSaved] = useState(false);
  const draftKey = user?.email ? `recruitment-application:${user.email}:${departments.map(d=>d.id).join("|")}` : null;
  useEffect(() => {
    if (!draftKey) return;
    setReady(false);
    try {
      const draft = JSON.parse(localStorage.getItem(draftKey) || "null");
      setValues({...emptyValues,Name:user.name || "",...draft?.values});
      setAnswers(draft?.answers || {});
    } catch { setValues({...emptyValues,Name:user.name || ""}); setAnswers({}); }
    setReady(true);
  },[draftKey,user?.name]);
  useEffect(() => {
    if (!ready || !draftKey || success) return;
    try { localStorage.setItem(draftKey,JSON.stringify({values,answers})); setDraftSaved(true); } catch { setDraftSaved(false); }
  },[values,answers,ready,draftKey,success]);
  const pending = departments.filter(d => !submittedDepartments.includes(d.name));
  const update = e => setValues(current => ({...current,[e.target.name]:e.target.value}));
  async function submit(e) {
    e.preventDefault();
    if (submitting || !pending.length) return;
    setSubmitting(true); setError("");
    const completed = [];
    try {
      // Save one at a time so the server's two-application limit sees each result.
      for (const department of pending) {
        const Questions = Object.fromEntries(questionsFor(department.name).map(q => [q.name, q.name === reasonQuestion ? values[reasonQuestion] : answers[department.id]?.[q.name] || ""]));
        const response = await fetch("/api/submit-form",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...values,Email:user.email,Department:department.name,Questions})});
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || `Could not submit ${department.name}.`);
        completed.push(department.name);
        markDepartmentsSubmitted([department.name]);
      }
      setSuccess(true);
      try { localStorage.removeItem(draftKey); } catch {}
    } catch (err) { setError(`${completed.length ? `Saved ${completed.join(", ")}. ` : ""}${err.message} Your remaining answers are kept for retrying.`); }
    finally { setSubmitting(false); }
  }
  if (success || (ready && pending.length === 0)) return <section className="journey-panel application-success"><CheckCircle2 size={52} /><span className="journey-eyebrow">STEP 03 · COMPLETE</span><h2>{success ? "You’re all set." : "Application already submitted."}</h2><p>Your applications for {departments.map(d=>d.name).join(" and ")} have been submitted and are locked from editing.</p>{demoMode && <p>This is a demo submission; it resets when the local server restarts.</p>}<div className="application-success-actions"><Link className="journey-primary" href="/applications"><ClipboardList size={18} /> View submitted applications</Link><Link className="journey-secondary" href="/departments"><ArrowLeft size={18} /> Back to departments</Link></div></section>;
  if (!ready || isLoadingSubmissions) return <div className="journey-panel" role="status">Preparing your saved answers…</div>;
  return <div className="application-layout"><form className="application-form" onSubmit={submit}>
    {error && <div role="alert" className="journey-alert">{error}</div>}
    <fieldset disabled={submitting} className="journey-panel"><legend className="sr-only">About you</legend><div className="form-section-heading"><span className="section-icon"><UserRound size={23} /></span><div><h2>About you</h2><p>Let’s start with the basics. Fields marked * are required.</p></div><span className="section-number">01</span></div>
      <div className="personal-fields">
        <label>Full name *<input name="Name" value={values.Name} onChange={update} placeholder="Jane Doe" autoComplete="name" required /></label>
        <label>Registration number *<input name="RegistrationNumber" value={values.RegistrationNumber} onChange={update} placeholder="25BCE5612" pattern="[0-9]{2}[A-Z]{3}[0-9]{4}" title="Two digits, three uppercase letters and four digits, e.g. 25BCE5612" required /></label>
        <label>Email address<input value={user?.email || ""} readOnly type="email" /><small>Connected to your signed-in account.</small></label>
        <label>Phone (WhatsApp) *<input name="Phone" value={values.Phone} onChange={update} placeholder="9876543210" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} title="Enter a 10-digit phone number" required /></label>
        <label>Gender<select name="Gender" value={values.Gender} onChange={update}><option value="">Select gender (optional)</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select></label>
        <label>Year of study<select name="Year of Study" value={values["Year of Study"]} onChange={update}><option value="">Select year (optional)</option>{[1,2,3,4,5].map(n=><option key={n} value={String(n)}>Year {n}</option>)}</select></label>
      </div>
      <label className="long-field">{reasonQuestion}<textarea name={reasonQuestion} value={values[reasonQuestion]} onChange={update} rows={4} placeholder="Tell us what excites you about joining the community." /></label>
    </fieldset>
    {departments.map((department,index) => <fieldset className="journey-panel department-questions" key={department.id} disabled={submitting || submittedDepartments.includes(department.name)}><legend className="sr-only">{department.name} questions</legend><div className="form-section-heading"><div><span className="journey-eyebrow">DEPARTMENT QUESTIONS</span><h2>{department.name}</h2><p>{submittedDepartments.includes(department.name) ? "Already submitted. Your answers have been saved." : "Share your interests, experience, and ideas. These questions are optional."}</p></div><span className="section-number">0{index+2}</span></div>
      {questionsFor(department.name).filter(q=>q.name!==reasonQuestion).map((q,questionIndex) => { const props = {value:answers[department.id]?.[q.name] || "",placeholder:q.placeholder || "Write your answer…",onChange:e=>setAnswers(current=>({...current,[department.id]:{...current[department.id],[q.name]:e.target.value}}))}; return <label className="question-field" key={q.name}><span className="question-label"><b>{String(questionIndex+1).padStart(2,"0")}</b>{q.name}</span>{q.type === "short-text" ? <input {...props} /> : <textarea {...props} rows={4} />}</label>; })}
      {!questionsFor(department.name).length && <p>No additional questions for this department.</p>}
    </fieldset>)}
    <div className="form-submit-row"><p><ShieldCheck size={18} /> Review your answers before submitting.</p><button className="journey-primary" disabled={submitting || !pending.length} type="submit">{submitting ? "Submitting…" : `Submit ${pending.length > 1 ? "applications" : "application"}`}<ArrowRight size={18} /></button></div>
  </form><aside className="application-sidebar"><div className="journey-panel"><span className="journey-eyebrow">YOUR APPLICATION</span><h3>A little preparation goes a long way.</h3><ul><li>Complete your personal details.</li><li>Answer the questions for each department.</li><li>Review and submit when you’re ready.</li></ul><div className="draft-status" role="status"><Save size={17} />{draftSaved ? "Draft saved on this device" : "Draft saving unavailable"}</div><Link href="/departments">Change departments <ArrowRight size={15} /></Link></div>{demoMode && <div className="demo-note"><strong>Demo mode</strong><p>You can try the application without Firebase. Submissions are temporary.</p></div>}</aside></div>;
}
