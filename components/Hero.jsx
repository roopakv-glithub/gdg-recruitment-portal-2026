import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="recruitment-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">Recruitment 2026</h1>
        <h2>Ready to make your mark?</h2>
        <p>Join our departments and work on real-world projects.<br className="hero-line-break" /> Your journey starts here.</p>
        <Link href="/departments" className="join-button">Join us <ArrowRight aria-hidden="true" /></Link>
      </div>
      <Image className="hero-illustration theme-dark-image" src="/assets/reference-team.png" alt="Developers collaborating around a coding board" width={590} height={331} priority sizes="(max-width: 760px) 90vw, 46vw" />
      <Image className="hero-illustration theme-light-image" src="/assets/reference-team-light.png" alt="Developers collaborating around a coding board" width={552} height={275} sizes="(max-width: 760px) 90vw, 46vw" />
    </section>
  );
}
