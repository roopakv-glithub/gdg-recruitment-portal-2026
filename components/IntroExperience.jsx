"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "recruitment-intro-seen";

export default function IntroExperience() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && sessionStorage.getItem(SESSION_KEY) !== "1") {
      setVisible(true);
      document.documentElement.classList.add("intro-is-playing");
    }
    return () => document.documentElement.classList.remove("intro-is-playing");
  }, [pathname]);

  const finish = useCallback(() => {
    if (exiting) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setExiting(true);
    window.setTimeout(() => {
      setVisible(false);
      document.documentElement.classList.remove("intro-is-playing");
    }, 850);
  }, [exiting]);

  if (!visible) return null;

  return (
    <section
      aria-label="Recruitment portal introduction"
      className={`site-intro${exiting ? " site-intro--exiting" : ""}`}
    >
      <div className="site-intro-stage">
        <video
          autoPlay
          className="site-intro-video"
          muted
          onEnded={finish}
          onError={finish}
          playsInline
          preload="auto"
        >
          <source src="/assets/intro.mp4" type="video/mp4" />
        </video>
        <div className="site-intro-vignette" aria-hidden="true" />
        <div className="site-intro-glow" aria-hidden="true" />
        <div className="site-intro-frame" aria-hidden="true" />
      </div>
      <button className="site-intro-skip" onClick={finish} type="button">
        Skip intro
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}
