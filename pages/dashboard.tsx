import { useCallback, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

import Layout from "../components/Layout";
import PlaceSearch from "../components/PlaceSearch";
import WeatherCard from "../components/WeatherCard";
import HourlyForecast from "../components/HourlyForecast";
import TemperatureChart from "../components/TemperatureChart";
import PopularCities from "../components/PopularCities";
import AirQualityCard from "../components/AirQualityCard";
import AlertCard from "../components/AlertCard";
import SevenDayForecast from "../components/SevenDayForecast";

import {
  saveLocation,
  getSavedLocations,
  deleteLocation,
  updateAlertsEnabled,
} from "../lib/firestore";

type HourlyWeather = {
  dt: string;
  temp: number;
  humidity: number;
  wind: number;
  code: number;
};

type WeatherData = {
  name: string;
  temp: number;
  humidity: number;
  wind: number;
  code: number;
  sunrise: string;
  sunset: string;
  lat: number;
  lon: number;
};

type AQIData = {
  main: {
    aqi: 1 | 2 | 3 | 4 | 5;
  };
  components: {
    pm2_5: number;
    pm10: number;
    [key: string]: number;
  };
};

type WeatherAlert = {
  alert: string | null;
  message: string;
  code: number;
};

type SavedLocation = {
  id?: string;
  name: string;
  lat: number;
  lon: number;
  alertsEnabled?: boolean;
};

type DailyForecast = {
  time: string[];
  precipitation_probability_max: number[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
};

async function getCityNameFromCoords(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    if (!res.ok) throw new Error("Failed to reverse geocode");
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality ||
      "Unknown Location"
    );
  } catch (e) {
    console.error("Reverse geocode error:", e);
    return "Unknown Location";
  }
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<{ hourly: HourlyWeather[] } | null>(null);
  const [aqi, setAqi] = useState<AQIData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert | null>(null);
  const [saved, setSaved] = useState<SavedLocation[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedLoading, setSavedLoading] = useState(true);
  const [daily, setDaily] = useState<DailyForecast | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUser(usr);
      } else {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setSavedLoading(true);
      getSavedLocations(user.uid)
        .then(setSaved)
        .catch((e) => {
          console.error("Error loading saved locations:", e);
        })
        .finally(() => setSavedLoading(false));
    }
  }, [user]);

  const handleCitySelect = useCallback(async ({ name, lat, lon }: SavedLocation) => {
    setLoading(true);
    setError(null);

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setError("You are offline. Please check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,weathercode&timezone=auto`
      );
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();

      const hourly: HourlyWeather[] = data.hourly.time.map(
        (t: string, i: number) => ({
          dt: t,
          temp: data.hourly.temperature_2m[i],
          humidity: data.hourly.relative_humidity_2m[i],
          wind: data.hourly.windspeed_10m[i],
          code: data.hourly.weathercode[i],
        })
      );

      setWeather({
        name,
        temp: data.hourly.temperature_2m[0],
        humidity: data.hourly.relative_humidity_2m[0],
        wind: data.hourly.windspeed_10m[0],
        code: data.hourly.weathercode[0],
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
        lat,
        lon,
      });

      setForecast({ hourly });
      setDaily(data.daily);

      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      if (!airRes.ok) throw new Error("Failed to fetch air quality data");
      const airData = await airRes.json();

      setAqi({
        main: {
          aqi: Math.min(Math.max(1, airData.list[0].main.aqi), 5) as 1 | 2 | 3 | 4 | 5,
        },
        components: {
          pm2_5: airData.list[0].components.pm2_5,
          pm10: airData.list[0].components.pm10,
          ...airData.list[0].components,
        },
      });

      const alertRes = await fetch(`/api/alert?lat=${lat}&lon=${lon}`);
      if (!alertRes.ok) {
        setAlerts(null);
      } else {
        const alertData = await alertRes.json();
        setAlerts(alertData?.alert ? alertData : null);
      }

      const match = saved.find((loc) => loc.lat === lat && loc.lon === lon);
      if (match && typeof match.alertsEnabled === "boolean") {
        setAlertsEnabled(match.alertsEnabled);
      } else {
        setAlertsEnabled(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error:", err.message);
        setError(err.message);
      } else {
        console.error("Unknown error:", err);
        setError("An unexpected error occurred.");
      }
      setAlertsEnabled(true);
    } finally {
      setLoading(false);
    }
  }, [saved]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const cityName = await getCityNameFromCoords(latitude, longitude);
          handleCitySelect({ name: cityName, lat: latitude, lon: longitude });
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        }
      );
    }
  }, [handleCitySelect]);

  const handleAlertToggle = async () => {
    if (!user || !weather) return;

    const newValue = !alertsEnabled;
    setAlertsEnabled(newValue);
    alert(`Weather alerts have been ${newValue ? "enabled" : "disabled"}.`);

    const match = saved.find((loc) => loc.lat === weather.lat && loc.lon === weather.lon);
    if (match?.id) {
      try {
        await updateAlertsEnabled(user.uid, match.id, newValue);
        setSaved((prev) =>
          prev.map((loc) =>
            loc.id === match.id ? { ...loc, alertsEnabled: newValue } : loc
          )
        );
      } catch (err) {
        console.error("Failed to update alertsEnabled:", err);
      }
    }
  };

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-white">Search Weather</h2>
        <PlaceSearch onSelect={handleCitySelect} />

        {loading && <p className="text-white mt-4">Loading data...</p>}
        {error && <p className="text-red-400 mt-4">Error: {error}</p>}

        {weather && !loading && !error && (
          <div className="mt-6 space-y-8">
            <WeatherCard data={weather} />

            <div className="space-y-3">
              <button
                className="px-5 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out flex items-center space-x-2"
                onClick={async () => {
                  if (!user || !weather) return;
                  const alreadySaved = saved.some(
                    (loc) => loc.lat === weather.lat && loc.lon === weather.lon
                  );
                  if (alreadySaved) return;

                  try {
                    await saveLocation(user.uid, {
                      name: weather.name,
                      lat: weather.lat,
                      lon: weather.lon,
                      alertsEnabled,
                    });
                    const updated = await getSavedLocations(user.uid);
                    setSaved(updated);
                  } catch (e) {
                    console.error("Error saving location:", e);
                  }
                }}
              >
                <span>Save Location</span>
              </button>

              <button
                className={`px-5 py-2 rounded-md font-medium text-white transition ${
                  alertsEnabled
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
                onClick={handleAlertToggle}
              >
                {alertsEnabled ? "Disable Weather Alerts" : "Enable Weather Alerts"}
              </button>
            </div>

            {alertsEnabled && alerts && <AlertCard alert={alerts} />}
            {aqi && <AirQualityCard aqi={aqi} />}
            {forecast?.hourly && (
              <>
                <HourlyForecast hourly={forecast.hourly} />
                {daily && <SevenDayForecast daily={daily} />}
                <TemperatureChart
                  hourly={forecast.hourly.map((h) => ({
                    ...h,
                    dt: new Date(h.dt).getTime(),
                  }))}
                />
              </>
            )}
          </div>
        )}

        <section className="mt-10">
          <h3 className="text-xl font-semibold text-white mb-2">Saved Locations</h3>
          {savedLoading ? (
            <p className="text-white">Loading saved locations...</p>
          ) : saved.length === 0 ? (
            <p className="text-white">No saved locations yet.</p>
          ) : (
            <ul className="space-y-2">
              {saved.map((loc) => (
                <li
                  key={loc.id ?? `${loc.name}-${loc.lat}-${loc.lon}`}
                  className="flex items-center justify-between"
                >
                  <button
                    className="text-white underline"
                    onClick={() => handleCitySelect(loc)}
                  >
                    {loc.name}
                  </button>
                  {loc.id && (
                    <button
                      className="ml-4 text-red-500 font-bold hover:text-red-700 transition"
                      onClick={async () => {
                        if (!user) return;
                        try {
                          await deleteLocation(user.uid, loc.id!);
                          setSaved((prev) => prev.filter((l) => l.id !== loc.id));
                        } catch (e) {
                          console.error("Failed to delete location", e);
                        }
                      }}
                      aria-label={`Delete saved location ${loc.name}`}
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <PopularCities onSelect={handleCitySelect} />
      </div>
    </Layout>
  );
}
