'use client';

import {
  Metric,
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
  Separator,
  Tag,
  TrendIndicator,
} from '@constructor-lab/ui-react';
import { ChartPieIcon } from '@constructor-lab/icons-react/stroke-mono';
import { AcronisAiMultiIcon } from '@constructor-lab/icons-react/solid-multi';

// A compact breakdown row from the compositional `Meter` parts.
function BreakdownRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <Meter value={value} max={max} className="gap-1">
      <div className="flex items-center justify-between">
        <MeterLabel className="text-xs font-normal">{label}</MeterLabel>
        <MeterValue className="text-xs" />
      </div>
      <MeterTrack className="h-1.5">
        <MeterIndicator style={{ background: color }} />
      </MeterTrack>
    </Meter>
  );
}

export function MetricDemo() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Metric
        className="w-[220px]"
        label="Endpoint coverage"
        value="94"
        unit="%"
        status="success"
        icon={<ChartPieIcon />}
        supportingText="Target: 98%"
        trend={
          <TrendIndicator
            direction="up"
            sentiment="positive"
            value="2%"
            size="small"
          />
        }
      />

      <Metric
        className="w-[314px]"
        label="At-risk customers"
        status="critical"
        icon={<ChartPieIcon />}
        caption={
          <Tag variant="neutral" size="sm">
            Now
          </Tag>
        }
        value="3"
        trend={
          <TrendIndicator
            direction="up"
            sentiment="negative"
            value="1"
            comparisonLabel="this week"
            size="small"
          />
        }
      >
        <div className="mt-3 flex flex-col gap-2.5">
          <BreakdownRow
            label="Healthy"
            value={46}
            max={54}
            color="var(--ui-background-status-strong-success)"
          />
          <BreakdownRow
            label="Unhealthy"
            value={5}
            max={54}
            color="var(--ui-background-status-strong-warning)"
          />
          <BreakdownRow
            label="At risk"
            value={3}
            max={54}
            color="var(--ui-background-status-strong-critical)"
          />
        </div>
        <Separator className="my-3" />
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <AcronisAiMultiIcon
            size={16}
            aria-hidden
            className="mt-0.5 shrink-0"
          />
          +3 customers predicted at-risk within 30 days — act before renewal.
        </p>
      </Metric>
    </div>
  );
}
