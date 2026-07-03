import { ButtonGroup, ButtonIcon } from '@spec-lab/ui-react';
import { BoldIcon, ItalicIcon, UnderlineIcon } from '../icons/missing-icons';
export function ButtonGroupWithIcons() {
  return (
    <ButtonGroup>
      <ButtonIcon variant="secondary" aria-label="Bold">
        <BoldIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonIcon variant="secondary" aria-label="Italic">
        <ItalicIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonIcon variant="secondary" aria-label="Underline">
        <UnderlineIcon className="h-4 w-4" />
      </ButtonIcon>
    </ButtonGroup>
  );
}
