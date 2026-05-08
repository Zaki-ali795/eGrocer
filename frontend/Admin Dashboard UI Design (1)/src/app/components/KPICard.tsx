import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient: string;
  delay?: number;
  subtitle?: ReactNode;
}

export function KPICard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  gradient,
  delay = 0,
  subtitle
}: KPICardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-500"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl ${gradient} bg-opacity-10`}>
            <Icon className="w-6 h-6 text-[#1a3a2e]" />
          </div>
          {change && (
            <span className={`font-['Manrope'] text-sm font-semibold px-3 py-1 rounded-full ${
              changeType === 'positive' ? 'bg-emerald-100 text-emerald-700' :
              changeType === 'negative' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {change}
            </span>
          )}
        </div>

        <h3 className="font-['Manrope'] text-sm text-gray-600 mb-2">{title}</h3>
        <p className="font-['Crimson_Pro'] text-4xl font-bold text-gray-900 mb-1">{value}</p>
        {subtitle && (
          <div className="font-['Manrope'] text-xs text-gray-500">{subtitle}</div>
        )}
      </div>
    </motion.div>
  );
}
