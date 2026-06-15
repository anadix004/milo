/**
 * Z-INDEX LADDER
 *
 * Problem: Header (z-[100]) and BottomNav (z-[100]) were at the same level.
 * On scroll the header backdrop-blur layer would paint over BottomNav icons.
 * Modals were scattered across z-[110], z-[120], z-[150], z-[200], z-[210] with
 * no system — some modals appeared under the header.
 *
 * Fix: Single source of truth. Import these constants into every component
 * that needs a fixed z-index so stacking order is obvious at a glance.
 *
 * Layer map (low → high):
 *  BASE       = normal document flow
 *  STICKY     = sticky headers, floating action buttons  (10)
 *  NAV        = bottom nav bar                          (50)
 *  HEADER     = top navigation header                   (60)   ← above BottomNav
 *  LOCATION   = location popup (attached to header)     (70)
 *  SIDEBAR    = profile / notification sidebars         (80)
 *  OVERLAY    = sidebar backdrop overlays               (85)
 *  MODAL      = full-screen modals, bottom sheets       (90)
 *  MODAL_BG   = modal backdrop                         (88)
 *  TOAST      = notification toasts                     (95)
 *  PRELOADER  = site/page preloaders                   (100)
 *  CURSOR     = custom cursor elements                 (110)
 */

export const Z = {
  STICKY: 10,
  NAV: 50,
  HEADER: 60,
  LOCATION: 70,
  OVERLAY: 85,
  SIDEBAR: 80,
  MODAL_BG: 88,
  MODAL: 90,
  TOAST: 95,
  PRELOADER: 100,
  CURSOR: 110,
} as const;

/**
 * Tailwind class helpers — use these instead of magic numbers.
 * In Tailwind v4 arbitrary values just work, so these match the Z constants above.
 *
 * Usage:
 *   import { ZC } from "@/lib/zIndex";
 *   <div className={ZC.HEADER}>...</div>
 */
export const ZC = {
  STICKY: "z-[10]",
  NAV: "z-[50]",
  HEADER: "z-[60]",
  LOCATION: "z-[70]",
  SIDEBAR: "z-[80]",
  OVERLAY: "z-[85]",
  MODAL_BG: "z-[88]",
  MODAL: "z-[90]",
  TOAST: "z-[95]",
  PRELOADER: "z-[100]",
  CURSOR: "z-[110]",
} as const;
