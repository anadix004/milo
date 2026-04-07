"use client";
import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useState } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Disable Lenis on mobile to permit native momentum scroll
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return <>{children}</>;
  
  return (
    <ReactLenis root options={{ 
        lerp: 0.1, 
        duration: 1.5, 
        smoothWheel: true 
    }}>
      {/* @ts-ignore - Version mismatch between React 19 and Lenis peer types */}
      {children}
    </ReactLenis>
  );
}
