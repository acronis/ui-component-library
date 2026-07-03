import { Button, ButtonGroup } from '@spec-lab/ui-react';

export function ButtonGroupSizes() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Small</p>
        <ButtonGroup>
          <Button variant="secondary">Small</Button>
          <Button variant="secondary">Buttons</Button>
          <Button variant="secondary">Group</Button>
        </ButtonGroup>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Default</p>
        <ButtonGroup>
          <Button variant="secondary">Default</Button>
          <Button variant="secondary">Buttons</Button>
          <Button variant="secondary">Group</Button>
        </ButtonGroup>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Large</p>
        <ButtonGroup>
          <Button variant="secondary">Large</Button>
          <Button variant="secondary">Buttons</Button>
          <Button variant="secondary">Group</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
