"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
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
