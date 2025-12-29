// Custom hook for real-time sensor data updates
import { useState, useEffect, useCallback } from 'react';
import { fetchLatestMeasurement } from '../api/sensorApi';
import { REALTIME_POLLING_INTERVAL } from '../utils/constants';

/**
 * Hook to fetch and monitor real-time sensor data
 * @param {number} sensorId - Sensor ID to monitor
 * @param {number} interval - Polling interval in milliseconds
 * @returns {object} { data, error, loading, refetch }
 */
export const useRealTimeData = (sensorId = 1, interval = REALTIME_POLLING_INTERVAL) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const result = await fetchLatestMeasurement(sensorId);
            setData(result);
            setError(null);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching real-time data:', err);
            setError(err.message || 'Failed to fetch sensor data');
            setLoading(false);
        }
    }, [sensorId]);

    useEffect(() => {
        // Initial fetch
        fetchData();

        // Set up polling
        const intervalId = setInterval(fetchData, interval);

        // Cleanup
        return () => {
            clearInterval(intervalId);
        };
    }, [fetchData, interval]);

    return {
        data,
        error,
        loading,
        refetch: fetchData,
    };
};
