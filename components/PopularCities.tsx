type City = {
  name: string;
  lat: number;
  lon: number;
};

type PopularCitiesProps = {
  onSelect: (city: City) => void;
};

const cities: City[] = [
  { name: "Dhaka", lat: 23.8103, lon: 90.4125 },
  { name: "Chattogram", lat: 22.3569, lon: 91.7832 },
  { name: "Khulna", lat: 22.8456, lon: 89.5403 },
  { name: "Barishal", lat: 22.701, lon: 90.3535 },
];

export default function PopularCities({ onSelect }: PopularCitiesProps) {
  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-white mb-2">Popular Cities</h3>
      <div className="grid grid-cols-2 gap-2">
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => onSelect(city)}
            className="bg-white/10 text-white py-2 px-4 rounded hover:bg-white/20 transition"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
}
