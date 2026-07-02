import fs from 'node:fs/promises';
import path from 'node:path';

import { optimize, type Config } from 'svgo';

import { escapeRegExp, formatName, isMulticolor } from './helpers';
import type { FetcherConfig, DownloadedIcon, IconWithUrl } from './types';

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 500;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches an SVG with retry + exponential backoff. Figma's image CDN
 * intermittently drops connections (ECONNRESET) or rate-limits (429) during
 * large batch downloads, and a single transient failure would otherwise reject
 * the whole chunk. Only transient failures (network errors, 429, 5xx) are
 * retried; a definitive 4xx fails fast.
 */
async function fetchSvgWithRetry(url: string): Promise<string> {
  let lastErr: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.text();
      }
      // A definitive 4xx (other than 429) won't succeed on retry — fail fast.
      const transient = response.status === 429 || response.status >= 500;
      lastErr = new Error(`HTTP ${response.status}: ${response.statusText}`);
      if (!transient) {
        throw lastErr;
      }
    } catch (err) {
      // Re-throw the non-transient HTTP error so it isn't silently retried.
      if (err === lastErr) throw err;
      // Otherwise a network-level failure (e.g. ECONNRESET) — retry it.
      lastErr = err;
    }

    if (attempt < MAX_ATTEMPTS) {
      await delay(BASE_DELAY_MS * 2 ** (attempt - 1));
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

/**
 * Downloads an SVG icon from Figma and saves it as an optimized SVG file.
 * Supports saving to multiple directories. Color categorization (mono/multi)
 * is handled separately so legacy icons are never deleted.
 */
export async function downloadImage(config: FetcherConfig, icon: IconWithUrl): Promise<DownloadedIcon> {
  const url = icon.image;
  const formattedName = formatName(icon.name);

  if (!url) {
    throw new Error(`Icon "${icon.name}" (ID: ${icon.id}) has no image URL`);
  }

  try {
    // Fetch SVG content (with retry — Figma's image CDN drops connections
    // intermittently during large batch downloads).
    const svgText = await fetchSvgWithRetry(url);

    // Build SVGO plugins list
    const plugins: Config['plugins'] = [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // SVGO v4 drops removeViewBox from preset-default, so viewBox is
            // already preserved by default (needed to resize SVGs with CSS) —
            // do not re-add removeViewBox here.
            // Keep precision higher for cleaner diagonals.
            cleanupNumericValues: { floatPrecision: 4 },
            convertPathData: { floatPrecision: 4 },
          },
        },
      },
      'removeDimensions',
      {
        name: 'prefixIds',
        params: {
          delim: '-',
          prefix: formattedName.replace(/[/\\]/g, '-'),
        },
      },
    ];

    // Only add className if it's defined
    if (config.className) {
      plugins.push({
        name: 'addClassesToSVGElement',
        params: {
          className: config.className,
        },
      });
    }

    // Optimize SVG
    const optimizedSvg = optimize(svgText, { plugins });

    // Detect multicolor before any color substitution so the system color is
    // counted as a real color (it contributes to the palette in multicolor icons).
    const iconIsMulticolor = isMulticolor(optimizedSvg.data);

    // Replace system color with currentColor for theming — monocolor icons only.
    // Multicolor icons intentionally use the system color as a fill/accent, so
    // replacing it would break their appearance (e.g. a blue circle becoming black).
    const systemColorRegex = new RegExp(escapeRegExp(config.systemColor), 'gi');
    const content = iconIsMulticolor
      ? optimizedSvg.data
      : optimizedSvg.data.replace(systemColorRegex, 'currentColor');

    // Determine output directories (excluding mono/multi - those are handled separately)
    const outputDirs = [config.outputDir, ...config.outputDirs];

    // Save to all output directories
    const savedPaths: string[] = [];
    for (const dir of outputDirs) {
      const outputPath = path.join(dir, `${formattedName}.svg`);
      const outputDirPath = path.dirname(outputPath);

      // Ensure output directory exists
      await fs.mkdir(outputDirPath, { recursive: true });

      // Write SVG file
      await fs.writeFile(outputPath, content, 'utf8');
      savedPaths.push(outputPath);
    }

    return {
      ...icon,
      isMulticolor: iconIsMulticolor,
      savedPaths,
    };
  } catch (err) {
    throw new Error(`Failed to download icon "${icon.name}" (ID: ${icon.id})`, { cause: err });
  }
}
