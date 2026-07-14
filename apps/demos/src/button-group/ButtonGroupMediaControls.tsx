import { ButtonGroup, ButtonIcon } from '@constructor-lab/ui-react';
import {
  MediaPauseIcon,
  MediaPlayIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { SkipBackIcon, SkipForwardIcon } from '../icons/missing-icons';
export function ButtonGroupMediaControls() {
  return (
    <ButtonGroup>
      <ButtonIcon variant="secondary" aria-label="Previous track">
        <SkipBackIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonIcon variant="secondary" aria-label="Play">
        <MediaPlayIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonIcon variant="secondary" aria-label="Pause">
        <MediaPauseIcon className="h-4 w-4" />
      </ButtonIcon>
      <ButtonIcon variant="secondary" aria-label="Next track">
        <SkipForwardIcon className="h-4 w-4" />
      </ButtonIcon>
    </ButtonGroup>
  );
}
