// Application constants for the IoT Dashboard

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const DEFAULT_SENSOR_ID = 1;

// Polling intervals (in milliseconds)
export const REALTIME_POLLING_INTERVAL = 3000; // 3 seconds
export const CHART_REFRESH_INTERVAL = 10000; // 10 seconds
export const MQTT_STATUS_TIMEOUT = 30000; // 30 seconds - consider disconnected if no data

// Temperature thresholds (Celsius)
export const TEMP_THRESHOLDS = {
    COLD: 18,
    COMFORTABLE_MIN: 18,
    COMFORTABLE_MAX: 26,
    HOT: 26,
};

// Humidity thresholds (percentage)
export const HUMIDITY_THRESHOLDS = {
    DRY: 30,
    COMFORTABLE_MIN: 30,
    COMFORTABLE_MAX: 60,
    HUMID: 60,
};

// Color codes for data ranges
export const TEMP_COLORS = {
    COLD: '#60a5fa', // blue
    NORMAL: '#00ff88', // green
    HOT: '#ff6b6b', // red
};

export const HUMIDITY_COLORS = {
    DRY: '#ff9f40', // orange
    NORMAL: '#00f0ff', // cyan
    HUMID: '#0066ff', // blue
};

// Chart configuration
export const CHART_CONFIG = {
    MAX_DATA_POINTS: 50,
    ANIMATION_DURATION: 300,
};

// LED States
export const LED_STATES = {
    ON: 'ON',
    OFF: 'OFF',
};
