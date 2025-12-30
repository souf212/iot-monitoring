// Combined Temperature & Humidity Chart
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import Card from '../ui/Card';
import { ChartSkeleton } from '../ui/LoadingSkeleton';
import ErrorState from '../ui/ErrorState';
import { fetchMeasurements } from '../../api/sensorApi';
import { CHART_CONFIG } from '../../utils/constants';

/**
 * Combined chart showing temperature and humidity over time
 */
const CombinedChart = ({ sensorId = 1 }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const measurements = await fetchMeasurements(sensorId);

            // Format data for Recharts
            const formattedData = measurements
                .slice(-CHART_CONFIG.MAX_DATA_POINTS)
                .reverse()
                .map(m => ({
                    time: new Date(m.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    temperature: m.temperature,
                    humidity: m.humidity,
                    timestamp: m.created_at,
                }));

            setData(formattedData);
        } catch (err) {
            console.error('Error loading chart data:', err);
            setError(err.message || 'Failed to load chart data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        // Refresh chart data periodically
        const intervalId = setInterval(loadData, 30000); // 30 seconds

        return () => clearInterval(intervalId);
    }, [sensorId]);

    if (loading) {
        return <ChartSkeleton />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadData} />;
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3">
                    <p className="text-xs text-gray-400 mb-2">
                        {payload[0].payload.time}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                            {entry.name}: {entry.value.toFixed(1)}{entry.name === 'Temperature' ? '°C' : '%'}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card
            icon={<Activity size={24} className="text-cyber-cyan" />}
            title="Historical Data"
        >
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickLine={{ stroke: '#334155' }}
                            axisLine={{ stroke: '#334155' }}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="temp"
                            stroke="#6366f1"
                            tick={{ fill: '#6366f1', fontSize: 11 }}
                            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#6366f1', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="humidity"
                            orientation="right"
                            stroke="#06b6d4"
                            tick={{ fill: '#06b6d4', fontSize: 11 }}
                            label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight', fill: '#06b6d4', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                        <Legend
                            wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
                            iconType="circle"
                        />
                        <Line
                            yAxisId="temp"
                            type="monotone"
                            dataKey="temperature"
                            name="Temperature"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ fill: '#1e293b', stroke: '#6366f1', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff' }}
                            animationDuration={CHART_CONFIG.ANIMATION_DURATION}
                        />
                        <Line
                            yAxisId="humidity"
                            type="monotone"
                            dataKey="humidity"
                            name="Humidity"
                            stroke="#06b6d4"
                            strokeWidth={3}
                            dot={{ fill: '#1e293b', stroke: '#06b6d4', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff' }}
                            animationDuration={CHART_CONFIG.ANIMATION_DURATION}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {data.length === 0 && !loading && (
                <div className="text-center text-gray-400 py-8">
                    No data available
                </div>
            )}
        </Card>
    );
};

export default CombinedChart;
