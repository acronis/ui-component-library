import * as React from 'react';
import {
  ButtonGroup,
  ButtonGroupText,
  ButtonIcon,
} from '@spec-lab/ui-react';
import { MagnifierMinusIcon, MagnifierPlusIcon } from '@spec-lab/icons-react/stroke-mono'
export function ButtonGroupZoomControls() {
  const [zoom, setZoom] = React.useState(100);

  return (
    <ButtonGroup>
      <ButtonIcon
        variant="secondary"
        aria-label="Zoom out"
        onClick={() => setZoom(Math.max(25, zoom - 25))}
      >
        <MagnifierMinusIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonGroupText className="min-w-[80px] justify-center">
        {zoom}%
      </ButtonGroupText>
      <ButtonIcon
        variant="secondary"
        aria-label="Zoom in"
        onClick={() => setZoom(Math.min(200, zoom + 25))}
      >
        <MagnifierPlusIcon className="h-4 w-4" />
      </ButtonIcon>
    </ButtonGroup>
  );
}
