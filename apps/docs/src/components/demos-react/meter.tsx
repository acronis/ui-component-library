'use client';

import {
  Meter,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from '@constructor-lab/ui-react';

export function MeterDemo() {
  return (
    <div style={{ width: 280 }} className="flex flex-col gap-6">
      <Meter value={72}>
        <div className="flex items-center justify-between">
          <MeterLabel>Storage used</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack />
      </Meter>
      <Meter
        value={512}
        min={0}
        max={1024}
        format={{ style: 'unit', unit: 'gigabyte' }}
      >
        <div className="flex items-center justify-between">
          <MeterLabel>Backup quota</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack />
      </Meter>
    </div>
  );
}
