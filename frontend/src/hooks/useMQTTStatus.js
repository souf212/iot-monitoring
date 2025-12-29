// Custom hook for monitoring MQTT connection status
import { useState, useEffect } from 'react';
import { MQTT_STATUS_TIMEOUT } from '../utils/constants';

/**
 * Hook to monitor MQTT connection status based on data freshness
 * @param {object} latestData - Latest sensor data with timestamp
 * @returns {object} { isConnected, lastSeen }
 */
export const useMQTTStatus = (latestData) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastSeen, setLastSeen] = useState(null);

    useEffect(() => {
        if (!latestData || !latestData.created_at) {
            setIsConnected(false);
            return;
        }

        const dataTimestamp = new Date(latestData.created_at);
        setLastSeen(dataTimestamp);

        // Check if data is fresh (within threshold)
        const checkConnection = () => {
            const now = new Date();
            const timeDiff = now - dataTimestamp;
            setIsConnected(timeDiff < MQTT_STATUS_TIMEOUT);
        };

        // Initial check
        checkConnection();

        // Check periodically
        const intervalId = setInterval(checkConnection, 5000);

        return () => clearInterval(intervalId);
    }, [latestData]);

    return {
        isConnected,
        lastSeen,
    };
};
