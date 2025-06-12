import { useState } from "react";

type Place = {
  name: string;
  lat: number;
  lon: number;
};

type PlaceSearchProps = {
  onSelect: (place: Place) => void;
};

export default function PlaceSearch({ onSelect }: PlaceSearchProps) {
  const [query, setQuery] = useState("");

  const searchCity = async () => {
    if (!query) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const place: Place = {
          name: data[0].display_name,
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
        onSelect(place);
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Enter city name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 rounded border border-gray-300 w-full"
      />
      <button
        onClick={searchCity}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}
