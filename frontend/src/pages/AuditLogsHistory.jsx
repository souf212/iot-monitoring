// Modern Audit Logs History Page
import { useEffect, useState } from "react";
import { getAuditLogs, exportAuditLogs } from "../api/auditLogsApi";
import PageWrapper from "../components/ui/PageWrapper";
import { FileText, Download, AlertTriangle, Mail, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const PAGE_SIZE = 20;

export default function AuditLogsHistory() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

    useEffect(() => {
        setLoading(true);
        getAuditLogs(page)
            .then((res) => {
                setLogs(res.data.results);
                setCount(res.data.count);
            })
            .catch((err) => {
                if (err.response?.status === 404) {
                    setPage(1);
                }
            })
            .finally(() => setLoading(false));
    }, [page]);

    const handleExport = async () => {
        const res = await exportAuditLogs();
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "audit_logs.csv";
        link.click();
    };

    const getActionBadge = (action) => {
        switch (action) {
            case "ALERT_TRIGGERED":
                return {
                    icon: <AlertTriangle size={12} />,
                    className: "bg-red-500/20 text-red-300 border-red-500/50",
                };
            case "EMAIL_SENT":
                return {
                    icon: <Mail size={12} />,
                    className: "bg-blue-500/20 text-blue-300 border-blue-500/50",
                };
            case "TELEGRAM_SENT":
                return {
                    icon: <Send size={12} />,
                    className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
                };
            default:
                return {
                    icon: <FileText size={12} />,
                    className: "bg-gray-500/20 text-gray-300 border-gray-500/50",
                };
        }
    };

    return (
        <PageWrapper title="Audit Logs" icon={<FileText size={32} />}>
            {/* Export Button */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
                >
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {/* Logs Table */}
            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Action
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Sensor ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Détails
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, index) => {
                                        const badge = getActionBadge(log.action);
                                        return (
                                            <motion.tr
                                                key={log.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.02 }}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.className}`}
                                                    >
                                                        {badge.icon}
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 font-mono">
                                                    {log.sensor || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-300 max-w-md truncate">
                                                    {log.details}
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 text-sm">
                                                    {new Date(log.created_at).toLocaleString("fr-FR")}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {logs.length === 0 && !loading && (
                                <div className="text-center py-12 text-gray-500">
                                    Aucun log d'audit trouvé
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-4 p-6 border-t border-white/10">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-white/10 hover:border-white/20 text-gray-300 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                                Précédent
                            </button>

                            <span className="text-gray-400 font-medium">
                                Page {page} / {totalPages}
                            </span>

                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-white/10 hover:border-white/20 text-gray-300 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Suivant
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </PageWrapper>
    );
}
