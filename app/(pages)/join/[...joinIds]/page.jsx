"use client";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { reviews } from "@/constants";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FormComp from "@/components/FormComp";
import { authClient } from "@/lib/auth-client";

export default function JoinDepartmentPage() {
  const { data: session, isPending } = authClient.useSession();
  const routeParams = useParams();
  const ids = routeParams.joinIds || [];
  if (!ids.length || ids.length > 2 || new Set(ids).size !== ids.length || ids.some(id => !reviews.some(d => d.id === id))) notFound();
  const departments = ids.map(id => reviews.find(d => d.id === id));
  const returnTo = `/join/${ids.join("/")}`;
  return <div className="journey-page"><NavBar /><main className="journey-container application-container">
    <Link className="journey-back" href="/departments"><ArrowLeft size={17} /> Back to departments</Link>
    <header className="journey-intro"><span className="journey-eyebrow">RECRUITMENT 2026 · STEP 02</span><h1>Let’s get to know you.</h1><p>Tell us about yourself and what you’d like to bring to the team.</p><div className="application-tags">{departments.map(d => <span key={d.id}>{d.name}</span>)}</div></header>
    {isPending ? <div className="journey-panel" role="status">Loading your application…</div> : session?.user ? <FormComp dept1={departments[0]} dept2={departments[1]} /> : <section className="signin-gate journey-panel"><LockKeyhole size={32} /><h2>Your application is ready.</h2><p>Sign in to answer the questions for your selected departments. We’ll bring you straight back here.</p><Link className="journey-primary" href={`/auth/signin?next=${encodeURIComponent(returnTo)}`}>Sign in to continue <ArrowRight size={18} /></Link></section>}
  </main><Footer /></div>;
}
