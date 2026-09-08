import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DeadlineCountdown from "@/components/DeadlineCountdown";
import { getRecruitmentSettings } from "@/lib/recruitment-settings";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { deadline } = await getRecruitmentSettings();
  return (
    <div className="portal-home">
      <NavBar />
      <main className="portal-content">
        <section className="recruitment-notice" aria-labelledby="notice-title">
          <Image className="notice-icon theme-dark-image" src="/assets/reference-notice.png" alt="" width={112} height={113} priority />
          <Image className="notice-icon theme-light-image" src="/assets/reference-notice-light.png" alt="" width={112} height={113} priority />
          <div className="notice-copy">
            <h2 id="notice-title">Recruitment Notice</h2>
            <p>Welcome to the recruitment portal.</p>
            <ul>
              <li>Sign in with your email address to begin your application.</li>
              <li>You can apply to up to two departments.</li>
            </ul>
          </div>
        </section>
        <Hero />
        <DeadlineCountdown initialDeadline={deadline} />
        <section className="about-gdg" aria-labelledby="about-gdg-title">
          <div className="about-gdg-copy"><span>ABOUT GDG VITC</span><h2 id="about-gdg-title">Google Developer Groups on Campus, VIT Chennai</h2><p>GDG VITC brings VIT Chennai students together to learn technology by shipping it — practical sessions, team projects, hackathons, and events across <strong>12 departments</strong> guided by <strong>16 student leads</strong>.</p><Link href="/departments">Explore departments <ArrowRight aria-hidden="true" /></Link></div>
          <div className="about-stats" aria-label="Recruitment facts"><div><strong>12</strong><span>Departments</span></div><div><strong>16</strong><span>Student leads</span></div><div><strong>2</strong><span>Applications max</span></div><div><strong>2026</strong><span>Recruitment</span></div></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
