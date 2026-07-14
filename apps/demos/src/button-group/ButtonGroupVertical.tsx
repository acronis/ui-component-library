import { Button, ButtonGroup } from '@constructor-lab/ui-react';

export function ButtonGroupVertical() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="secondary">Top</Button>
      <Button variant="secondary">Middle</Button>
      <Button variant="secondary">Bottom</Button>
    </ButtonGroup>
  );
}
