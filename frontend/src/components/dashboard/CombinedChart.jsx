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
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="time"
                            stroke="#718096"
                            tick={{ fill: '#718096', fontSize: 12 }}
                            tickLine={{ stroke: '#718096' }}
                        />
                        <YAxis
                            yAxisId="temp"
                            stroke="#ff9f40"
                            tick={{ fill: '#ff9f40', fontSize: 12 }}
                            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#ff9f40' }}
                        />
                        <YAxis
                            yAxisId="humidity"
                            orientation="right"
                            stroke="#00f0ff"
                            tick={{ fill: '#00f0ff', fontSize: 12 }}
                            label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight', fill: '#00f0ff' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ color: '#fff' }}
                            iconType="line"
                        />
                        <Line
                            yAxisId="temp"
                            type="monotone"
                            dataKey="temperature"
                            name="Temperature"
                            stroke="#ff9f40"
                            strokeWidth={2}
                            dot={{ fill: '#ff9f40', r: 3 }}
                            activeDot={{ r: 5 }}
                            animationDuration={CHART_CONFIG.ANIMATION_DURATION}
                        />
                        <Line
                            yAxisId="humidity"
                            type="monotone"
                            dataKey="humidity"
                            name="Humidity"
                            stroke="#00f0ff"
                            strokeWidth={2}
                            dot={{ fill: '#00f0ff', r: 3 }}
                            activeDot={{ r: 5 }}
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
