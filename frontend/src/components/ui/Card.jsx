// Modern Card component with glassmorphism effect
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card component with dark mode styling and animations
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Optional card title
 * @param {React.ReactNode} props.icon - Optional icon element
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hoverable - Enable hover effect
 * @param {string} props.gradient - Optional gradient background class
 */
const Card = ({
    children,
    title,
    icon,
    className = '',
    hoverable = true,
    gradient = ''
}) => {
    const cardClass = hoverable ? 'glass-card-hover' : 'glass-card';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${cardClass} ${gradient} p-6 ${className}`}
        >
            {(title || icon) && (
                <div className="flex items-center gap-3 mb-4">
                    {icon && (
                        <div className="text-cyber-cyan">
                            {icon}
                        </div>
                    )}
                    {title && (
                        <h3 className="text-lg font-semibold text-white">
                            {title}
                        </h3>
                    )}
                </div>
            )}
            {children}
        </motion.div>
    );
};

export default Card;
