import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
}