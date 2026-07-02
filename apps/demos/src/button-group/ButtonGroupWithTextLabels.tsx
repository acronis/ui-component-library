import { Button, ButtonGroup } from '@spec-lab/shadcn-uikit/react';
import { ListIcon } from '@spec-lab/shadcn-uikit';
import { ListOrderedIcon } from '../icons/missing-icons';
export function ButtonGroupWithTextLabels() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <ListIcon className="mr-2 h-4 w-4" />
        Bullet List
      </Button>
      <Button variant="outline">
        <ListOrderedIcon className="mr-2 h-4 w-4" />
        Numbered List
      </Button>
    </ButtonGroup>
  );
}
