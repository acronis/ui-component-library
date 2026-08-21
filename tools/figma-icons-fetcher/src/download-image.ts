import fs from 'node:fs/promises';
import path from 'node:path';

import { optimize, type Config } from 'svgo';

import { fixDegenerateCloses } from './fix-degenerate-close';
import { fetchWithRetry } from './http';
import { escapeRegExp, formatName, isMulticolor } from './helpers';
import type { FetcherConfig, DownloadedIcon, IconWithUrl } from './types';

/**
 * Downloads an SVG icon from Figma and saves it as an optimized SVG file.
 * Supports saving to multiple directories. Color categorization (mono/multi)
 * is handled separately so legacy icons are never deleted.
 */
export async function downloadImage(
  config: FetcherConfig,
  icon: IconWithUrl
): Promise<DownloadedIcon> {
  const url = icon.image;
  const formattedName = formatName(icon.name);

  if (!url) {
    throw new Error(`Icon "${icon.name}" (ID: ${icon.id}) has no image URL`);
  }

  try {
    // Retry + the configured timeout both come from `http.ts`: Figma's image CDN
    // drops connections and rate-limits during large batch downloads, and a
    // single transient failure would otherwise reject the whole chunk.
    const svgText = await (await fetchWithRetry(url)).text();

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

    // SVGO's relative-coordinate output can leave a sub-epsilon `Z` segment,
    // which browsers render as a miter spike at the subpath start. Snap those
    // closes shut before anything else looks at the markup.
    const optimizedData = fixDegenerateCloses(optimizedSvg.data);

    // Detect multicolor before any color substitution so the system color is
    // counted as a real color (it contributes to the palette in multicolor icons).
    const iconIsMulticolor = isMulticolor(optimizedData);

    // Replace system color with currentColor for theming — monocolor icons only.
    // Multicolor icons intentionally use the system color as a fill/accent, so
    // replacing it would break their appearance (e.g. a blue circle becoming black).
    const systemColorRegex = new RegExp(escapeRegExp(config.systemColor), 'gi');
    const content = iconIsMulticolor
      ? optimizedData
      : optimizedData.replace(systemColorRegex, 'currentColor');

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
    throw new Error(`Failed to download icon "${icon.name}" (ID: ${icon.id})`, {
      cause: err,
    });
  }
}
