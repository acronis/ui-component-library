import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonIcon,
} from '@constructor-lab/ui-react';
import {
  ClipboardIcon,
  FilesIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { RedoIcon, ScissorsIcon, UndoIcon } from '../icons/missing-icons';
export function ButtonGroupWithSeparators() {
  return (
    <ButtonGroup>
      <ButtonIcon variant="secondary" aria-label="Undo">
        <UndoIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonIcon variant="secondary" aria-label="Redo">
        <RedoIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonGroupSeparator />
      <ButtonIcon variant="secondary" aria-label="Copy">
        <FilesIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonIcon variant="secondary" aria-label="Cut">
        <ScissorsIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonIcon variant="secondary" aria-label="Paste">
        <ClipboardIcon className="h-4 w-4" />
      </ButtonIcon>
    </ButtonGroup>
  );
}
