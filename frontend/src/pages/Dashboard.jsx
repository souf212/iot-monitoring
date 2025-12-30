// Modern IoT Dashboard with real-time monitoring
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCurrentUser, useLogout } from '../api/authApi';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useMQTTStatus } from '../hooks/useMQTTStatus';
import { calculateTrend } from '../utils/formatters';
import { DEFAULT_SENSOR_ID } from '../utils/constants';

// Components
import Header from '../components/ui/Header';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';
import TemperatureSensor from '../components/dashboard/TemperatureSensor';
import HumiditySensor from '../components/dashboard/HumiditySensor';
import LEDControl from '../components/dashboard/LEDControl';
import CombinedChart from '../components/dashboard/CombinedChart';
import ActivityLog from '../components/dashboard/ActivityLog';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const logout = useLogout();

  // Real-time sensor data
  const { data: sensorData, error: sensorError, loading: sensorLoading, refetch } = useRealTimeData(DEFAULT_SENSOR_ID);

  // MQTT connection status
  const { isConnected: mqttConnected } = useMQTTStatus(sensorData);

  // Load current user
  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // Store historical data for trend calculation
  useEffect(() => {
    if (sensorData) {
      setHistoricalData(prev => [...prev, sensorData].slice(-10));
    }
  }, [sensorData]);

  // Calculate trends
  const tempTrend = calculateTrend(historicalData, 'temperature');
  const humidityTrend = calculateTrend(historicalData, 'humidity');

  const userRole = currentUser?.profile?.role || currentUser?.role || null;

  return (
    <div className="min-h-screen bg-background-900 text-primary p-4 md:p-6 lg:p-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header */}
        <div className="mb-8">
          <Header
            mqttConnected={mqttConnected}
            onLogout={logout}
            userRole={userRole}
          />
        </div>

        {/* Bento Grid Layout */}
        <motion.div
          className="bento-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
        >
          {/* Row 1: Key Metrics & Control */}
          {sensorLoading ? (
            <>
              <div className="md:col-span-2"><CardSkeleton /></div>
              <div className="md:col-span-2"><CardSkeleton /></div>
              <div className="md:col-span-2"><CardSkeleton /></div>
            </>
          ) : sensorError ? (
            <div className="col-span-full">
              <ErrorState message={sensorError} onRetry={refetch} />
            </div>
          ) : (
            <>
              <motion.div className="md:col-span-2" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <TemperatureSensor
                  temperature={sensorData?.temperature}
                  timestamp={sensorData?.created_at}
                  trend={tempTrend}
                  loading={sensorLoading}
                />
              </motion.div>

              <motion.div className="md:col-span-2" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <HumiditySensor
                  humidity={sensorData?.humidity}
                  timestamp={sensorData?.created_at}
                  trend={humidityTrend}
                  loading={sensorLoading}
                />
              </motion.div>

              <motion.div className="md:col-span-2" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <LEDControl />
              </motion.div>
            </>
          )}

          {/* Row 2: Charts & Logs */}
          <motion.div className="md:col-span-4 row-span-2 glass-card p-4 min-h-[400px]">
            <h2 className="text-lg font-medium text-secondary mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></span>
              Environmental Trends
            </h2>
            <CombinedChart sensorId={DEFAULT_SENSOR_ID} />
          </motion.div>

          <motion.div className="md:col-span-2 row-span-2 glass-card p-4 h-full">
            <h2 className="text-lg font-medium text-secondary mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></span>
              System Activity
            </h2>
            <ActivityLog sensorId={DEFAULT_SENSOR_ID} maxItems={8} />
          </motion.div>

        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-muted text-xs py-8 mt-4"
        >
          <p>IoT Climate Monitor • v2.0 Deep Space Edition</p>
        </motion.div>

      </motion.div>
    </div>
  );
}