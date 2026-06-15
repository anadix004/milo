"use client";
import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) return <>{children}</>;
  
  return (
    <ReactLenis root options={{ 
        lerp: 0.1, 
        duration: 1.425, 
        smoothWheel: true 
    }}>
      {children as any}
    </ReactLenis>
  );
}
