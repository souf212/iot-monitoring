// LED Control Component
import React from 'react';
import { Lightbulb, Power, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { useLEDControl } from '../../hooks/useLEDControl';
import { LED_STATES } from '../../utils/constants';

/**
 * LED Control card component
 */
const LEDControl = () => {
    const { ledState, isLoading, error, toggleLED } = useLEDControl();
    const isOn = ledState === LED_STATES.ON;

    const handleToggle = async () => {
        await toggleLED();
    };

    return (
        <Card
            gradient={isOn ? 'gradient-cyber' : ''}
            icon={
                <Lightbulb
                    size={24}
                    className={isOn ? 'text-yellow-400' : 'text-gray-400'}
                    fill={isOn ? 'currentColor' : 'none'}
                />
            }
            title="LED Control"
        >
            <div className="space-y-4">
                {/* LED Status Display */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {isOn ? 'ON' : 'OFF'}
                        </div>
                        <div className="text-sm text-gray-400">
                            Current Status
                        </div>
                    </div>

                    {/* Visual LED Indicator */}
                    <motion.div
                        animate={isOn ? {
                            boxShadow: [
                                '0 0 20px rgba(250, 204, 21, 0.8)',
                                '0 0 40px rgba(250, 204, 21, 0.6)',
                                '0 0 20px rgba(250, 204, 21, 0.8)',
                            ]
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${isOn
                                ? 'bg-yellow-400 border-4 border-yellow-300'
                                : 'bg-dark-700 border-4 border-dark-600'
                            }`}
                    >
                        <Power
                            size={32}
                            className={isOn ? 'text-dark-900' : 'text-gray-500'}
                            strokeWidth={2.5}
                        />
                    </motion.div>
                </div>

                {/* Toggle Switch */}
                <button
                    onClick={handleToggle}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${isOn
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-glow-green'
                            : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <Power size={20} />
                            <span>Turn {isOn ? 'OFF' : 'ON'}</span>
                        </>
                    )}
                </button>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Info */}
                <div className="text-xs text-gray-500 text-center">
                    Controls ESP8266 LED via MQTT
                </div>
            </div>
        </Card>
    );
};

export default LEDControl;
