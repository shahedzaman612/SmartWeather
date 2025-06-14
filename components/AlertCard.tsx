import React from "react";

type WeatherAlert = {
  alert: string | null;
  message: string;
  code: number;
};

type AlertCardProps = {
  alert: WeatherAlert;
};

export default function AlertCard({ alert }: AlertCardProps) {
  if (!alert.alert) return null;

  return (
    <div className="bg-red-700 bg-opacity-80 rounded-md p-4 text-white shadow-lg max-w-md">
      <h3 className="text-xl font-bold mb-2">🚨 {alert.alert}</h3>
      <p className="mb-2 whitespace-pre-wrap">{alert.message}</p>
    </div>
  );
}
