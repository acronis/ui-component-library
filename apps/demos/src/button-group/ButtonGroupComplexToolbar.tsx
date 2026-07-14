import * as React from 'react';
import { Button, ButtonGroup, ButtonIcon } from '@constructor-lab/ui-react';
import { ListIcon } from '@constructor-lab/icons-react/stroke-mono';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  ListOrderedIcon,
  RedoIcon,
  UnderlineIcon,
  UndoIcon,
} from '../icons/missing-icons';
export function ButtonGroupComplexToolbar() {
  const [alignment, setAlignment] = React.useState<string>('left');
  const [textFormat, setTextFormat] = React.useState<string[]>([]);

  const toggleFormat = (format: string) => {
    setTextFormat((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  return (
    <div className="flex flex-wrap gap-4">
      <ButtonGroup>
        <ButtonIcon variant="secondary" aria-label="Undo">
          <UndoIcon className="h-4 w-4" />
        </ButtonIcon>
        <ButtonIcon variant="secondary" aria-label="Redo">
          <RedoIcon className="h-4 w-4" />
        </ButtonIcon>
      </ButtonGroup>

      <ButtonGroup>
        <ButtonIcon
          variant={textFormat.includes('bold') ? 'secondary' : 'ghost'}
          aria-label="Bold"
          onClick={() => toggleFormat('bold')}
        >
          <BoldIcon className="h-4 w-4" />
        </ButtonIcon>
        <ButtonIcon
          variant={textFormat.includes('italic') ? 'secondary' : 'ghost'}
          aria-label="Italic"
          onClick={() => toggleFormat('italic')}
        >
          <ItalicIcon className="h-4 w-4" />
        </ButtonIcon>
        <ButtonIcon
          variant={textFormat.includes('underline') ? 'secondary' : 'ghost'}
          aria-label="Underline"
          onClick={() => toggleFormat('underline')}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ButtonIcon>
      </ButtonGroup>

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

      <ButtonGroup>
        <Button variant="secondary">
          <ListIcon className="mr-2 h-4 w-4" />
          Bullet
        </Button>
        <Button variant="secondary">
          <ListOrderedIcon className="mr-2 h-4 w-4" />
          Numbered
        </Button>
      </ButtonGroup>
    </div>
  );
}
