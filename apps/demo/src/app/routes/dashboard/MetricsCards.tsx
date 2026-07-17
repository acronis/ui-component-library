import {
  ArrowTrendUpIcon,
  ArrowTrendDownIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { StatRow, type StatRowStat, Skeleton } from '@constructor-lab/ui-react';
import type { DashboardMetrics } from '../../types';

interface MetricsCardsProps {
  metrics?: DashboardMetrics;
  isLoading?: boolean;
}

// KPI row composed from the StatRow composite (a config-driven row of CardFilter
// tiles). Each metric maps to a StatRowStat whose leading icon signals the trend
// direction; when metrics are missing every tile renders as an `empty`
// placeholder so the loaded / empty states read consistently.
export function MetricsCards({
  metrics,
  isLoading = false,
}: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            // eslint-disable-next-line @eslint-react/no-array-index-key -- fixed-length skeleton placeholders, never reordered
            key={i}
            className="h-16 rounded-[var(--ui-card-filter-global-container-border-radius)]"
          />
        ))}
      </div>
    );
  }

  const trendIcon =
    metrics && metrics.growth > 0 ? (
      <ArrowTrendUpIcon />
    ) : (
      <ArrowTrendDownIcon />
    );

  const stats: StatRowStat[] = metrics
    ? [
        {
          id: 'total-users',
          label: 'Total Users',
          value: metrics.totalUsers.toLocaleString(),
          icon: trendIcon,
        },
        {
          id: 'revenue',
          label: 'Revenue',
          value: `$${metrics.revenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          icon: trendIcon,
        },
        {
          id: 'active-sessions',
          label: 'Active Sessions',
          value: metrics.activeSessions.toLocaleString(),
          icon: <ArrowTrendUpIcon />,
        },
        {
          id: 'growth',
          label: 'Growth',
          value: `${metrics.growth.toFixed(1)}%`,
          icon: trendIcon,
        },
      ]
    : [
        { id: 'total-users', label: 'Total Users', empty: true },
        { id: 'revenue', label: 'Revenue', empty: true },
        { id: 'active-sessions', label: 'Active Sessions', empty: true },
        { id: 'growth', label: 'Growth', empty: true },
      ];

  return <StatRow stats={stats} columns={4} />;
}
