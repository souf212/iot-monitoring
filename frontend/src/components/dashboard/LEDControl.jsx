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
            gradient={isOn ? 'bg-primary-900/20' : ''}
            icon={
                <Lightbulb
                    size={24}
                    className={isOn ? 'text-primary-400' : 'text-gray-500'}
                    fill={isOn ? 'currentColor' : 'none'}
                />
            }
            title="LED Control"
        >
            <div className="space-y-6">
                {/* LED Status Display */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {isOn ? 'ACTIVE' : 'OFF'}
                        </div>
                        <div className="text-sm text-muted">
                            System Status
                        </div>
                    </div>

                    {/* Visual LED Indicator */}
                    <div className="relative">
                        {isOn && (
                            <motion.div
                                className="absolute inset-0 bg-primary-500 rounded-full blur-xl"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}
                        <motion.div
                            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${isOn
                                ? 'bg-primary-500 border-primary-400 shadow-[0_0_30px_rgba(99,102,241,0.5)]'
                                : 'bg-background-800 border-background-700'
                                }`}
                        >
                            <Power
                                size={32}
                                className={isOn ? 'text-white' : 'text-gray-600'}
                                strokeWidth={2.5}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Toggle Switch */}
                <button
                    onClick={handleToggle}
                    disabled={isLoading}
                    className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${isOn
                        ? 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 shadow-lg shadow-primary-500/25'
                        : 'bg-background-700 hover:bg-background-600 text-gray-400'
                        } ${isLoading ? 'opacity-80 cursor-wait' : 'cursor-pointer active:scale-[0.98]'}`}
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
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Info */}
                <div className="text-[10px] uppercase tracking-wider text-muted text-center font-medium">
                    Remote Control via MQTT
                </div>
            </div>
        </Card>
    );
};

export default LEDControl;
