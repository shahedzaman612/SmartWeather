const popularCities = [
  { name: "Dhaka", lat: 23.8103, lon: 90.4125 },
  { name: "Chattogram", lat: 22.3569, lon: 91.7832 },
  { name: "Khulna", lat: 22.8456, lon: 89.5403 },
  { name: "Barishal", lat: 22.701, lon: 90.3535 },
];

export default function PopularCities({ onSelect }) {
  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-white mb-2">Popular Cities</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {popularCities.map((city, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(city)}
            className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white hover:bg-white/20 transition"
          >
            <p className="font-medium mb-1">{city.name}</p>
            <p className="text-xs opacity-60">Tap to view</p>
          </button>
        ))}
      </div>
    </div>
  );
}
