import { Button, ButtonGroup } from '@spec-lab/ui-react';
import { ListIcon } from '@spec-lab/icons-react/stroke-mono'
import { ListOrderedIcon } from '../icons/missing-icons';
export function ButtonGroupWithTextLabels() {
  return (
    <ButtonGroup>
      <Button variant="secondary">
        <ListIcon className="mr-2 h-4 w-4" />
        Bullet List
      </Button>
      <Button variant="secondary">
        <ListOrderedIcon className="mr-2 h-4 w-4" />
        Numbered List
      </Button>
    </ButtonGroup>
  );
}
