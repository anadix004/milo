/**
 * Parses price strings like "₹1,499" or "FREE" into a number for sorting.
 * "FREE" translates to 0.
 */
export function parsePrice(priceStr: string): number {
  if (priceStr.toUpperCase() === "FREE") return 0;
  
  // Remove non-numeric characters (except for the potential amount)
  const numericStr = priceStr.replace(/[^0-9]/g, "");
  return parseInt(numericStr, 10) || 0;
}
