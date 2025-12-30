// Activity Log Component - Recent sensor events
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Thermometer, Droplets, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import { ActivitySkeleton } from '../ui/LoadingSkeleton';
import { fetchMeasurements } from '../../api/sensorApi';
import { formatRelativeTime } from '../../utils/formatters';

/**
 * Activity log showing recent measurements and events
 */
const ActivityLog = ({ sensorId = 1, maxItems = 10 }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadActivities = async () => {
        try {
            const measurements = await fetchMeasurements(sensorId);
            const recentMeasurements = measurements.slice(0, maxItems);
            setActivities(recentMeasurements);
            setLoading(false);
        } catch (err) {
            console.error('Error loading activities:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActivities();

        const intervalId = setInterval(loadActivities, 10000); // Refresh every 10 seconds

        return () => clearInterval(intervalId);
    }, [sensorId]);

    if (loading) {
        return <ActivitySkeleton />;
    }

    const getEventIcon = (measurement) => {
        if (measurement.status === 'ALERT') {
            return <AlertCircle size={16} className="text-red-400" />;
        }
        return <Clock size={16} className="text-primary-400" />;
    };

    const getEventColor = (measurement) => {
        if (measurement.status === 'ALERT') return 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10';
        return 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary-500/20';
    };

    return (
        <Card
            icon={<Clock size={24} className="text-primary-400" />}
            title="Recent Activity"
            hoverable={false}
        >
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {activities.length === 0 ? (
                    <div className="text-center text-muted py-8 text-sm">
                        No recent activity
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <motion.div
                            key={activity.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${getEventColor(activity)}`}
                        >
                            <div className="mt-0.5 p-2 rounded-lg bg-background-900 border border-white/5 shadow-sm">
                                {getEventIcon(activity)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <div className="flex items-center gap-1.5 bg-background-900/50 px-2 py-1 round-md border border-white/5 rounded-md">
                                        <Thermometer size={12} className="text-primary-400" />
                                        <span className="text-xs font-semibold text-primary">
                                            {activity.temperature?.toFixed(1)}°
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 bg-background-900/50 px-2 py-1 round-md border border-white/5 rounded-md">
                                        <Droplets size={12} className="text-accent-cyan" />
                                        <span className="text-xs font-semibold text-primary">
                                            {activity.humidity?.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="text-[10px] text-muted uppercase tracking-wider font-medium">
                                    {formatRelativeTime(activity.created_at)}
                                </div>

                                {activity.status === 'ALERT' && (
                                    <div className="mt-2 flex items-center gap-2 text-xs text-red-300 font-medium bg-red-500/10 p-2 rounded-md border border-red-500/10">
                                        <AlertCircle size={12} />
                                        Critical Threshold Exceeded
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default ActivityLog;
