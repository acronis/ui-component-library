/// <reference lib="dom" />
// Browser probe for the screen audit.
//
// `collectScreenSnapshot` is meant to run **inside the page** — it is passed to
// Playwright's `page.evaluate(...)` (the existing VR harness) or injected via the
// chrome-devtools MCP `evaluate_script` against a running Storybook story. Because
// the function is serialized and re-parsed in the browser, it MUST be fully
// self-contained: every helper is declared inside it, and it references only DOM
// globals and its single argument — no module-scope imports at runtime.
//
// It returns a plain `ScreenSnapshot` (see ./types.ts) with no DOM handles, so the
// pure detectors can run over it in Node. See context/kit-consistency-audit-proposal.md §7.2.
import type { ScreenSnapshot, SnapshotNode } from './types';

export interface ProbeOptions {
  screen: string;
  story?: string;
  colorMode: 'light' | 'dark';
  /** Root to measure under (defaults to `#storybook-root`, then `body`). */
  rootSelector?: string;
  /** Cap on text length captured per node. */
  maxText?: number;
}

export function collectScreenSnapshot(opts: ProbeOptions): ScreenSnapshot {
  const maxText = opts.maxText ?? 80;
  const root =
    (opts.rootSelector && document.querySelector(opts.rootSelector)) ||
    document.querySelector('#storybook-root') ||
    document.body;

  const LANDMARK_TAG: Record<string, string> = {
    HEADER: 'banner',
    NAV: 'navigation',
    MAIN: 'main',
    ASIDE: 'complementary',
    FOOTER: 'contentinfo',
  };
  const LANDMARK_ROLE = new Set([
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'region',
    'search',
  ]);
  const INTERACTIVE_TAG = new Set([
    'BUTTON',
    'A',
    'INPUT',
    'SELECT',
    'TEXTAREA',
  ]);
  const INTERACTIVE_ROLE = new Set([
    'button',
    'link',
    'checkbox',
    'radio',
    'switch',
    'menuitem',
    'tab',
    'combobox',
    'textbox',
    'slider',
    'option',
    'searchbox',
  ]);

  const landmarkOf = (el: Element): { el: Element; role: string } | null => {
    let cur: Element | null = el;
    while (cur && cur !== document.documentElement) {
      const role = cur.getAttribute('role');
      if (role && LANDMARK_ROLE.has(role)) return { el: cur, role };
      const tagRole = LANDMARK_TAG[cur.tagName];
      if (tagRole) return { el: cur, role: tagRole };
      cur = cur.parentElement;
    }
    return null;
  };

  /**
   * The colour the UA paints behind a page where nothing else does.
   *
   * This used to be a flat `rgb(255, 255, 255)`, which silently assumed every
   * unpainted document is light. It is not: when the used value of
   * `color-scheme` is dark the browser paints the canvas dark, so on a
   * Storybook story — where nothing sets a background and the canvas IS the
   * background — every light-on-dark label scored as ~1:1 against an imaginary
   * white. That produced three false contrast findings on Accordion alone.
   *
   * `rgb(18, 18, 18)` is Chromium's dark canvas, taken empirically rather than
   * from memory: it is the corner pixel of the committed
   * `ui-accordion--default--dark.png`, i.e. measured from the exact renderer
   * this repo's baselines come from (the light baseline's corner is
   * `rgb(255, 255, 255)`, matching the other branch).
   */
  const canvasColor = (): string => {
    const scheme = getComputedStyle(document.documentElement).colorScheme || '';
    const prefersDark =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-color-scheme: dark)').matches;
    // `light dark` defers to the OS; a lone `dark` (or `only dark`) does not.
    const dark =
      scheme.includes('dark') && (!scheme.includes('light') || prefersDark);
    return dark ? 'rgb(18, 18, 18)' : 'rgb(255, 255, 255)';
  };

  /** `rgb()` / `rgba()` → channels + alpha, or null if unparseable. */
  const parseColor = (
    c: string
  ): { r: number; g: number; b: number; a: number } | null => {
    const m = c.match(
      /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?/
    );
    if (!m) return null;
    return {
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] === undefined ? 1 : Number(m[4]),
    };
  };

  /**
   * The colour actually painted behind `el`, with translucent layers composited.
   *
   * ── WHY THIS IS NOT "THE FIRST NON-TRANSPARENT ANCESTOR" ────────────────────
   * It used to be, and that produced **4536 false findings in one sweep — 74% of
   * the total**, all from a single pattern: an `rgba(0, 0, 0, 0.01)` hairline
   * wash (Storybook's docs surfaces use one). That is not transparent by the old
   * `isTransparent` test, which only recognised exactly-zero alpha, so the walk
   * stopped there and handed the detector a *black* background — the alpha was
   * dropped entirely, because the scoring code reads only the RGB channels.
   * Near-black text on a near-invisible wash scored 1.65:1 while really sitting
   * on white.
   *
   * Raising the alpha threshold would only move the cliff. The honest fix is to
   * do what the compositor does: collect every layer up to the first fully
   * opaque one, then blend them back down with the `over` operator. A 1%-alpha
   * layer now shifts the result by 1%, which is what it does on screen.
   */
  const effectiveBg = (el: Element): string => {
    const layers: { r: number; g: number; b: number; a: number }[] = [];
    let cur: Element | null = el;
    while (cur) {
      const c = parseColor(getComputedStyle(cur).backgroundColor);
      if (c && c.a > 0) {
        layers.push(c);
        // Nothing below a fully opaque layer can show through.
        if (c.a >= 1) break;
      }
      cur = cur.parentElement;
    }

    // Base is the UA canvas; an opaque final layer simply overwrites it.
    let base = parseColor(canvasColor()) ?? { r: 255, g: 255, b: 255, a: 1 };
    // Composite far-to-near: the last layer collected is the furthest ancestor.
    for (let i = layers.length - 1; i >= 0; i -= 1) {
      const l = layers[i];
      base = {
        r: l.r * l.a + base.r * (1 - l.a),
        g: l.g * l.a + base.g * (1 - l.a),
        b: l.b * l.a + base.b * (1 - l.a),
        a: 1,
      };
    }
    return `rgb(${Math.round(base.r)}, ${Math.round(base.g)}, ${Math.round(base.b)})`;
  };

  const accessibleName = (el: Element): string | null => {
    const label = el.getAttribute('aria-label');
    if (label && label.trim()) return label.trim();
    const labelledby = el.getAttribute('aria-labelledby');
    if (labelledby) {
      const text = labelledby
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
        .filter(Boolean)
        .join(' ');
      if (text) return text;
    }
    const title = el.getAttribute('title');
    if (title && title.trim()) return title.trim();
    if (el.tagName === 'IMG') {
      const alt = el.getAttribute('alt');
      if (alt && alt.trim()) return alt.trim();
    }
    const txt = (el.textContent ?? '').trim();
    return txt || null;
  };

  // Short, reasonably-stable locator for reporting.
  const refOf = (el: Element): string => {
    const parts: string[] = [];
    let cur: Element | null = el;
    let depth = 0;
    while (cur && cur !== root && cur !== document.body && depth < 4) {
      const tag = cur.tagName.toLowerCase();
      const parent = cur.parentElement;
      if (parent) {
        const sameTag = Array.prototype.filter.call(
          parent.children,
          (c: Element) => c.tagName === cur!.tagName
        );
        const idx = sameTag.indexOf(cur);
        parts.unshift(
          sameTag.length > 1 ? `${tag}:nth-of-type(${idx + 1})` : tag
        );
      } else {
        parts.unshift(tag);
      }
      cur = cur.parentElement;
      depth += 1;
    }
    return parts.join(' > ') || el.tagName.toLowerCase();
  };

  // True when `el` or any ancestor is disabled — used to exempt inactive
  // components from the contrast check (WCAG 1.4.3).
  const inDisabledTree = (el: Element): boolean => {
    let cur: Element | null = el;
    while (cur) {
      if (
        cur.hasAttribute('disabled') ||
        cur.getAttribute('aria-disabled') === 'true'
      )
        return true;
      cur = cur.parentElement;
    }
    return false;
  };

  // Text painted by `el` itself (direct text-node children), not its subtree —
  // so a container that only wraps text-bearing children reports "".
  const directText = (el: Element): string => {
    let s = '';
    el.childNodes.forEach((n) => {
      if (n.nodeType === 3) s += n.textContent ?? '';
    });
    return s;
  };

  const num = (v: string): number => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const nodes: SnapshotNode[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let el: Element | null;
  // The TreeWalker starts on `root` itself; iterate over descendants.
  for (
    el = walker.nextNode() as Element | null;
    el;
    el = walker.nextNode() as Element | null
  ) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;

    const role = el.getAttribute('role');
    const lm = landmarkOf(el);
    const tag = el.tagName.toLowerCase();
    const isIcon =
      el.tagName === 'svg' || el.getAttribute('data-slot') === 'icon';
    const isControl =
      INTERACTIVE_TAG.has(el.tagName) ||
      (role != null && INTERACTIVE_ROLE.has(role));
    const isDisabled =
      el.hasAttribute('disabled') ||
      el.getAttribute('aria-disabled') === 'true';
    const interactive = isControl && !isDisabled;
    const disabled = isControl && isDisabled;

    const borderX = num(style.borderLeftWidth) + num(style.borderRightWidth);
    const borderY = num(style.borderTopWidth) + num(style.borderBottomWidth);
    const he = el as HTMLElement;
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const scrollsY =
      (overflowY === 'auto' || overflowY === 'scroll') &&
      he.scrollHeight > he.clientHeight + 1;
    const scrollsX =
      (overflowX === 'auto' || overflowX === 'scroll') &&
      he.scrollWidth > he.clientWidth + 1;
    const gutterX = scrollsY
      ? Math.max(0, Math.round(he.offsetWidth - he.clientWidth - borderX))
      : 0;
    const gutterY = scrollsX
      ? Math.max(0, Math.round(he.offsetHeight - he.clientHeight - borderY))
      : 0;

    nodes.push({
      ref: refOf(el),
      tag,
      role,
      region: lm?.role ?? null,
      regionChild: lm ? el.parentElement === lm.el : false,
      text: (el.textContent ?? '').trim().slice(0, maxText),
      ownText: directText(el).trim().slice(0, maxText),
      visuallyHidden:
        rect.width <= 2 ||
        rect.height <= 2 ||
        rect.x + rect.width <= 0 ||
        rect.y + rect.height <= 0,
      disabledContext: inDisabledTree(el),
      accessibleName:
        interactive || disabled || el.tagName === 'IMG'
          ? accessibleName(el)
          : null,
      interactive,
      disabled,
      isIcon,
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      opacity: style.opacity === '' ? 1 : num(style.opacity),
      color: style.color,
      backgroundColor: effectiveBg(el),
      fontSize: Math.round(num(style.fontSize) * 100) / 100,
      fontWeight: num(style.fontWeight) || 400,
      borderRadius: Math.round(num(style.borderTopLeftRadius)),
      gutterX,
      gutterY,
    });
  }

  return {
    screen: opts.screen,
    story: opts.story,
    colorMode: opts.colorMode,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    nodes,
  };
}
