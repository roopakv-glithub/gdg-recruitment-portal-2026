"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Search, Plus, UserRound } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { reviews } from "@/constants";
import { useSubmissions } from "@/components/SubmissionsProvider";
import Image from "next/image";

const googleColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
const reviewById = new Map(reviews.map((department) => [department.id, department]));
const reviewIndex = new Map(reviews.map((department, index) => [department.id, index]));

const gridMotion = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
};

const cardMotion = {
  hidden: { opacity: 0, y: 22, scale: 0.975 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24, mass: 0.75 },
  },
  exit: { opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.16 } },
};

function setCardPerspective(event) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const card = event.currentTarget;
  card.classList.add("is-pointer-active");
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  card.style.setProperty("--pointer-x", `${x * 100}%`);
  card.style.setProperty("--pointer-y", `${y * 100}%`);
  card.style.setProperty("--tilt-x", `${(0.5 - y) * 8}deg`);
  card.style.setProperty("--tilt-y", `${(x - 0.5) * 8}deg`);
  card.style.setProperty("--accent-origin", x < 0.5 ? "left" : "right");
}

function resetCardPerspective(event) {
  const card = event.currentTarget;
  card.classList.remove("is-pointer-active");
  card.style.setProperty("--pointer-x", "50%");
  card.style.setProperty("--pointer-y", "50%");
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
}

function DepartmentCard({ department, active, submitted, disabled, onToggle }) {
  const index = reviewIndex.get(department.id);
  const Icon = department.icon;
  const applicationHref = submitted
    ? `/applications?department=${encodeURIComponent(department.name)}`
    : `/join/${department.id}`;

  return (
    <motion.article
      layout
      variants={cardMotion}
      exit="exit"
      className={`department-card ${active ? "is-selected" : ""} ${submitted ? "is-submitted" : ""}`}
      style={{ "--department-color": googleColors[index % googleColors.length] }}
      onPointerDown={setCardPerspective}
      onPointerUp={resetCardPerspective}
      onPointerCancel={resetCardPerspective}
      onPointerEnter={setCardPerspective}
      onPointerMove={setCardPerspective}
      onPointerLeave={resetCardPerspective}
    >
      <span className="department-card-glow" aria-hidden="true" />
      <div className="department-card-top">
        <span className="department-icon"><Icon width={27} height={27} /></span>
        <span className="department-number">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>{department.name}</h3>
      <p>{department.description}</p>
      <div className="department-leads">
        {department.studentLeads.map((lead) => (
          <div className="department-lead" key={lead.name}>
            <UserRound size={14} aria-hidden="true" />
            <span>{lead.role} · {lead.name}</span>
          </div>
        ))}
      </div>
      <div className="department-card-actions">
        <Link href={applicationHref} aria-label={`${submitted ? "View submitted response" : "View application"} for ${department.name}`}>
          {submitted ? "View response" : "View application"} <ArrowRight size={16} />
        </Link>
        <button type="button" disabled={disabled} aria-pressed={active} aria-label={`${active ? "Remove" : "Select"} ${department.name}`} onClick={() => onToggle(department.id)}>
          <motion.span className="department-action-icon" key={active || submitted ? "checked" : "add"} initial={{ scale: 0.45, rotate: -35 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 520, damping: 24 }}>
            {active || submitted ? <Check size={17} /> : <Plus size={17} />}
          </motion.span>
          {submitted ? "Submitted" : active ? "Selected" : "Select"}
        </button>
      </div>
    </motion.article>
  );
}

export default function DepartmentsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const { submittedDepartments, isLoadingSubmissions } = useSubmissions();
  const remaining = Math.max(0, 2 - submittedDepartments.length);
  const chosen = selected.filter((id) => !submittedDepartments.includes(reviewById.get(id)?.name)).slice(0, remaining);
  const normalizedQuery = query.trim().toLowerCase();
  const visible = reviews.filter((department) => `${department.name} ${department.description}`.toLowerCase().includes(normalizedQuery));

  function toggle(id) {
    setSelected((current) => {
      const valid = current.filter((item) => !submittedDepartments.includes(reviewById.get(item)?.name)).slice(0, remaining);
      return valid.includes(id) ? valid.filter((item) => item !== id) : [...valid, id];
    });
  }

  return (
    <MotionConfig reducedMotion="user">
    <div className="journey-page">
      <NavBar />
      <main className="journey-container">
        <div className="journey-breadcrumb"><Link href="/">Home</Link><span>/</span><span>Departments</span></div>
        <motion.header className="journey-intro journey-intro--departments" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <span className="journey-eyebrow">RECRUITMENT 2026 · STEP 01</span>
          <h1>Find where you belong.</h1>
          <p>Explore our departments and choose where you want to make your mark.<br />Select up to two departments to start your application.</p>
          <Image className="department-hero-art theme-dark-image" src="/assets/departments-hero-dark-v3.png" alt="Students fitting department puzzle pieces together" width={1842} height={854} priority sizes="(max-width: 760px) 100vw, 55vw" />
          <Image className="department-hero-art theme-light-image" src="/assets/departments-hero-light.png" alt="Students fitting department puzzle pieces together" width={670} height={282} priority sizes="(max-width: 760px) 100vw, 55vw" />
          <div className="journey-steps"><strong><span>1</span> Choose departments</strong><i /><span><b>2</b> Your application</span><i /><span><b>3</b> Submit</span></div>
        </motion.header>

        <div className="catalog-toolbar">
          <div><h2>Explore departments <span className="count-pill">{reviews.length}</span></h2><p>Different interests. One community.</p></div>
          <label className="department-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search departments" aria-label="Search departments" /></label>
        </div>

        {remaining === 0 ? <div className="journey-alert" role="status">You’ve submitted both applications. Your completed departments are marked below.</div> : null}

        <motion.div className="department-grid" variants={gridMotion} initial="hidden" animate="visible">
          <AnimatePresence mode="popLayout">
            {visible.map((department) => {
              const active = chosen.includes(department.id);
              const submitted = submittedDepartments.includes(department.name);
              const disabled = submitted || isLoadingSubmissions || (!active && chosen.length >= remaining);
              return <DepartmentCard key={department.id} department={department} active={active} submitted={submitted} disabled={disabled} onToggle={toggle} />;
            })}
          </AnimatePresence>
        </motion.div>

        {!visible.length ? <div className="journey-empty"><Search /><h3>No departments found</h3><p>Try another name or clear your search.</p><button onClick={() => setQuery("")}>Clear search</button></div> : null}

        <motion.div className="selection-bar" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.45 }}>
          <div><span className="journey-eyebrow">YOUR SELECTION</span><p aria-live="polite"><strong>{chosen.length} / {remaining}</strong> {chosen.length ? chosen.map((id) => reviewById.get(id)?.name).join(" · ") : "Choose your departments to continue"}</p></div>
          <button className="journey-primary" disabled={!chosen.length || isLoadingSubmissions} onClick={() => router.push(`/join/${chosen.join("/")}`)}>Continue to application <ArrowRight size={19} /></button>
        </motion.div>
      </main>
      <Footer />
    </div>
    </MotionConfig>
  );
}
