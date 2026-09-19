export interface Video {
  id: string;
  name: string;
  description: string;
  country: string;
  filename: string;
  /** ISO YYYY-MM-DD. Kept as a string at rest; parse at use. */
  date: string;
  latitude: number;
  longitude: number;
  peopleIn: string;
  peopleOut: string;
  peopleStart: string;
  peopleEnd: string;
  guests: string;
  camera: string;
  preferredZoom: number;
}

export interface Trip {
  id: string;
  name: string;
  year: string;
  /** Ordered video ids; order is the itinerary, not incidental. */
  videos: string[];
  finished: boolean;
}
