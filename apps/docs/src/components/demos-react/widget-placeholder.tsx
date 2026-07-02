'use client';

import {
  WidgetPlaceholder,
  WidgetPlaceholderAction,
  WidgetPlaceholderContent,
  WidgetPlaceholderHeader,
  WidgetPlaceholderIcon,
  WidgetPlaceholderImage,
  WidgetPlaceholderText,
  WidgetPlaceholderTitle,
} from '@spec-lab/ui-react';
import { ChartBarVerticalIcon } from '@spec-lab/icons-react/stroke-mono';

export function WidgetPlaceholderDemo() {
  return (
    <WidgetPlaceholder className="h-[220px] w-[320px]">
      <WidgetPlaceholderHeader>
        <WidgetPlaceholderIcon>
          <ChartBarVerticalIcon />
        </WidgetPlaceholderIcon>
        <WidgetPlaceholderTitle>Backup statistics</WidgetPlaceholderTitle>
      </WidgetPlaceholderHeader>
      <WidgetPlaceholderContent>
        <WidgetPlaceholderImage>
          <ChartBarVerticalIcon />
        </WidgetPlaceholderImage>
        <WidgetPlaceholderText>No data available yet</WidgetPlaceholderText>
        <WidgetPlaceholderAction>Set up backup plan</WidgetPlaceholderAction>
      </WidgetPlaceholderContent>
    </WidgetPlaceholder>
  );
}
