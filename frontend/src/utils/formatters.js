// Utility functions for formatting sensor data

/**
 * Format temperature value with unit
 * @param {number} temp - Temperature in Celsius
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted temperature string
 */
export const formatTemperature = (temp, decimals = 1) => {
    if (temp === null || temp === undefined) return '--';
    return `${temp.toFixed(decimals)}°C`;
};

/**
 * Format humidity value with unit
 * @param {number} humidity - Humidity percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted humidity string
 */
export const formatHumidity = (humidity, decimals = 1) => {
    if (humidity === null || humidity === undefined) return '--';
    return `${humidity.toFixed(decimals)}%`;
};

/**
 * Get color based on temperature value
 * @param {number} temp - Temperature in Celsius
 * @returns {string} CSS color value
 */
export const getTemperatureColor = (temp) => {
    if (temp < 18) return '#60a5fa'; // blue - cold
    if (temp > 26) return '#ff6b6b'; // red - hot
    return '#00ff88'; // green - normal
};

/**
 * Get color based on humidity value
 * @param {number} humidity - Humidity percentage
 * @returns {string} CSS color value
 */
export const getHumidityColor = (humidity) => {
    if (humidity < 30) return '#ff9f40'; // orange - dry
    if (humidity > 60) return '#0066ff'; // blue - humid
    return '#00f0ff'; // cyan - normal
};

/**
 * Calculate trend from data array
 * @param {Array} data - Array of measurement objects with temperature or humidity
 * @param {string} key - Key to analyze ('temperature' or 'humidity')
 * @returns {string} 'up', 'down', or 'stable'
 */
export const calculateTrend = (data, key) => {
    if (!data || data.length < 2) return 'stable';

    const recentValues = data.slice(-5).map(d => d[key]);
    const average = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const latest = recentValues[recentValues.length - 1];

    const threshold = 0.5; // degrees or percentage points

    if (latest > average + threshold) return 'up';
    if (latest < average - threshold) return 'down';
    return 'stable';
};

/**
 * Format timestamp to relative time (e.g., "2 minutes ago")
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Never';

    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

/**
 * Format timestamp for display
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted date/time string
 */
export const formatTimestamp = (timestamp) => {
    if (!timestamp) return '--';

    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Get status label based on temperature
 * @param {number} temp - Temperature in Celsius
 * @returns {string} Status label
 */
export const getTemperatureStatus = (temp) => {
    if (temp < 18) return 'Cold';
    if (temp > 26) return 'Hot';
    return 'Normal';
};

/**
 * Get status label based on humidity
 * @param {number} humidity - Humidity percentage
 * @returns {string} Status label
 */
export const getHumidityStatus = (humidity) => {
    if (humidity < 30) return 'Dry';
    if (humidity > 60) return 'Humid';
    return 'Normal';
};
