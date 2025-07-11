import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

type HourlyData = {
  dt: number;    // UNIX timestamp (seconds)
  temp: number;
};

interface TemperatureChartProps {
  hourly: HourlyData[];
}

export default function TemperatureChart({ hourly = [] }: TemperatureChartProps) {
  const chartData = hourly.slice(0, 12).map((hour) => ({
    time: moment(hour.dt * 1000).format("hA"),  // multiply by 1000 for JS timestamp
    temp: Math.round(hour.temp),
  }));

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-white mb-4">
        Hourly Temperature
      </h3>
      <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#3b82f6"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
