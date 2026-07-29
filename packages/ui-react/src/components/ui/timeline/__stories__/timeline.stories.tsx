import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CircleCheckIcon,
  CircleInfoIcon,
  DiamondWarningIcon,
  TriangleWarningIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { Timeline, TimelineItem } from '../timeline';
import { Avatar, AvatarFallback } from '../../avatar';
import { Button } from '../../button';
import {
  DescriptionList,
  DescriptionListItem,
  DescriptionListLabel,
  DescriptionListValue,
} from '../../description-list';
import { Link } from '../../link';
import { Tag } from '../../tag';

const meta = {
  title: 'UI/Timeline',
  component: Timeline,
  subcomponents: { TimelineItem },
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    children: {
      control: false,
      description: "The `TimelineItem`s, in the caller's order.",
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the `<ol>`.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const TIMESTAMP = 'Dec 22, 08:30 AM';

// The design's baseline: title + timestamp + a one-line description, with the
// default neutral dot marker.
export const Default: Story = {
  render: () => (
    <Timeline className="w-[560px]">
      <TimelineItem title="Ticket created" timestamp={TIMESTAMP}>
        Reported through the customer portal.
      </TimelineItem>
      <TimelineItem title="Ticket assigned" timestamp={TIMESTAMP}>
        Routed to the endpoint-protection queue.
      </TimelineItem>
      <TimelineItem title="Priority change" timestamp={TIMESTAMP}>
        Raised from Medium to High.
      </TimelineItem>
    </Timeline>
  ),
};

// Status tints the marker only — never the content card. The six statuses use
// the same token pairing as Metric's icon badge.
export const Statuses: Story = {
  render: () => (
    <Timeline className="w-[560px]">
      <TimelineItem status="neutral" title="Neutral" timestamp={TIMESTAMP}>
        A routine event.
      </TimelineItem>
      <TimelineItem status="info" title="Info" timestamp={TIMESTAMP}>
        Informational only.
      </TimelineItem>
      <TimelineItem status="success" title="Success" timestamp={TIMESTAMP}>
        The activity completed.
      </TimelineItem>
      <TimelineItem status="warning" title="Warning" timestamp={TIMESTAMP}>
        The activity succeeded with warnings.
      </TimelineItem>
      <TimelineItem status="danger" title="Danger" timestamp={TIMESTAMP}>
        The cloud storage is temporarily unavailable.
      </TimelineItem>
      <TimelineItem status="critical" title="Critical" timestamp={TIMESTAMP}>
        The protection plan failed.
      </TimelineItem>
    </Timeline>
  ),
};

// An icon inside the status-tinted marker (the design's icon-avatar case).
export const WithIcons: Story = {
  render: () => (
    <Timeline className="w-[560px]">
      <TimelineItem
        status="info"
        icon={<CircleInfoIcon size={16} />}
        title="Backup started"
        timestamp={TIMESTAMP}
      >
        Incremental backup of Phoenix-12A78.
      </TimelineItem>
      <TimelineItem
        status="warning"
        icon={<TriangleWarningIcon size={16} />}
        title="Warning"
        timestamp={TIMESTAMP}
      >
        The activity succeeded with warnings.
      </TimelineItem>
      <TimelineItem
        status="success"
        icon={<CircleCheckIcon size={16} />}
        title="Backup completed"
        timestamp="01:54 AM – 03:54 AM (2 hrs 0 min)"
      >
        256 KB processed.
      </TimelineItem>
    </Timeline>
  ),
};

// The design's person-authored events: the marker slot holds an `Avatar`, and an
// inline `Tag` qualifies the entry.
export const WithAvatarMarkers: Story = {
  render: () => (
    <Timeline className="w-[560px]">
      <TimelineItem
        marker={
          <Avatar color="green">
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
        }
        title="Sarah Johnson"
        timestamp={TIMESTAMP}
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
        timestamp={TIMESTAMP}
      >
        Sent the customer a status update with the expected recovery window.
      </TimelineItem>
      <TimelineItem
        marker={
          <Avatar color="gray">
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
        }
        title="Mike Chen"
        tag={
          <Tag variant="warning" size="sm">
            Internal note
          </Tag>
        }
        timestamp={TIMESTAMP}
      >
        Escalating to tier 2 if the region does not recover within the hour.
      </TimelineItem>
      <TimelineItem
        marker={
          <Avatar color="blue">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        }
        title="AI analysis completed"
        timestamp={TIMESTAMP}
      >
        Root cause matched a known storage-throttling pattern.
      </TimelineItem>
    </Timeline>
  ),
};

// The footer-actions slot (the design's FooterActions), with the content slot
// carrying a properties list rather than plain prose.
export const WithActionsAndProperties: Story = {
  render: () => (
    <Timeline className="w-[560px]">
      <TimelineItem
        status="critical"
        icon={<DiamondWarningIcon size={16} />}
        title="Error — Protection plan 'ui-perf-protection-plan'"
        timestamp="01:54 AM – 03:54 AM (2 hrs 0 min)"
        actions={
          <>
            <Link href="#support">Get support</Link>
            <Link href="#properties">All properties</Link>
          </>
        }
      >
        <p>The cloud storage is temporarily unavailable.</p>
        {/* `-mx-4` cancels the item card's own padding so the row dividers run
            full-bleed, the way the design's properties table does; the rows then
            re-inset to the card's own 16px rhythm (DescriptionListItem defaults
            to the 24px card padding). */}
        <DescriptionList className="-mx-4 [&>div]:px-4">
          <DescriptionListItem>
            <DescriptionListLabel>Status</DescriptionListLabel>
            <DescriptionListValue>Error</DescriptionListValue>
          </DescriptionListItem>
          <DescriptionListItem>
            <DescriptionListLabel>Asset</DescriptionListLabel>
            <DescriptionListValue>Phoenix-12A78</DescriptionListValue>
          </DescriptionListItem>
          <DescriptionListItem>
            <DescriptionListLabel>Started by</DescriptionListLabel>
            <DescriptionListValue>On schedule</DescriptionListValue>
          </DescriptionListItem>
          <DescriptionListItem>
            <DescriptionListLabel>Bytes processed</DescriptionListLabel>
            <DescriptionListValue>256 KB</DescriptionListValue>
          </DescriptionListItem>
        </DescriptionList>
      </TimelineItem>
      <TimelineItem
        status="success"
        icon={<CircleCheckIcon size={16} />}
        title="Retry succeeded"
        timestamp={TIMESTAMP}
        actions={<Button variant="ghost">View report</Button>}
      >
        The plan completed on the second attempt.
      </TimelineItem>
    </Timeline>
  ),
};

// A single item, to show the connector is hidden when there is nothing to
// connect to.
export const SingleItem: Story = {
  render: () => (
    <Timeline className="w-[560px]">
      <TimelineItem status="info" title="Ticket created" timestamp={TIMESTAMP}>
        The only event so far.
      </TimelineItem>
    </Timeline>
  ),
};

// An item's content slot can host another Timeline — the design's nested
// activity case.
export const Nested: Story = {
  render: () => (
    <Timeline className="w-[560px]">
      <TimelineItem
        status="warning"
        icon={<TriangleWarningIcon size={16} />}
        title="Backup run"
        timestamp="01:54 AM – 03:54 AM (2 hrs 0 min)"
      >
        <p>Completed with warnings.</p>
        <Timeline>
          <TimelineItem
            status="warning"
            icon={<TriangleWarningIcon size={16} />}
            title="Warning"
            timestamp={TIMESTAMP}
          >
            The cloud storage is temporarily unavailable.
          </TimelineItem>
          <TimelineItem
            status="critical"
            icon={<DiamondWarningIcon size={16} />}
            title="Error"
            timestamp={TIMESTAMP}
          >
            One asset could not be processed.
          </TimelineItem>
        </Timeline>
      </TimelineItem>
      <TimelineItem status="success" title="Run closed" timestamp={TIMESTAMP}>
        Report generated.
      </TimelineItem>
    </Timeline>
  ),
};
