// Custom hook for LED control operations
import { useState, useCallback } from 'react';
import axios from 'axios';
import { LED_STATES } from '../utils/constants';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Hook to manage LED control state and operations
 * @returns {object} { ledState, isLoading, error, toggleLED, setLEDState }
 */
export const useLEDControl = () => {
    const [ledState, setLedState] = useState(LED_STATES.OFF);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Send LED command to backend
     * @param {string} command - 'ON' or 'OFF'
     */
    const sendLEDCommand = useCallback(async (command) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/led/control/`, {
                command: command,
            });

            if (response.data.status === 'success') {
                setLedState(command);
                return true;
            } else {
                throw new Error(response.data.error || 'Failed to control LED');
            }
        } catch (err) {
            console.error('LED control error:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to control LED';
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Toggle LED state (ON <-> OFF)
     */
    const toggleLED = useCallback(async () => {
        const newState = ledState === LED_STATES.ON ? LED_STATES.OFF : LED_STATES.ON;
        return await sendLEDCommand(newState);
    }, [ledState, sendLEDCommand]);

    /**
     * Set LED to specific state
     * @param {string} state - 'ON' or 'OFF'
     */
    const setLEDStateManual = useCallback(async (state) => {
        if (state !== LED_STATES.ON && state !== LED_STATES.OFF) {
            setError('Invalid LED state');
            return false;
        }
        return await sendLEDCommand(state);
    }, [sendLEDCommand]);

    return {
        ledState,
        isLoading,
        error,
        toggleLED,
        setLEDState: setLEDStateManual,
    };
};
