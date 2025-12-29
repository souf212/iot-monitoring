// Humidity Chart with Custom Dark Mode Tooltip
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Custom Tooltip for better visibility in dark mode
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 border border-cyan-500/50">
                <p className="text-gray-300 text-sm mb-2">
                    {new Date(label).toLocaleString("fr-FR")}
                </p>
                <p className="text-cyan-400 font-bold text-lg">
                    {payload[0].value.toFixed(1)}%
                </p>
            </div>
        );
    }
    return null;
};

export default function HumidityChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                    dataKey="created_at"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF" }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString("fr-FR")}
                />
                <YAxis
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF" }}
                    label={{ value: "Humidité (%)", angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#00f0ff", strokeWidth: 2 }} />
                <Legend wrapperStyle={{ color: "#9CA3AF" }} />
                <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#00f0ff"
                    strokeWidth={2}
                    name="Humidité (%)"
                    dot={{ fill: "#00f0ff", r: 4 }}
                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
