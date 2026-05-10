"use client";

import { useLocation } from "./LocationContext";

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

export default function MarqueeBar() {
  const { selectedCity } = useLocation();
  const city = selectedCity && CITY_MQ[selectedCity] ? selectedCity : "del";
  const items = [...CITY_MQ[city], ...CITY_MQ[city]]; // duplicate for seamless loop

  return (
    <div className="milo-mqbar">
      <div className="milo-mqtrack">
        {items.map((text, i) => (
          <span key={i} className="milo-mqi">
            <span className="milo-mdot" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
