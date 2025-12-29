// Header component with MQTT status and navigation
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogOut, Wifi, WifiOff, Users, Settings, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Header component for the IoT dashboard
 * @param {object} props - Component props
 * @param {boolean} props.mqttConnected - MQTT connection status
 * @param {function} props.onLogout - Logout callback
 * @param {object} props.userRole - User role for permissions
 */
const Header = ({ mqttConnected = false, onLogout, userRole = null }) => {
    const navigate = useNavigate();

    const canManageUsers = userRole === 'manager' || userRole === 'supervisor';
    const canManageSensors = userRole === 'supervisor';
    const canViewAuditLogs = userRole === 'manager' || userRole === 'supervisor';

    return (
        <header className="glass-card mb-8 p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ rotate: mqttConnected ? 360 : 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-cyber-cyan"
                    >
                        <Activity size={32} strokeWidth={2.5} />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl font-bold text-gradient">
                            IoT Climate Monitor
                        </h1>
                        <p className="text-sm text-gray-400">Real-time environmental monitoring</p>
                    </div>
                </div>

                {/* MQTT Status */}
                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${mqttConnected
                                ? 'bg-green-500/20 border border-green-500/50'
                                : 'bg-red-500/20 border border-red-500/50'
                            }`}
                    >
                        {mqttConnected ? (
                            <>
                                <Wifi size={18} className="text-green-400" />
                                <span className="text-sm font-medium text-green-400">Connected</span>
                                <motion.div
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-2 h-2 bg-green-400 rounded-full"
                                />
                            </>
                        ) : (
                            <>
                                <WifiOff size={18} className="text-red-400" />
                                <span className="text-sm font-medium text-red-400">Disconnected</span>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    {canManageUsers && (
                        <button
                            onClick={() => navigate('/users')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600/20 hover:bg-primary-600/40 border border-primary-500/50 text-primary-300 rounded-lg transition-all duration-200"
                        >
                            <Users size={18} />
                            <span className="hidden sm:inline">Users</span>
                        </button>
                    )}

                    {canManageSensors && (
                        <button
                            onClick={() => navigate('/sensors')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600/20 hover:bg-primary-600/40 border border-primary-500/50 text-primary-300 rounded-lg transition-all duration-200"
                        >
                            <Settings size={18} />
                            <span className="hidden sm:inline">Sensors</span>
                        </button>
                    )}

                    {canViewAuditLogs && (
                        <button
                            onClick={() => navigate('/audit')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600/20 hover:bg-primary-600/40 border border-primary-500/50 text-primary-300 rounded-lg transition-all duration-200"
                        >
                            <FileText size={18} />
                            <span className="hidden sm:inline">Audit</span>
                        </button>
                    )}

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 rounded-lg transition-all duration-200"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
