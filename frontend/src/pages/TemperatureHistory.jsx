// Modern Temperature History Page - Optimized for better visibility
import { useEffect, useState } from "react";
import { fetchMeasurements } from "../api/sensorApi";
import TemperatureChart from "../charts/TemperatureChart";
import { exportToCsv } from "../utils/exportCsv";
import PageWrapper from "../components/ui/PageWrapper";
import { Thermometer, Download, Calendar, Filter, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function TemperatureHistory() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchMeasurements()
            .then((res) => {
                setData(res);
                setFilteredData(res);
            })
            .finally(() => setLoading(false));
    }, []);

    const applyFilter = () => {
        if (!startDate || !endDate) return;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const filtered = data.filter((m) => {
            const d = new Date(m.created_at);
            return d >= start && d <= end;
        });

        setFilteredData(filtered);
    };

    const resetFilter = () => {
        setStartDate("");
        setEndDate("");
        setFilteredData(data);
    };

    // Calculate statistics
    const stats = filteredData.length > 0 ? {
        avg: (filteredData.reduce((sum, m) => sum + m.temperature, 0) / filteredData.length).toFixed(1),
        min: Math.min(...filteredData.map(m => m.temperature)).toFixed(1),
        max: Math.max(...filteredData.map(m => m.temperature)).toFixed(1),
        count: filteredData.length
    } : null;

    return (
        <PageWrapper
            title="Historique Température"
            icon={<Thermometer size={32} />}
        >
            {/* Filter Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 mb-6"
            >
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Calendar size={16} className="inline mr-1" />
                            Date de début
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 bg-dark-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
                        />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Calendar size={16} className="inline mr-1" />
                            Date de fin
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 bg-dark-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={applyFilter}
                            disabled={!startDate || !endDate}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Filter size={18} />
                            Filtrer
                        </button>

                        <button
                            onClick={resetFilter}
                            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-white/10 hover:border-white/20 text-gray-300 rounded-lg transition-all duration-200"
                        >
                            Réinitialiser
                        </button>

                        <button
                            onClick={() => exportToCsv("temperature_history.csv", filteredData)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Statistics Cards */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
                >
                    <div className="glass-card p-4">
                        <div className="text-sm text-gray-400 mb-1">Moyenne</div>
                        <div className="text-2xl font-bold text-orange-400">{stats.avg}°C</div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-sm text-gray-400 mb-1">Minimum</div>
                        <div className="text-2xl font-bold text-blue-400">{stats.min}°C</div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-sm text-gray-400 mb-1">Maximum</div>
                        <div className="text-2xl font-bold text-red-400">{stats.max}°C</div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-sm text-gray-400 mb-1">Mesures</div>
                        <div className="text-2xl font-bold text-cyan-400">{stats.count}</div>
                    </div>
                </motion.div>
            )}

            {/* Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={20} className="text-cyber-cyan" />
                    <h3 className="text-lg font-semibold text-white">
                        Graphique des températures
                    </h3>
                    {startDate && endDate && (
                        <span className="ml-auto text-sm text-gray-400">
                            {new Date(startDate).toLocaleDateString("fr-FR")} - {new Date(endDate).toLocaleDateString("fr-FR")}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="w-8 h-8 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
                    </div>
                ) : filteredData.length > 0 ? (
                    <TemperatureChart data={filteredData} />
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Aucune donnée disponible pour la période sélectionnée
                    </div>
                )}
            </motion.div>
        </PageWrapper>
    );
}
