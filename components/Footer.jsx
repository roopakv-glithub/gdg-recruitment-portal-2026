import Link from "next/link";

export default function Footer() {
  return (
    <footer className="portal-footer">
      <p>Organization <span className="footer-dot">•</span> Recruitment Portal 2026</p>
      <nav aria-label="Footer navigation"><Link href="/">Home</Link><span className="footer-divider" aria-hidden="true" /><Link href="/departments">Departments</Link></nav>
    </footer>
  );
}
