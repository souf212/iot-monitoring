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
                        <div className="h-16 w-32 bg-background-700 animate-pulse rounded" />
                    ) : (
                        <>
                            <motion.div
                                key={humidity}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="text-5xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
                            >
                                {humidity !== null ? humidity.toFixed(1) : '--'}
                            </motion.div>
                            <span className="text-2xl text-muted">%</span>
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

                {/* Humidity Gauge */}
                <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted font-medium">
                        <span>Dry</span>
                        <span style={{ color }}>
                            {humidity !== null ? `${humidity.toFixed(0)}%` : '--'}
                        </span>
                        <span>Wet</span>
                    </div>
                    <div className="h-2 bg-background-700 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full rounded-full relative overflow-hidden"
                            style={{
                                background: `linear-gradient(90deg, ${color}40, ${color})`,
                                boxShadow: `0 0 15px ${color}60`
                            }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                    </div>
                </div>

                {/* View History Button */}
                <button
                    onClick={() => navigate('/humidity/history')}
                    className="w-full mt-6 py-2.5 px-4 bg-background-800 hover:bg-background-700 border border-white/5 hover:border-accent-cyan/30 rounded-lg text-sm font-medium text-secondary hover:text-accent-cyan transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                    <BarChart3 size={16} className="group-hover:scale-110 transition-transform" />
                    View History
                </button>
            </div>
        </Card>
    );
};

export default HumiditySensor;
