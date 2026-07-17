import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Grid,
  Skeleton,
  Empty,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from '@constructor-lab/ui-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@constructor-lab/ui-react';
import { ChartTrendIcon } from '@constructor-lab/icons-react/stroke-mono';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type {
  TimeSeriesData,
  CategoryData,
  DistributionData,
} from '../../types';
import { CHART_COLORS_SEMANTIC } from '@/lib/chart-colors.ts';

interface ChartsSectionProps {
  timeSeriesData: TimeSeriesData;
  categoryData: CategoryData;
  distributionData: DistributionData;
  isLoading?: boolean;
}

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))',
  },
};

// A single chart tile: a Card whose body holds either the recharts chart (kept as
// the ui-react ChartContainer theming wrapper) or, when there is no data, the
// shared Empty parts so every tile's empty state reads identically.
function ChartCard({
  title,
  description,
  isEmpty,
  children,
}: {
  title: string;
  description: string;
  isEmpty: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex h-[300px] items-center justify-center">
            <Empty>
              <EmptyHeader>
                <EmptyIcon>
                  <ChartTrendIcon />
                </EmptyIcon>
                <EmptyTitle>No data yet</EmptyTitle>
                <EmptyDescription>
                  There is nothing to chart for this range.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {children as React.ReactElement}
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function ChartsSection({
  timeSeriesData,
  categoryData,
  distributionData,
  isLoading = false,
}: ChartsSectionProps) {
  if (isLoading) {
    return (
      <Grid cols={2}>
        {[...Array(4)].map((_, i) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key -- fixed-length skeleton placeholders, never reordered
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={2}>
      <ChartCard
        title="User Activity"
        description="Daily active users over the last 30 days"
        isEmpty={timeSeriesData.length === 0}
      >
        <LineChart data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }
            className="text-xs"
          />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS_SEMANTIC.success}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartCard>

      <ChartCard
        title="Sales by Category"
        description="Revenue breakdown by product category"
        isEmpty={categoryData.length === 0}
      >
        <BarChart data={categoryData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="category" className="text-xs" />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="value"
            fill={CHART_COLORS_SEMANTIC.danger}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartCard>

      <ChartCard
        title="Revenue Trend"
        description="Cumulative revenue over time"
        isEmpty={timeSeriesData.length === 0}
      >
        <AreaChart data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }
            className="text-xs"
          />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS_SEMANTIC.primary}
            fill={CHART_COLORS_SEMANTIC.primary}
            fillOpacity={0.2}
          />
        </AreaChart>
      </ChartCard>

      <ChartCard
        title="User Distribution"
        description="Users by subscription tier"
        isEmpty={distributionData.length === 0}
      >
        <PieChart>
          <Pie
            data={distributionData as any}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill={CHART_COLORS_SEMANTIC.success}
            stroke={CHART_COLORS_SEMANTIC.primary}
            strokeWidth={2}
            dataKey="value"
          >
            {distributionData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ChartCard>
    </Grid>
  );
}
