"use client";

import { useLocation } from "./LocationContext";

/**
 * FIX: The original MarqueeBar rendered a single `.milo-mqtrack` inside `.milo-mqbar`.
 * The CSS already defined a 3-lane system (`.milo-mqstack`, `.mqbar--b`, `.mqbar--c`,
 * `.mqtrack--a/b/c`) but the component never used it.
 *
 * Root cause: Component and CSS were written by different people and never connected.
 *
 * Fix: Render the full `.milo-mqstack` with 3 lanes, applying the correct CSS classes
 * so the existing animations (different speeds, reverse direction on lane B) work.
 */

const CITY_MQ: Record<string, string[]> = {
  del: [
    "Chai Circle · Lodi",
    "Open Mic · Hauz Khas",
    "Rooftop Jam · Mehrauli",
    "Art Walk · Lodhi Colony",
    "Book Club · Khan Market",
    "Street Food · CP",
    "Jazz Night · Connaught Place",
    "Night Run · India Gate",
  ],
  blr: [
    "Indie Gig · Indiranagar",
    "Startup Social · Koramangala",
    "Cycling · Cubbon Park",
    "Terrace Sessions · HSR",
    "Book Club · MG Road",
    "Food Walk · VV Puram",
    "Stand-up Night · Jayanagar",
    "Flea Market · Church Street",
  ],
  mum: [
    "Flea Market · Bandra",
    "Jazz Night · Lower Parel",
    "Beach Walk · Versova",
    "Art Show · Colaba",
    "Food Walk · Dharavi",
    "Jam Session · Andheri",
    "Sunset Sessions · Juhu",
    "Comedy Night · Bandra West",
  ],
};

// Second lane has slightly different items for variety
const CITY_MQ_B: Record<string, string[]> = {
  del: [
    "Techno · Auro Kitchen",
    "Poetry Slam · Kunzum",
    "Sunrise Yoga · Lodhi",
    "Underground Gig · SDA",
    "Flea Market · Dilli Haat",
    "Comedy Night · Canvas Laugh Club",
    "Heritage Walk · Mehrauli",
    "Live Painting · Haus Khas",
  ],
  blr: [
    "Vinyl Session · Sotally Tober",
    "Hackathon · Jaaga",
    "Comedy Lineup · The Humming Tree",
    "Jazz Brunch · Windmills",
    "Pub Quiz · Toit",
    "Sunset Rooftop · Sky High",
    "Art Pop-up · Church Street",
    "Spoken Word · Atta Galatta",
  ],
  mum: [
    "Rooftop Sundowner · Worli",
    "Open Studio · Sassoon Docks",
    "Acoustic Night · Blue Frog",
    "Art Fair · NCPA",
    "Drag Night · Kitty Su",
    "Jungle Electronic · Aarey",
    "Book Launch · Kitab Khana",
    "Salsa Night · Social",
  ],
};

function MarqueeLane({
  items,
  className,
  trackClass,
}: {
  items: string[];
  className: string;
  trackClass: string;
}) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  return (
    <div className={`milo-mqbar ${className}`}>
      <div className={`milo-mqtrack ${trackClass}`}>
        {doubled.map((text, i) => (
          <span key={i} className="milo-mqi">
            <span className="milo-mdot" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeBar() {
  const { selectedCity } = useLocation();
  const city = selectedCity && CITY_MQ[selectedCity] ? selectedCity : "del";

  const laneA = CITY_MQ[city];
  const laneB = CITY_MQ_B[city];
  // Lane C is a reversed mix — use laneA rotated
  const laneC = [...laneA].reverse();

  return (
    <div className="milo-mqstack">
      {/* Lane A — forward, 26s */}
      <MarqueeLane items={laneA} className="" trackClass="mqtrack--a" />
      {/* Lane B — reverse direction, 34s, slightly dimmed */}
      <MarqueeLane items={laneB} className="mqbar--b" trackClass="mqtrack--b" />
      {/* Lane C — forward, 44s, more dimmed */}
      <MarqueeLane items={laneC} className="mqbar--c" trackClass="mqtrack--c" />
    </div>
  );
}
