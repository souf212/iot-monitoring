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
                        <div className="h-16 w-32 bg-background-700 animate-pulse rounded" />
                    ) : (
                        <>
                            <motion.div
                                key={temperature}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="text-5xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
                            >
                                {temperature !== null ? temperature.toFixed(1) : '--'}
                            </motion.div>
                            <span className="text-2xl text-muted">°C</span>
                        </>
                    )}
                </div>

                {/* Status and Trend */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium border border-white/10" style={{
                            backgroundColor: `${color}15`,
                            color: color,
                            borderColor: `${color}30`
                        }}>
                            {status}
                        </span>
                        {TrendIcon && (
                            <TrendIcon size={16} className="text-muted" />
                        )}
                    </div>

                    <div className="text-sm text-muted">
                        {timestamp ? formatRelativeTime(timestamp) : 'No data'}
                    </div>
                </div>

                {/* Temperature Range Indicator */}
                <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted font-medium">
                        <span>Cold</span>
                        <span>Normal</span>
                        <span>Hot</span>
                    </div>
                    <div className="h-1.5 bg-background-700 rounded-full overflow-hidden flex">
                        <div className="flex-1 bg-blue-500/50" />
                        <div className="flex-1 bg-emerald-500/50" />
                        <div className="flex-1 bg-rose-500/50" />
                    </div>
                </div>
            </div>

            {/* View History Button */}
            <button
                onClick={() => navigate('/temperature/history')}
                className="w-full mt-6 py-2.5 px-4 bg-background-800 hover:bg-background-700 border border-white/5 hover:border-primary-500/30 rounded-lg text-sm font-medium text-secondary hover:text-primary-400 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
                <BarChart3 size={16} className="group-hover:scale-110 transition-transform" />
                View History
            </button>
        </Card>
    );
}

export default TemperatureSensor;
