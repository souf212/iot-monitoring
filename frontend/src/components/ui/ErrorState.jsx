// Error state component
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Error state component with retry functionality
 * @param {object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {function} props.onRetry - Retry callback function
 * @param {string} props.className - Additional CSS classes
 */
const ErrorState = ({
    message = 'An error occurred',
    onRetry,
    className = ''
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-card p-8 ${className}`}
        >
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle size={48} className="text-red-400" />
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Error
                    </h3>
                    <p className="text-gray-400 text-sm">
                        {message}
                    </p>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                    >
                        <RefreshCw size={18} />
                        <span>Retry</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default ErrorState;
