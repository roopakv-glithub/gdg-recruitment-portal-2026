"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "recruitment-intro-seen";

export default function IntroExperience() {
  const pathname = usePathname();
  // Render the cover with the initial HTML, before effects or video loading.
  const [visible, setVisible] = useState(pathname === "/");
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (pathname !== "/") { setVisible(false); return; }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem(SESSION_KEY) === "1"; } catch {}
    setVisible(!reduceMotion && !seen);
    if (!reduceMotion && !seen) {
      setExiting(false);
      document.documentElement.classList.add("intro-is-playing");
    }
    return () => document.documentElement.classList.remove("intro-is-playing");
  }, [pathname]);

  const finish = useCallback(() => {
    if (exiting) return;
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
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
          disablePictureInPicture
          disableRemotePlayback
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
        Enter website
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}
