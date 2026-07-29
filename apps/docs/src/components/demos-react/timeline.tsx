'use client';

import {
  Avatar,
  AvatarFallback,
  Link,
  Tag,
  Timeline,
  TimelineItem,
} from '@constructor-lab/ui-react';
import {
  CircleCheckIcon,
  DiamondWarningIcon,
} from '@constructor-lab/icons-react/stroke-mono';

export function TimelineDemo() {
  return (
    <Timeline className="w-full max-w-[560px]">
      <TimelineItem
        marker={
          <Avatar color="green">
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
        }
        title="Sarah Johnson"
        timestamp="Dec 22, 08:30 AM"
      >
        Confirmed the storage outage with the hosting provider.
      </TimelineItem>

      <TimelineItem
        marker={
          <Avatar color="gray">
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
        }
        title="Mike Chen"
        tag={
          <Tag variant="success" size="sm">
            To customer
          </Tag>
        }
        timestamp="Dec 22, 09:05 AM"
      >
        Sent the customer a status update with the expected recovery window.
      </TimelineItem>

      <TimelineItem
        status="critical"
        icon={<DiamondWarningIcon size={16} />}
        title="Error — Protection plan 'ui-perf-protection-plan'"
        timestamp="01:54 AM – 03:54 AM (2 hrs 0 min)"
        actions={<Link href="#support">Get support</Link>}
      >
        The cloud storage is temporarily unavailable.
      </TimelineItem>

      <TimelineItem
        status="success"
        icon={<CircleCheckIcon size={16} />}
        title="Retry succeeded"
        timestamp="Dec 22, 10:40 AM"
      >
        The plan completed on the second attempt — 256 KB processed.
      </TimelineItem>
    </Timeline>
  );
}
