import { Button, ButtonIcon } from '@spec-lab/ui-react';

export function ButtonSizes() {
  return (
    <div className="button-grid">
      <Button>Small</Button>
      <Button>Default</Button>
      <Button>Large</Button>
      <ButtonIcon aria-label="More options" variant="secondary">
        ⋯
      </ButtonIcon>
    </div>
  );
}
