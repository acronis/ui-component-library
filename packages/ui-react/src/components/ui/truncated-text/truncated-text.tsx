import * as React from 'react';

import { cn } from '@/lib/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';

type TooltipContentProps = React.ComponentPropsWithoutRef<
  typeof TooltipContent
>;

export interface TruncatedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The text to display. Also used verbatim as the tooltip body when truncated. */
  children: string;
  /** Which side the tooltip opens on. Defaults to `top`. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Max lines before truncating. `1` (default) = single-line ellipsis; `>1` = a
   * multi-line clamp. The tooltip appears only when the text is actually clipped.
   */
  lines?: number;
  /**
   * Force the tooltip open on mount (only has effect when the text is truncated).
   * Mainly for stories / visual review; normal usage reveals it on hover/focus.
   */
  defaultOpen?: boolean;
  /**
   * Container the tooltip popup portals into. Pass a shadow root (e.g. a
   * micro-frontend mount point) so the popup inherits the kit's styles; defaults
   * to the document body.
   */
  portalContainer?: TooltipContentProps['portalContainer'];
}

/**
 * Text that truncates with an ellipsis and reveals its full value in a tooltip
 * **only when it's actually clipped** — the tooltip is skipped when everything
 * fits, so short cells don't get a pointless hover target. Ideal for table cells.
 *
 * Truncation is detected by comparing scroll vs client size and re-checked on
 * resize, so it stays correct as columns / viewport change.
 */
export const TruncatedText = React.forwardRef<
  HTMLSpanElement,
  TruncatedTextProps
>(function TruncatedText(
  {
    children,
    className,
    side = 'top',
    lines = 1,
    defaultOpen,
    portalContainer,
    ...rest
  },
  forwardedRef
) {
  const innerRef = React.useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = React.useState(false);

  // The component owns a ref for overflow measurement; still forward it so
  // callers can reach the underlying span.
  const setRef = React.useCallback(
    (node: HTMLSpanElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  React.useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) return;
    // +1 guards against sub-pixel rounding falsely reporting overflow.
    // Genuine DOM-measuring layout effect: overflow can only be read after
    // layout, so the sync setState here is required, not incidental.
    const check = () =>
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- measure-then-set is the point of this effect
      setTruncated(
        lines > 1
          ? node.scrollHeight > node.clientHeight + 1
          : node.scrollWidth > node.clientWidth + 1
      );
    check();
    const observer = new ResizeObserver(check);
    observer.observe(node);
    return () => observer.disconnect();
    // `truncated` is a dep so the observer re-attaches to the span after it moves
    // into / out of the tooltip trigger on the truncation flip.
  }, [children, lines, truncated]);

  const multiline = lines > 1;
  const style: React.CSSProperties | undefined = multiline
    ? {
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }
    : undefined;

  const text = (
    <span
      ref={setRef}
      className={cn(
        'block',
        multiline ? 'overflow-hidden' : 'truncate',
        className
      )}
      style={style}
      {...rest}
    >
      {children}
    </span>
  );

  if (!truncated) return text;

  return (
    <TooltipProvider>
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger render={text} />
        <TooltipContent side={side} portalContainer={portalContainer}>
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
TruncatedText.displayName = 'TruncatedText';
