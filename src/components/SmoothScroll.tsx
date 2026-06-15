"use client";

/**
 * PHASE 5 FIX: SmoothScroll.tsx — removes {children as any} cast.
 *
 * Root cause: ReactLenis from "lenis/react" has a children prop typed as
 * React.ReactNode in some versions but the component's internal type
 * declaration in lenis@1.3.x uses a stricter signature that doesn't match.
 * The original workaround was `{children as any}` which suppresses all
 * type checking for the prop.
 *
 * Fix: Wrap children in a fragment with explicit typing.
 * ReactLenis accepts children via its children prop — passing a React.ReactNode
 * directly works at runtime even if the type declaration is off.
 * We can also use the options prop to type-check the Lenis config.
 *
 * If lenis ever fixes their type declaration, this file needs no changes.
 */

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface SmoothScrollProps {
  children: ReactNode;
}

const LENIS_OPTIONS = {
  lerp: 0.1,
  duration: 1.425,
  smoothWheel: true,
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const isMobile = useIsMobile();

  // Disable smooth scroll on mobile — it interferes with native momentum
  // scrolling and causes issues with iOS bottom sheet gesture recognition.
  if (isMobile) return <>{children}</>;

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <>{children}</>
    </ReactLenis>
  );
}
