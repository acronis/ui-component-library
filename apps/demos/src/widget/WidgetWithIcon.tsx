import {
  Widget,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetActions,
  WidgetContent,
  WidgetValue,
  WidgetLabel,
} from '@spec-lab/ui-react';
import { ButtonIcon } from '@spec-lab/ui-react';
import { ShieldCheckIcon } from '@spec-lab/icons-react/stroke-mono'
import { MoreVerticalIcon } from '../icons/missing-icons';
export function WidgetWithIcon() {
  return (
    <Widget className="w-[350px]">
      <WidgetHeader>
        <WidgetIcon>
          <ShieldCheckIcon className="h-4 w-4" />
        </WidgetIcon>
        <WidgetTitle>Protection Status</WidgetTitle>
        <WidgetActions>
          <ButtonIcon aria-label="More options" variant="ghost" className="h-6 w-6">
            <MoreVerticalIcon className="h-4 w-4" />
          </ButtonIcon>
        </WidgetActions>
      </WidgetHeader>
      <WidgetContent>
        <WidgetValue>All Clear</WidgetValue>
        <WidgetLabel>No issues detected</WidgetLabel>
      </WidgetContent>
    </Widget>
  );
}
