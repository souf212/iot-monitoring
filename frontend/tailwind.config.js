/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Space Theme
        background: {
          900: '#0B0F19', // Deepest background
          800: '#111827', // Card background
          700: '#1F2937', // Hover/Active
          600: '#374151', // Lighter background
        },
        primary: {
          400: '#818cf8',
          500: '#6366f1', // Electric Indigo
          600: '#4f46e5',
        },
        accent: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          purple: '#8b5cf6',
        },
        status: {
          success: '#10b981', // Emerald 500
          warning: '#f59e0b', // Amber 500
          error: '#ef4444',   // Rose 500
        },
        // Legacy dark mode references
        dark: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
          500: '#4B5563',
        }
      },
      textColor: {
        primary: '#f8fafc',
        secondary: '#94a3b8',
        muted: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
