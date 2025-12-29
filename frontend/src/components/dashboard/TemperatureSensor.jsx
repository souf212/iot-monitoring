// Modern Temperature Sensor Card
import React from 'react';
import { Thermometer, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { formatTemperature, getTemperatureColor, getTemperatureStatus, formatRelativeTime } from '../../utils/formatters';

/**
 * Temperature sensor card component
 * @param {object} props - Component props
 * @param {number} props.temperature - Current temperature value
 * @param {string} props.timestamp - Last update timestamp
 * @param {string} props.trend - Trend direction ('up', 'down', 'stable')
 * @param {boolean} props.loading - Loading state
 */
const TemperatureSensor = ({ temperature, timestamp, trend = 'stable', loading = false }) => {
    const navigate = useNavigate();
    const color = temperature !== null ? getTemperatureColor(temperature) : '#718096';
    const status = temperature !== null ? getTemperatureStatus(temperature) : '--';

    const TrendIcon = {
        up: TrendingUp,
        down: TrendingDown,
        stable: Minus,
    }[trend];

    return (
        <Card
            gradient="gradient-temp"
            icon={<Thermometer size={24} style={{ color }} />}
            title="Temperature"
        >
            <div className="space-y-4">
                {/* Main Temperature Display */}
                <div className="flex items-baseline gap-2">
                    {loading ? (
                        <div className="h-16 w-32 bg-dark-600 animate-pulse rounded" />
                    ) : (
                        <>
                            <motion.div
                                key={temperature}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="text-5xl font-bold"
                                style={{ color }}
                            >
                                {temperature !== null ? temperature.toFixed(1) : '--'}
                            </motion.div>
                            <span className="text-2xl text-gray-400">°C</span>
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

                {/* Temperature Range Indicator */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Cold</span>
                        <span>Normal</span>
                        <span>Hot</span>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden flex">
                        <div className="flex-1 bg-blue-400" />
                        <div className="flex-1 bg-green-400" />
                        <div className="flex-1 bg-red-400" />
                    </div>
                </div>
            </div>

            {/* View History Button */}
            <button
                onClick={() => navigate('/temperature/history')}
                className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 hover:from-orange-600/30 hover:to-red-600/30 border border-orange-500/30 hover:border-orange-500/50 rounded-lg text-sm font-medium text-orange-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
                <BarChart3 size={16} />
                View History
            </button>
        </Card>
    );
}

export default TemperatureSensor;
