import * as React from 'react';
import { ButtonGroup, ButtonIcon } from '@spec-lab/ui-react';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from '../icons/missing-icons';
export function ButtonGroupTextAlignment() {
  const [alignment, setAlignment] = React.useState<string>('left');

  return (
    <ButtonGroup>
      <ButtonIcon
        variant={alignment === 'left' ? 'secondary' : 'ghost'}
        aria-label="Align left"
        onClick={() => setAlignment('left')}
      >
        <AlignLeftIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonIcon
        variant={alignment === 'center' ? 'secondary' : 'ghost'}
        aria-label="Align center"
        onClick={() => setAlignment('center')}
      >
        <AlignCenterIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonIcon
        variant={alignment === 'right' ? 'secondary' : 'ghost'}
        aria-label="Align right"
        onClick={() => setAlignment('right')}
      >
        <AlignRightIcon className="h-4 w-4" />
      </ButtonIcon>
    </ButtonGroup>
  );
}
