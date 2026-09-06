import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="recruitment-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">Recruitment 2026</h1>
        <h2>Ready to make your mark?</h2>
        <p>Join our departments and work on real-world projects.<br className="hero-line-break" /> Your journey starts here.</p>
        <Link href="/departments" className="join-button">Join us <ArrowRight aria-hidden="true" /></Link>
      </div>
      <img className="hero-illustration theme-dark-image" src="/assets/reference-team.png" alt="Developers collaborating around a coding board" width="590" height="331" fetchPriority="high" />
      <img className="hero-illustration theme-light-image" src="/assets/reference-team-light.png" alt="Developers collaborating around a coding board" width="552" height="275" />
    </section>
  );
}
