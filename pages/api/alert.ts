// pages/api/alert.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon parameters" });
  }

  const apiKey = process.env.NEXT_PUBLIC_TOMORROW_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing Tomorrow.io API key" });
  }

  try {
    const url = `https://api.tomorrow.io/v4/weather/alerts?location=${lat},${lon}&apikey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.text();
      return res
        .status(response.status)
        .json({ error: `Failed to fetch alerts: ${errorData}` });
    }

    const alertData = await response.json();
    res.status(200).json(alertData);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}
