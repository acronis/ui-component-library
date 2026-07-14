import * as React from 'react';
import {
  BrushPaintingIcon,
  CheckIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import {
  ButtonIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@constructor-lab/ui-react';
import { cn } from '@constructor-lab/ui-react';
import {
  applyBrand,
  getCurrentBrand,
  type BrandName,
} from '@/lib/theme-switcher';

// The 20 shipped `@constructor-lab/tokens` `[data-brand]` identities, plus `'default'`
// (the `:root` brand). Labels title-case the slug for display.
const BRANDS: { value: BrandName; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'blue-yellow-uss-signal', label: 'Blue Yellow Uss Signal' },
  { value: 'brown', label: 'Brown' },
  { value: 'dark-gray', label: 'Dark Gray' },
  { value: 'deep-purple', label: 'Deep Purple' },
  { value: 'deep-sky-itkontoret', label: 'Deep Sky Itkontoret' },
  { value: 'green-also-choise-df', label: 'Green Also Choise Df' },
  { value: 'ingram-micro', label: 'Ingram Micro' },
  { value: 'light-blue-hp', label: 'Light Blue Hp' },
  { value: 'light-gray', label: 'Light Gray' },
  { value: 'orange-tsukaeru-helpox', label: 'Orange Tsukaeru Helpox' },
  { value: 'pinky', label: 'Pinky' },
  { value: 'purple', label: 'Purple' },
  { value: 'purple-fusion-media', label: 'Purple Fusion Media' },
  { value: 'red-fire-brick', label: 'Red Fire Brick' },
  { value: 'red-home-pl', label: 'Red Home Pl' },
  { value: 'sand', label: 'Sand' },
  { value: 'telstra', label: 'Telstra' },
  { value: 'virtual-one', label: 'Virtual One' },
  { value: 'virtuozzo', label: 'Virtuozzo' },
  { value: 'yellow-1c', label: 'Yellow 1c' },
];

export function BrandSelector() {
  const [activeBrand, setActiveBrand] = React.useState<BrandName>(() =>
    getCurrentBrand()
  );

  const handleBrandChange = (brand: BrandName) => {
    applyBrand(brand);
    setActiveBrand(brand);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <ButtonIcon
            variant="ghost"
            className="relative"
            aria-label="Select brand"
          />
        }
      >
        <BrushPaintingIcon className="h-5 w-5" />
        <span className="sr-only">Select brand</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-96 w-56 overflow-y-auto"
      >
        {BRANDS.map((brand) => (
          <DropdownMenuItem
            key={brand.value}
            onClick={() => handleBrandChange(brand.value)}
            className={cn(
              'flex items-center justify-between cursor-pointer',
              brand.value === activeBrand && 'bg-accent'
            )}
          >
            <span className="font-medium">{brand.label}</span>
            {brand.value === activeBrand && (
              <CheckIcon className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
