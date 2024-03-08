const easeInOutCubic = (t) => (
  t < 0.5
    ? 4 * t * t * t
    : ((t - 1) * ((2 * t) - 2) * ((2 * t) - 2)) + 1
);

/**
 * Smooth scroll. Similar to CSS property scroll-behavior: smooth;
 * @param  {HTMLElement}   el            The HTML element
 * @param  {string}       direction     "horitonzal" or "vertical"
 * @param  {number}       endPosition   The end position of either `scrollLeft` or `scrollTop`
 * @param  {number}       duration      The duration of scrolling
 */
const smoothScrollTo = (el, direction, endPosition, duration) => {
  const startTime = new Date();
  const startPosition = direction === 'horizontal' ? el.scrollLeft : el.scrollTop;

  const step = () => {
    const elapsed = Date.now() - startTime;
    let position = endPosition;
    if (elapsed < duration) {
      position = startPosition + ((endPosition - startPosition) * easeInOutCubic(elapsed / duration));
      window.requestAnimationFrame(step);
    }
    el.scrollLeft = position;
  };

  step();
};

export default smoothScrollTo;
