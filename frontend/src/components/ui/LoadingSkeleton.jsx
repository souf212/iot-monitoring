// Loading skeleton components
import React from 'react';

/**
 * Skeleton loader for card components
 */
export const CardSkeleton = () => {
    return (
        <div className="glass-card p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-dark-600 rounded-full" />
                <div className="h-6 w-32 bg-dark-600 rounded" />
            </div>
            <div className="space-y-3">
                <div className="h-12 w-40 bg-dark-600 rounded" />
                <div className="h-4 w-24 bg-dark-600 rounded" />
            </div>
        </div>
    );
};

/**
 * Skeleton loader for chart components
 */
export const ChartSkeleton = () => {
    return (
        <div className="glass-card p-6 animate-pulse">
            <div className="h-6 w-48 bg-dark-600 rounded mb-4" />
            <div className="h-64 bg-dark-600 rounded" />
        </div>
    );
};

/**
 * Skeleton loader for activity log
 */
export const ActivitySkeleton = () => {
    return (
        <div className="glass-card p-6 animate-pulse">
            <div className="h-6 w-32 bg-dark-600 rounded mb-4" />
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-dark-600 rounded-full" />
                        <div className="h-4 flex-1 bg-dark-600 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Generic loading spinner
 */
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin`}
            />
        </div>
    );
};
