export interface EventData {
  id: string;
  name: string;
  category: string;
  image: string;
  cityId: string;
  description: string;
  price: string;
  color: string;
  date: string; // YYYY-MM-DD
  featured?: boolean;
}

export const EVENTS: EventData[] = [];
