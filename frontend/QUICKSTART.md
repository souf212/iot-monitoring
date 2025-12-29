# 🚀 Quick Start Guide - IoT Climate Monitor

## Prerequisites

1. **Backend (Django + MQTT)**: Make sure your Django backend is running
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **MQTT Broker**: Mosquitto should be running on localhost:1883
   ```bash
   # Windows: Start Mosquitto service
   net start mosquitto
   ```

3. **ESP8266 Device**: Your ESP8266 with DHT11 sensor should be connected and publishing data

## Starting the Frontend

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** at `http://localhost:3000`

4. **Login** with your credentials

## Expected Behavior

### ✅ Real-Time Dashboard Features

1. **Header**
   - Should display "IoT Climate Monitor" with animated icon
   - MQTT status indicator (green "Connected" / red "Disconnected")
   - Navigation buttons (Users, Sensors, Audit if you have permissions)
   - Logout button

2. **Real-Time Metrics Cards**
   - **Temperature Card**: Shows current temp in °C with color coding
     - Blue (<18°C), Green (18-26°C), Red (>26°C)
     - Trend indicator (up/down/stable)
     - Last update time
   
   - **Humidity Card**: Shows current humidity with progress gauge
     - Color-coded status
     - Animated progress bar
     - Last update time
   
   - **LED Control**: Interactive LED toggle
     - Click to turn ON/OFF
     - Glowing animation when ON
     - Real-time status via MQTT

3. **Historical Trends Chart**
   - Dual Y-axis line chart
   - Orange line for temperature
   - Cyan line for humidity
   - Last 50 data points
   - Refreshes every 30 seconds

4. **Live Events Log**
   - Recent measurements listed with timestamps
   - Alert indicators if thresholds exceeded
   - Auto-scrolling with newest on top

### 🎨 Visual Design

- **Dark mode** with gradient background
- **Glassmorphism** card effects
- **Smooth animations** on all interactions
- **Responsive layout** adapts to screen size
- **Professional color scheme**: Blue, cyan, and green accents

### ⚡ Real-Time Updates

- Data refreshes every **3 seconds**
- MQTT disconnection detection after **30 seconds** of no data
- Charts update every **30 seconds**
- Activity log updates every **10 seconds**

## Troubleshooting

### MQTT Shows "Disconnected"
- Check if Mosquitto broker is running
- Verify ESP8266 is connected and publishing
- Check backend MQTT subscriber: `python manage.py mqtt_subscriber`

### No Data Displayed
- Ensure backend API is accessible at `http://localhost:8000`
- Check browser console for API errors
- Verify sensor_id=1 exists in database

### LED Control Not Working
- Check MQTT broker connection
- Verify ESP8266 is subscribed to `devices/esp8266-001/cmd/led`
- Check browser console for errors

### Charts Not Loading
- Verify measurements exist in database
- Check backend API endpoint: `http://localhost:8000/api/measurements/?sensor=1`
- Look for errors in browser console

## Environment Variables

Create `.env` file in frontend directory if needed:

```env
REACT_APP_API_URL=http://localhost:8000
```

## Production Build

To create an optimized production build:

```bash
npm run build
```

The build files will be in the `build/` directory.

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari

Minimum recommended resolution: **1366x768**

---

**Enjoy your modern IoT dashboard! 🎉**
