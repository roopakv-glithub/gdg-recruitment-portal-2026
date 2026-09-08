"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Layers3, TrendingUp, UsersRound } from "lucide-react";

const COLORS = ["#4285f4", "#ea4335", "#fbbc04", "#34a853"];

export default function AdminStats({ applicants }) {
  const stats = useMemo(() => {
    const departments = new Map();
    const uniqueEmails = new Set();
    let shortlisted = 0;
    for (const applicant of applicants) {
      const department = applicant.Department || "Unassigned";
      const current = departments.get(department) || { name: department, total: 0, shortlisted: 0 };
      current.total += 1;
      if (applicant.shortlisted) { current.shortlisted += 1; shortlisted += 1; }
      departments.set(department, current);
      if (applicant.Email) uniqueEmails.add(String(applicant.Email).toLowerCase());
    }
    const distribution = [...departments.values()].sort((a, b) => b.total - a.total);
    let accumulated = 0;
    const slices = distribution.map((item, index) => {
      const start = applicants.length ? accumulated / applicants.length * 100 : 0;
      accumulated += item.total;
      const end = applicants.length ? accumulated / applicants.length * 100 : 0;
      return `${COLORS[index % COLORS.length]} ${start}% ${end}%`;
    });
    return { total: applicants.length, candidates: uniqueEmails.size, shortlisted, rate: applicants.length ? Math.round(shortlisted / applicants.length * 100) : 0, distribution, chart: slices.length ? `conic-gradient(${slices.join(",")})` : "conic-gradient(#263149 0 100%)" };
  }, [applicants]);

  const cards = [
    ["Applications", stats.total, Layers3, "#4285f4"],
    ["Candidates", stats.candidates, UsersRound, "#34a853"],
    ["Shortlisted", stats.shortlisted, CheckCircle2, "#fbbc04"],
    ["Selection rate", `${stats.rate}%`, TrendingUp, "#ea4335"],
  ];

  return <motion.section className="admin-analytics" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .07 } } }}>
    <div className="admin-stat-cards">{cards.map(([label, value, Icon, color]) => <motion.article key={label} style={{ "--stat-color": color }} variants={{ hidden: { opacity: 0, y: 18, rotateX: -8 }, visible: { opacity: 1, y: 0, rotateX: 0 } }} transition={{ type: "spring", stiffness: 220, damping: 22 }}><span><Icon /></span><div><p>{label}</p><strong>{value}</strong></div></motion.article>)}</div>
    <div className="admin-chart-grid">
      <motion.article className="admin-chart-card" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .18 }}>
        <header><div><span>APPLICATION MIX</span><h2>Department distribution</h2></div><b>{stats.total} total</b></header>
        <div className="donut-layout"><div className="admin-donut" style={{ "--donut": stats.chart }} role="img" aria-label={`Applications by department: ${stats.distribution.map((item) => `${item.name} ${item.total}`).join(", ")}`}><div><strong>{stats.distribution.length}</strong><span>active depts</span></div></div><div className="donut-legend">{stats.distribution.slice(0, 8).map((item, index) => <div key={item.name}><i style={{ background: COLORS[index % COLORS.length] }} /><span>{item.name}</span><strong>{item.total}</strong></div>)}</div></div>
      </motion.article>
      <motion.article className="admin-chart-card" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .24 }}>
        <header><div><span>SHORTLIST PROGRESS</span><h2>Selections by department</h2></div><b>{stats.shortlisted} selected</b></header>
        <div className="admin-bars">{stats.distribution.slice(0, 8).map((item, index) => <div className="admin-bar-row" key={item.name}><div><span>{item.name}</span><b>{item.shortlisted}/{item.total}</b></div><div className="admin-bar-track"><motion.i style={{ "--bar-color": COLORS[index % COLORS.length] }} initial={{ width: 0 }} animate={{ width: `${item.total ? item.shortlisted / item.total * 100 : 0}%` }} transition={{ delay: .3 + index * .05, duration: .65, ease: [0.22,1,0.36,1] }} /></div></div>)}{!stats.distribution.length && <p className="admin-empty-chart">Charts will appear after the first application.</p>}</div>
      </motion.article>
    </div>
  </motion.section>;
}
