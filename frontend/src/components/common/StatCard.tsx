import { type IconType } from 'react-icons';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: IconType;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  suffix?: string;
  loading?: boolean;
}

/**
 * Reusable card component for displaying statistics
 */
export function StatCard({ label, value, icon: Icon, trend, suffix, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">
              {value}
              {suffix && <span className="text-lg text-gray-600 ml-1">{suffix}</span>}
            </p>
          </div>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-bitcoin-100 rounded-lg">
            <Icon className="w-6 h-6 text-bitcoin-600" />
          </div>
        )}
      </div>
    </div>
  );
}
