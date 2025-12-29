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
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <Header
          mqttConnected={mqttConnected}
          onLogout={logout}
          userRole={userRole}
        />

        {/* Main Content */}
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-cyber-cyan rounded"></span>
              Real-time Metrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sensorLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : sensorError ? (
                <div className="col-span-full">
                  <ErrorState message={sensorError} onRetry={refetch} />
                </div>
              ) : (
                <>
                  <TemperatureSensor
                    temperature={sensorData?.temperature}
                    timestamp={sensorData?.created_at}
                    trend={tempTrend}
                    loading={sensorLoading}
                  />

                  <HumiditySensor
                    humidity={sensorData?.humidity}
                    timestamp={sensorData?.created_at}
                    trend={humidityTrend}
                    loading={sensorLoading}
                  />

                  <LEDControl />
                </>
              )}
            </div>
          </motion.div>

          {/* Charts and Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Historical Chart - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-cyber-blue rounded"></span>
                Historical Trends
              </h2>
              <CombinedChart sensorId={DEFAULT_SENSOR_ID} />
            </div>

            {/* Activity Log - Takes 1 column on large screens */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-cyber-green rounded"></span>
                Live Events
              </h2>
              <ActivityLog sensorId={DEFAULT_SENSOR_ID} maxItems={10} />
            </div>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-500 text-sm py-4"
          >
            <p>IoT Climate Monitor • Real-time environmental monitoring system</p>
            <p className="mt-1">ESP8266 + DHT11 + MQTT + Django + React</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}