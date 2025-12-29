// Modern Sensor Management Page
import { useEffect, useState } from "react";
import { fetchSensors, updateSensor } from "../api/sensorApi";
import { getCurrentUser } from "../api/authApi";
import SensorForm from "../components/SensorForm";
import PageWrapper from "../components/ui/PageWrapper";
import { Activity, Edit2, MapPin, Thermometer, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SensorManagement() {
    const [sensors, setSensors] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState(null);

    const currentUser = getCurrentUser();
    const role = currentUser?.profile?.role || currentUser?.role || null;
    const canEdit = role === "supervisor";

    const loadSensors = async () => {
        const data = await fetchSensors();
        setSensors(data);
    };

    useEffect(() => {
        loadSensors();
    }, []);

    const handleFormSubmit = async (formData) => {
        if (!selectedSensor) return;
        await updateSensor(selectedSensor.sensor_id, formData);
        setSelectedSensor(null);
        loadSensors();
    };

    return (
        <PageWrapper title="Gestion des capteurs" icon={<Activity size={32} />}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sensors List */}
                <div className="lg:col-span-2">
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Nom
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Location
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Seuils Temp
                                        </th>
                                        {canEdit && (
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                                Action
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sensors.map((sensor, index) => (
                                        <motion.tr
                                            key={sensor.sensor_id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-white font-medium">
                                                #{sensor.sensor_id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-white">
                                                    <Thermometer size={16} className="text-cyber-cyan" />
                                                    {sensor.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <MapPin size={14} />
                                                    {sensor.location}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {sensor.active ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/50">
                                                        <CheckCircle size={12} />
                                                        Actif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/50">
                                                        <XCircle size={12} />
                                                        Inactif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                <div className="flex gap-2">
                                                    <span className="text-blue-400">{sensor.min_temp}°C</span>
                                                    <span>-</span>
                                                    <span className="text-red-400">{sensor.max_temp}°C</span>
                                                </div>
                                            </td>
                                            {canEdit && (
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setSelectedSensor(sensor)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600/40 border border-primary-500/50 text-primary-300 rounded-lg text-sm transition-all duration-200"
                                                    >
                                                        <Edit2 size={14} />
                                                        Modifier
                                                    </button>
                                                </td>
                                            )}
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>

                            {sensors.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    Aucun capteur trouvé
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sensor Form */}
                {selectedSensor && canEdit && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Modifier le capteur
                            </h3>
                            <SensorForm
                                sensor={selectedSensor}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setSelectedSensor(null)}
                            />
                        </div>
                    </motion.div>
                )}
            </div>

            {!canEdit && (
                <div className="mt-6 glass-card p-4">
                    <p className="text-gray-400 text-sm text-center">
                        ℹ️ Vous n'avez pas les permissions pour modifier les capteurs. Seuls les superviseurs peuvent effectuer des modifications.
                    </p>
                </div>
            )}
        </PageWrapper>
    );
}
