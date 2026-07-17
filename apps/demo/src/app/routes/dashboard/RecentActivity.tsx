import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DetailList,
  type DetailListItem,
  Badge,
  type BadgeProps,
  Skeleton,
  Empty,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from '@constructor-lab/ui-react';
import { InboxIcon } from '@constructor-lab/icons-react/stroke-mono';
import { formatDistanceToNow } from 'date-fns';
import type { ActivityLog, ActivityLogEntry } from '../../types';

interface RecentActivityProps {
  activities: ActivityLog;
  maxItems?: number;
  isLoading?: boolean;
}

// Maps an entry's status onto the shared Badge status palette so the type chip
// also encodes success / warning / error at a glance.
const statusVariant: Record<
  NonNullable<ActivityLogEntry['status']>,
  BadgeProps['variant']
> = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
};

// The activity feed composed from a Card + the DetailList composite: each entry
// becomes a label/value row (relative time → message), with the user as the muted
// description and a status-colored Badge as the row action. When there are no
// entries the shared Empty parts render instead.
export function RecentActivity({
  activities,
  maxItems = 5,
  isLoading = false,
}: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(maxItems)].map((_, i) => (
              // eslint-disable-next-line @eslint-react/no-array-index-key -- fixed-length skeleton placeholders, never reordered
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="mt-2 h-2 w-2 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedActivities = activities.slice(0, maxItems);

  const items: DetailListItem[] = displayedActivities.map((activity) => ({
    id: activity.id,
    label: formatDistanceToNow(activity.timestamp, { addSuffix: true }),
    value: activity.message,
    description: activity.user,
    actions: (
      <Badge
        variant={activity.status ? statusVariant[activity.status] : 'neutral'}
        size="sm"
      >
        {activity.type}
      </Badge>
    ),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and events</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <Empty className="mx-auto py-8">
            <EmptyHeader>
              <EmptyIcon>
                <InboxIcon />
              </EmptyIcon>
              <EmptyTitle>No recent activity</EmptyTitle>
              <EmptyDescription>
                Actions and events will appear here as they happen.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DetailList items={items} labelWidth="9rem" />
        )}
      </CardContent>
    </Card>
  );
}
