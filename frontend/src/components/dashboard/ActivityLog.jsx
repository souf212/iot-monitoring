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
        return <Clock size={16} className="text-cyber-cyan" />;
    };

    const getEventColor = (measurement) => {
        if (measurement.status === 'ALERT') return 'border-red-500/50 bg-red-500/10';
        return 'border-cyber-cyan/30 bg-cyber-cyan/5';
    };

    return (
        <Card
            icon={<Clock size={24} className="text-cyber-cyan" />}
            title="Recent Activity"
            hoverable={false}
        >
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {activities.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No recent activity
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <motion.div
                            key={activity.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${getEventColor(activity)} transition-all hover:border-cyber-cyan/50`}
                        >
                            <div className="mt-1">
                                {getEventIcon(activity)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Thermometer size={14} className="text-orange-400" />
                                    <span className="text-sm font-medium text-white">
                                        {activity.temperature?.toFixed(1)}°C
                                    </span>

                                    <Droplets size={14} className="text-cyan-400 ml-2" />
                                    <span className="text-sm font-medium text-white">
                                        {activity.humidity?.toFixed(1)}%
                                    </span>
                                </div>

                                <div className="text-xs text-gray-400">
                                    {formatRelativeTime(activity.created_at)}
                                </div>

                                {activity.status === 'ALERT' && (
                                    <div className="mt-1 text-xs text-red-400 font-medium">
                                        ⚠️ Alert condition detected
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
