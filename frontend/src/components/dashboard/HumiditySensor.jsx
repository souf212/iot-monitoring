// Modern Humidity Sensor Card
import React from 'react';
import { Droplets, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { getHumidityColor, getHumidityStatus, formatRelativeTime } from '../../utils/formatters';

/**
 * Humidity sensor card component
 * @param {object} props - Component props
 * @param {number} props.humidity - Current humidity value
 * @param {string} props.timestamp - Last update timestamp
 * @param {string} props.trend - Trend direction ('up', 'down', 'stable')
 * @param {boolean} props.loading - Loading state
 */
const HumiditySensor = ({ humidity, timestamp, trend = 'stable', loading = false }) => {
    const navigate = useNavigate();
    const color = humidity !== null ? getHumidityColor(humidity) : '#718096';
    const status = humidity !== null ? getHumidityStatus(humidity) : '--';
    const percentage = humidity !== null ? Math.min(100, Math.max(0, humidity)) : 0;

    const TrendIcon = {
        up: TrendingUp,
        down: TrendingDown,
        stable: Minus,
    }[trend];

    return (
        <Card
            gradient="gradient-humidity"
            icon={<Droplets size={24} style={{ color }} />}
            title="Humidity"
        >
            <div className="space-y-4">
                {/* Main Humidity Display */}
                <div className="flex items-baseline gap-2">
                    {loading ? (
                        <div className="h-16 w-32 bg-dark-600 animate-pulse rounded" />
                    ) : (
                        <>
                            <motion.div
                                key={humidity}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="text-5xl font-bold"
                                style={{ color }}
                            >
                                {humidity !== null ? humidity.toFixed(1) : '--'}
                            </motion.div>
                            <span className="text-2xl text-gray-400">%</span>
                        </>
                    )}
                </div>

                {/* Status and Trend */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{
                            backgroundColor: `${color}20`,
                            color
                        }}>
                            {status}
                        </span>
                        {TrendIcon && (
                            <TrendIcon size={16} className="text-gray-400" />
                        )}
                    </div>

                    <div className="text-sm text-gray-400">
                        {timestamp ? formatRelativeTime(timestamp) : 'No data'}
                    </div>
                </div>

                {/* Humidity Gauge */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span className="font-medium" style={{ color }}>
                            {humidity !== null ? `${humidity.toFixed(0)}%` : '--'}
                        </span>
                        <span>100%</span>
                    </div>
                    <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{
                                background: `linear-gradient(90deg, ${color}80, ${color})`,
                                boxShadow: `0 0 10px ${color}50`
                            }}
                        />
                    </div>
                </div>

                {/* View History Button */}
                <button
                    onClick={() => navigate('/humidity/history')}
                    className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg text-sm font-medium text-cyan-300 transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <BarChart3 size={16} />
                    View History
                </button>
            </div>
        </Card>
    );
};

export default HumiditySensor;
