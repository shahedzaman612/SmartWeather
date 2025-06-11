import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

export default function TemperatureChart({ hourly = [] }) {
  const chartData = hourly.slice(0, 12).map((hour) => ({
    time: moment(hour.dt).format("hA"),
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
