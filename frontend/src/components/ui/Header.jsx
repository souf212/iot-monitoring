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
        <header className="glass-card mb-8 p-4 bg-background-800/80 sticky top-4 z-40 backdrop-blur-xl border-white/10 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Logo and Title */}
                <div className="flex items-center gap-4">
                    <motion.div
                        animate={{ rotate: mqttConnected ? 360 : 0 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="p-2 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg shadow-lg shadow-primary-500/30"
                    >
                        <Activity size={24} className="text-white" strokeWidth={2.5} />
                    </motion.div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">
                            IoT Climate<span className="text-primary-400">Monitor</span>
                        </h1>
                        <p className="text-xs text-muted font-medium uppercase tracking-wider">Deep Space Overview</p>
                    </div>
                </div>

                {/* MQTT Status */}
                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${mqttConnected
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            }`}
                    >
                        {mqttConnected ? (
                            <>
                                <Wifi size={14} />
                                <span className="text-xs font-semibold">ONLINE</span>
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </>
                        ) : (
                            <>
                                <WifiOff size={14} />
                                <span className="text-xs font-semibold">OFFLINE</span>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    {canManageUsers && (
                        <button
                            onClick={() => navigate('/users')}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <Users size={16} />
                            <span className="hidden sm:inline">Users</span>
                        </button>
                    )}

                    {canManageSensors && (
                        <button
                            onClick={() => navigate('/sensors')}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <Settings size={16} />
                            <span className="hidden sm:inline">Sensors</span>
                        </button>
                    )}

                    {canViewAuditLogs && (
                        <button
                            onClick={() => navigate('/audit')}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <FileText size={16} />
                            <span className="hidden sm:inline">Audit</span>
                        </button>
                    )}

                    <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block"></div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/10 hover:border-rose-500/30 text-rose-300 rounded-lg transition-all duration-200"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
