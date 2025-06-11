import { useEffect, useState } from "react";

export default function PlaceSearch({ onSelect }) {
  const [query, setQuery] = useState("");

  const searchCity = async () => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
    );
    const data = await res.json();
    if (data[0]) {
      const { lat, lon, display_name } = data[0];
      onSelect({
        name: display_name.split(",")[0],
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      });
    }
  };

  return (
    <div className="flex gap-2">
      <input
        className="p-2 rounded bg-white/10 text-white w-full"
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={searchCity}
        className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
      >
        Search
      </button>
    </div>
  );
}
