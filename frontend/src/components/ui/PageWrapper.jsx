// Page Layout Wrapper for consistent dark theme styling
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Reusable page wrapper for consistent styling across all pages
 * @param {object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.title - Page title
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {boolean} props.showBackButton - Show back to dashboard button
 */
const PageWrapper = ({ children, title, icon, showBackButton = true }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-dark-900 p-4 md:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                {/* Page Header */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            {icon && <div className="text-cyber-cyan">{icon}</div>}
                            <h1 className="text-3xl font-bold text-white">{title}</h1>
                        </div>

                        {showBackButton && (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-white/10 hover:border-white/20 text-gray-300 rounded-lg transition-all duration-200"
                            >
                                <ArrowLeft size={18} />
                                <span>Retour au Dashboard</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Page Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PageWrapper;
