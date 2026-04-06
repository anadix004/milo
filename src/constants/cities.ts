export interface CityZone {
  id: string;
  label: string;
}

export interface MetropolitanCity {
  id: string;
  label: string;
  zones: CityZone[];
}

export const METRO_CITIES: MetropolitanCity[] = [
  {
    id: "delhi-ncr",
    label: "Delhi NCR",
    zones: [
      { id: "delhi", label: "Delhi" },
      { id: "noida", label: "Noida" },
      { id: "gurugram", label: "Gurugram" },
      { id: "faridabad", label: "Faridabad" },
      { id: "ghaziabad", label: "Ghaziabad" },
    ]
  },
  {
    id: "mumbai",
    label: "Mumbai",
    zones: [
      { id: "south-mumbai", label: "South Mumbai" },
      { id: "western-suburbs", label: "Western Suburbs" },
      { id: "eastern-suburbs", label: "Eastern Suburbs" },
      { id: "navi-mumbai", label: "Navi Mumbai" },
      { id: "harbour-line", label: "Harbour Line" },
      { id: "thane", label: "Thane" },
    ]
  },
  {
    id: "bangalore",
    label: "Bangalore",
    zones: [
      { id: "central-bangalore", label: "Central Bangalore" },
      { id: "north-bangalore", label: "North Bangalore" },
      { id: "south-bangalore", label: "South Bangalore" },
      { id: "east-bangalore", label: "East Bangalore" },
      { id: "west-bangalore", label: "West Bangalore" },
    ]
  }
];

export const getCityName = (cityId: string) => {
  return METRO_CITIES.find(c => c.id === cityId)?.label || cityId;
};

export const getZoneName = (cityId: string, zoneId: string) => {
  const city = METRO_CITIES.find(c => c.id === cityId);
  return city?.zones.find(z => z.id === zoneId)?.label || zoneId;
};
