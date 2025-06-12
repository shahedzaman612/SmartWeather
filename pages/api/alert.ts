import type { NextApiRequest, NextApiResponse } from "next";

const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon" });
  }

  if (!WEATHERBIT_API_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/alerts?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`
    );
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: "Failed to fetch alert data" });
  }
}
