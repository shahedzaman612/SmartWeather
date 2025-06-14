// pages/api/alerts.ts
import type { NextApiRequest, NextApiResponse } from "next";

// Weather alert types based on Open-Meteo weather codes
const WEATHER_ALERT_MAP: Record<number, string> = {
  45: "Fog Alert",
  48: "Dense Fog Alert",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Heavy Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Light Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Rain Showers",
  81: "Heavy Rain Showers",
  82: "Violent Rain Showers",
  85: "Slight Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm Alert",
  96: "Thunderstorm + Hail Alert",
  99: "Severe Thunderstorm + Hail Alert",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat or lon query parameter" });
  }

  try {
    const apiRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode&timezone=auto`
    );
    const data = await apiRes.json();

    if (!apiRes.ok || !data?.daily?.weathercode) {
      return res.status(apiRes.status).json({ error: "Failed to fetch weather data" });
    }

    const todayCode = data.daily.weathercode[0];
    const alert = WEATHER_ALERT_MAP[todayCode] || null;

    if (alert) {
      return res.status(200).json({
        alert,
        code: todayCode,
        message: `Weather condition indicates: ${alert}`,
      });
    } else {
      return res.status(200).json({
        alert: null,
        code: todayCode,
        message: "No severe weather alerts for today.",
      });
    }
  } catch (error) {
    console.error("Open-Meteo fetch error:", error);
    return res.status(500).json({ error: "Internal server error fetching weather alert" });
  }
}
