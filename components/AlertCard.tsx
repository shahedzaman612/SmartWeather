import React from "react";

type WeatherAlert = {
  sender_name: string;
  event: string;
  startFormatted?: string;
  endFormatted?: string;
  description: string;
  tags: string[];
};

type AlertCardProps = {
  alert: WeatherAlert;
};

export default function AlertCard({ alert }: AlertCardProps) {
  return (
    <div className="bg-red-700 bg-opacity-80 rounded-md p-4 text-white shadow-lg max-w-md">
      <h3 className="text-xl font-bold mb-2">{alert.event}</h3>
      <p className="mb-1">
        <strong>From:</strong>{" "}
        {alert.startFormatted ?? "N/A"}
      </p>
      <p className="mb-1">
        <strong>To:</strong>{" "}
        {alert.endFormatted ?? "N/A"}
      </p>
      <p className="mb-2 whitespace-pre-wrap">{alert.description}</p>
      <p>
        <strong>Source:</strong> {alert.sender_name}
      </p>
      {alert.tags.length > 0 && (
        <div className="mt-2">
          <strong>Tags: </strong>
          {alert.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-block bg-red-900 bg-opacity-60 rounded px-2 py-0.5 text-xs mr-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
