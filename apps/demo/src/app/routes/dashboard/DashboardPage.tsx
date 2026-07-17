import * as React from 'react';
import {
  PageHeader,
  PageHeaderRow,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  Badge,
} from '@constructor-lab/ui-react';
import { CalendarClockIcon } from '@constructor-lab/icons-react/stroke-mono';
import { MetricsCards } from './MetricsCards';
import { ChartsSection } from './ChartsSection';
import { RecentActivity } from './RecentActivity';
import {
  generateDashboardMetrics,
  generateTimeSeriesData,
  generateCategoryData,
  generateDistributionData,
  generateRecentActivity,
} from '../../lib/mock-data';
import { useLocale } from '../../context/LocaleContext';

export function DashboardPage() {
  const { t } = useLocale();
  const [metrics, setMetrics] = React.useState(() =>
    generateDashboardMetrics()
  );
  const [timeSeriesData] = React.useState(() => generateTimeSeriesData(30));
  const [categoryData, setCategoryData] = React.useState(() =>
    generateCategoryData()
  );
  const [distributionData, setDistributionData] = React.useState(() =>
    generateDistributionData()
  );
  const [recentActivity] = React.useState(() => generateRecentActivity());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateDashboardMetrics());
      setCategoryData(generateCategoryData());
      setDistributionData(generateDistributionData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader className="pb-0">
        <PageHeaderRow>
          <div className="flex flex-col gap-2">
            <PageHeaderTitle>{t('navigation.dashboard')}</PageHeaderTitle>
            <PageHeaderDescription>
              {t('messages.welcome', { username: 'User' })}
            </PageHeaderDescription>
          </div>
          <PageHeaderActions>
            <Badge variant="neutral">
              <CalendarClockIcon />
              Last 30 days
            </Badge>
          </PageHeaderActions>
        </PageHeaderRow>
      </PageHeader>

      <MetricsCards metrics={metrics} />

      <ChartsSection
        timeSeriesData={timeSeriesData}
        categoryData={categoryData}
        distributionData={distributionData}
      />

      <RecentActivity activities={recentActivity} maxItems={5} />
    </div>
  );
}
