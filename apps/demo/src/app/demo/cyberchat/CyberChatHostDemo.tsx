import { useState, useRef, useCallback, useEffect } from 'react';
import {
  applyBrand,
  getCurrentBrand,
  type BrandName,
} from '@/lib/theme-switcher';
import { CyberChatPage } from './CyberChatPage';

const THEMES: { value: BrandName; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'purple', label: 'Purple' },
  { value: 'telstra', label: 'Telstra' },
  { value: 'ingram-micro', label: 'Ingram Micro' },
  { value: 'dark-gray', label: 'Dark Gray' },
  { value: 'sand', label: 'Sand' },
];

function getBrandAttr(el: HTMLElement | null): string {
  if (!el) return '—';
  return el.getAttribute('data-brand') ?? '—';
}

/**
 * Simulates how a host app embeds CyberChat and applies branding via applyBrand.
 *
 * The "embedded app" container is passed as extraRoots to applyBrand(), so the
 * `data-brand` attribute lands on the inner container directly — matching how
 * cyberchat-ui works in production with shadow DOM roots.
 */
export function CyberChatHostDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTheme, setActiveTheme] = useState<BrandName>(() =>
    getCurrentBrand()
  );
  const [applyToContainer, setApplyToContainer] = useState(true);
  const [documentClasses, setDocumentClasses] = useState('—');
  const [containerClasses, setContainerClasses] = useState('—');

  const applySelectedTheme = useCallback(
    (theme: BrandName, toContainer: boolean) => {
      const extraRoots =
        toContainer && containerRef.current ? [containerRef.current] : [];
      applyBrand(theme, true, extraRoots);
      setActiveTheme(theme);
      setDocumentClasses(getBrandAttr(document.documentElement));
      setContainerClasses(getBrandAttr(containerRef.current));
    },
    []
  );

  useEffect(() => {
    const extraRoots =
      applyToContainer && containerRef.current ? [containerRef.current] : [];
    applyBrand(activeTheme, true, extraRoots);
    // Reflect the DOM brand attributes applied above into display-only state on mount.
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- syncing DOM attrs written by applyBrand into display state after mount
    setDocumentClasses(getBrandAttr(document.documentElement));
    setContainerClasses(getBrandAttr(containerRef.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleThemeChange = (theme: BrandName) => {
    applySelectedTheme(theme, applyToContainer);
  };

  const handleContainerToggle = (checked: boolean) => {
    setApplyToContainer(checked);
    applySelectedTheme(activeTheme, checked);
  };

  return (
    <div className="flex flex-col h-screen bg-muted">
      {/* Host App Controls Bar */}
      <div className="flex-shrink-0 flex items-center gap-4 px-4 py-2 bg-background border-b shadow-xs flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Host App
        </span>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Theme:</span>
          {THEMES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={`px-3 py-1 rounded text-sm border transition-colors ${
                activeTheme === value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-accent border-input text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none ml-auto">
          <input
            type="checkbox"
            checked={applyToContainer}
            onChange={(e) => handleContainerToggle(e.target.checked)}
            className="w-4 h-4"
          />
          Apply to inner container
          <span className="text-xs text-muted-foreground">
            (
            {applyToContainer
              ? 'extraRoots enabled'
              : 'document.documentElement only'}
            )
          </span>
        </label>
      </div>

      {/* Class inspector */}
      <div className="flex-shrink-0 flex gap-6 px-4 py-1 bg-muted/50 border-b text-xs font-mono text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">document: </span>
          {documentClasses}
        </span>
        <span>
          <span className="font-semibold text-foreground">container: </span>
          {containerClasses}
        </span>
      </div>

      {/* Embedded App Container — represents the shadow DOM inner container */}
      <div className="flex-1 overflow-hidden border-2 border-dashed border-primary/30 m-2 rounded-lg">
        <div ref={containerRef} className="h-full">
          <CyberChatPage />
        </div>
      </div>
    </div>
  );
}
