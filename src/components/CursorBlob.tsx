"use client";

import { useEffect, useRef } from "react";

export default function CursorBlob() {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = curRef.current;
    const ring = ringRef.current;
    const blob = blobRef.current;
    if (!cur || !ring || !blob) return;

    let ringTimer: ReturnType<typeof setTimeout>;

    const onMouseMove = (e: MouseEvent) => {
      cur.style.left = e.clientX + "px";
      cur.style.top = e.clientY + "px";

      clearTimeout(ringTimer);
      ringTimer = setTimeout(() => {
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
      }, 85);

      blob.style.transition = "left .07s ease,top .07s ease,background .7s";
      blob.style.left = e.clientX + "px";
      blob.style.top = e.clientY + "px";
    };

    const onEnter = () => {
      cur.style.width = "30px";
      cur.style.height = "30px";
      cur.style.opacity = "0.5";
    };

    const onLeave = () => {
      cur.style.width = "10px";
      cur.style.height = "10px";
      cur.style.opacity = "1";
    };

    const attachHover = () => {
      document
        .querySelectorAll<HTMLElement>("button, a, [role='button'], .cbtn, .nget")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
        });
    };

    document.addEventListener("mousemove", onMouseMove);
    attachHover();

    // Re-attach on DOM mutations (dynamic content like cards)
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      clearTimeout(ringTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Custom cursor dot */}
      <div
        ref={curRef}
        id="cur"
        style={{
          position: "fixed",
          width: 10,
          height: 10,
          background: "var(--ac, #4A7FD4)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "width .18s, height .18s, background .5s, opacity .18s",
          left: "-100px",
          top: "-100px",
        }}
      />

      {/* Cursor ring */}
      <div
        ref={ringRef}
        id="ring"
        style={{
          position: "fixed",
          width: 34,
          height: 34,
          border: "1px solid var(--acd, rgba(74,127,212,.28))",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          transition: "left .09s ease, top .09s ease, border-color .5s",
          left: "-100px",
          top: "-100px",
        }}
      />

      {/* Ambient glow blob */}
      <div
        ref={blobRef}
        id="blob"
        style={{
          position: "fixed",
          width: 380,
          height: 380,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, var(--acg, rgba(74,127,212,.15)) 0%, transparent 68%)",
          transition: "background .7s",
          left: "50%",
          top: "40%",
        }}
      />
    </>
  );
}
