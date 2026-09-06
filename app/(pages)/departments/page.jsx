"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Search, Plus, UserRound } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { reviews } from "@/constants";
import { useSubmissions } from "@/components/SubmissionsProvider";

const googleColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

export default function DepartmentsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const { submittedDepartments, isLoadingSubmissions } = useSubmissions();
  const remaining = Math.max(0, 2 - submittedDepartments.length);
  const chosen = selected.filter(id => !submittedDepartments.includes(reviews.find(d => d.id === id)?.name)).slice(0, remaining);
  const visible = reviews.filter(d => `${d.name} ${d.description}`.toLowerCase().includes(query.toLowerCase()));
  function toggle(id) { setSelected(chosen.includes(id) ? chosen.filter(item => item !== id) : [...chosen, id]); }
  function setAccentOrigin(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const origin = event.clientX - bounds.left < bounds.width / 2 ? "left" : "right";
    event.currentTarget.style.setProperty("--accent-origin", origin);
  }
  function tiltCard(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${vertical * -7}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${horizontal * 7}deg`);
  }
  function resetCardTilt(event) {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }
  return <div className="journey-page"><NavBar /><main className="journey-container">
    <div className="journey-breadcrumb"><Link href="/">Home</Link><span>/</span><span>Departments</span></div>
    <header className="journey-intro journey-intro--departments"><span className="journey-eyebrow">RECRUITMENT 2026 · STEP 01</span><h1>Find where you belong.</h1><p>Explore our departments and choose where you want to make your mark.<br />Select up to two departments to start your application.</p><img className="department-hero-art theme-dark-image" src="/assets/departments-hero-dark-v3.png" alt="Students fitting department puzzle pieces together" width="1842" height="854" fetchPriority="high" /><img className="department-hero-art theme-light-image" src="/assets/departments-hero-light.png" alt="Students fitting department puzzle pieces together" width="670" height="282" fetchPriority="high" /><div className="journey-steps"><strong><span>1</span> Choose departments</strong><i /><span><b>2</b> Your application</span><i /><span><b>3</b> Submit</span></div></header>
    <div className="catalog-toolbar"><div><h2>Explore departments <span className="count-pill">{reviews.length}</span></h2><p>Different interests. One community.</p></div><label className="department-search"><Search size={19} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search departments" aria-label="Search departments" /></label></div>
    {remaining === 0 && <div className="journey-alert" role="status">You’ve submitted both applications. Your completed departments are marked below.</div>}
    <div className="department-grid">{visible.map((department) => {
      const index = reviews.findIndex(item => item.id === department.id);
      const Icon = department.icon;
      const active = chosen.includes(department.id);
      const submitted = submittedDepartments.includes(department.name);
      const disabled = submitted || isLoadingSubmissions || (!active && chosen.length >= remaining);
      return <article key={department.id} className={`department-card ${active ? "is-selected" : ""} ${submitted ? "is-submitted" : ""}`} style={{"--department-color":googleColors[index % googleColors.length]}} onPointerEnter={setAccentOrigin} onPointerMove={tiltCard} onPointerLeave={resetCardTilt}>
        <div className="department-card-top"><span className="department-icon"><Icon width={27} height={27} /></span><span className="department-number">{String(index + 1).padStart(2,"0")}</span></div>
        <h3>{department.name}</h3><p>{department.description}</p>
        <div className="department-leads">{department.studentLeads.map(lead => <div className="department-lead" key={lead.name}><UserRound size={14} aria-hidden="true" /><span>{lead.role} · {lead.name}</span></div>)}</div>
        <div className="department-card-actions"><Link href={`/join/${department.id}`} aria-label={`View application for ${department.name}`}>View application <ArrowRight size={16} /></Link><button type="button" disabled={disabled} aria-pressed={active} aria-label={`${active ? "Remove" : "Select"} ${department.name}`} onClick={() => toggle(department.id)}>{active || submitted ? <Check size={17} /> : <Plus size={17} />}{submitted ? "Submitted" : active ? "Selected" : "Select"}</button></div>
      </article>;
    })}</div>
    {!visible.length && <div className="journey-empty"><Search /><h3>No departments found</h3><p>Try another name or clear your search.</p><button onClick={() => setQuery("")}>Clear search</button></div>}
    <div className="selection-bar"><div><span className="journey-eyebrow">YOUR SELECTION</span><p aria-live="polite"><strong>{chosen.length} / {remaining}</strong> {chosen.length ? chosen.map(id => reviews.find(d => d.id === id)?.name).join(" · ") : "Choose your departments to continue"}</p></div><button className="journey-primary" disabled={!chosen.length || isLoadingSubmissions} onClick={() => router.push(`/join/${chosen.join("/")}`)}>Continue to application <ArrowRight size={19} /></button></div>
  </main><Footer /></div>;
}
