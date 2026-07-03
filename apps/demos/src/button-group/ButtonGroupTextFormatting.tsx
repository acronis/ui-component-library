import * as React from 'react';
import { ButtonGroup, ButtonIcon } from '@spec-lab/ui-react';
import { BoldIcon, ItalicIcon, UnderlineIcon } from '../icons/missing-icons';
export function ButtonGroupTextFormatting() {
  const [textFormat, setTextFormat] = React.useState<string[]>([]);

  const toggleFormat = (format: string) => {
    setTextFormat((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  return (
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
  );
}
