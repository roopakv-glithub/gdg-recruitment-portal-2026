"use client";

import { useEffect, useRef } from "react";

export default function ColorCursor() {
  const root = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const element = root.current;
    const parts = [...element.children];
    const positions = parts.map(() => ({ x: 0, y: 0 }));
    let target = { x: 0, y: 0 }, frame = 0;
    const animate = () => {
      let moving = false;
      positions.forEach((point, i) => {
        const destination = i ? positions[i - 1] : target;
        point.x += (destination.x - point.x) * (i ? 0.24 : 1);
        point.y += (destination.y - point.y) * (i ? 0.24 : 1);
        parts[i].style.transform = `translate3d(${point.x}px,${point.y}px,0)`;
        if (Math.abs(destination.x - point.x) + Math.abs(destination.y - point.y) > .1) moving = true;
      });
      frame = moving ? requestAnimationFrame(animate) : 0;
    };
    const move = (event) => {
      if (event.pointerType === "touch") return;
      target = { x: event.clientX, y: event.clientY };
      if (!element.dataset.visible) positions.forEach(point => Object.assign(point, target));
      element.dataset.visible = "true";
      document.documentElement.classList.add("color-cursor-enabled");
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const hide = () => { delete element.dataset.visible; document.documentElement.classList.remove("color-cursor-enabled"); };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(frame); hide();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);
  return <div className="color-cursor" ref={root} aria-hidden="true">
    <svg width="30" height="32" viewBox="0 0 30 32"><path d="M5 28V8Q5 4 9 4H23Q27 4 27 8Q27 12 23 12H13V24Q13 28 9 28Z" fill="#4285f4" stroke="white" strokeWidth="3" /></svg>
    <i className="cursor-red" /><i className="cursor-yellow" /><i className="cursor-green" />
  </div>;
}
