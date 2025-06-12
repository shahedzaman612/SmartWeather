
import type { NextApiRequest, NextApiResponse } from "next";

const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat or lon query parameter" });
  }
  if (!WEATHERBIT_API_KEY) {
    return res.status(500).json({ error: "Weatherbit API key not configured" });
  }

  try {
    const apiRes = await fetch(
      `https://api.weatherbit.io/v2.0/alerts?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`
    );
    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: data.error || "Failed to fetch alerts" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Weatherbit fetch error:", error);
    return res.status(500).json({ error: "Internal server error fetching alerts" });
  }
}
