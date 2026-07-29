import * as React from 'react';
import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Wraps Base UI's Avatar primitive (Root / Image / Fallback), themed by the
// dedicated next-gen `--ui-avatar-*` token tier from @constructor-lab/tokens.
// A 32px circle (`--ui-avatar-global-avatar-size` / `-border-border-radius`) with a 2px
// ring (`-border-border-width` / `-border-color`) rendered as an OUTSET box-shadow, not
// a CSS border: Figma's stroke is `strokeAlign: OUTSIDE`, so a border-box border would
// eat 4px of the 32px box and render every avatar at 28px (and throw `AvatarGroup`'s
// overlap step off by the same 4px). The spread-only ring sits outside the box and is
// what visually separates avatars when they overlap in an `AvatarGroup`. When no image
// is set (or it fails to load) the `AvatarFallback` shows initials.
//
// `color` selects one of the eight Figma color schemes; it tints the fallback
// background (`--ui-avatar-color-<scheme>`) and the initials
// (`--ui-avatar-label-color-<scheme>`). Initials use the 12px/16px/600 caption
// style baked into the design (`text-xs font-semibold leading-4`).
//
// `blue` / `gray` / `green` were emitted in the token tier but never exposed
// here, so those six tokens were dead — the same "emitted and never consumed"
// defect class as Button's ghost `text-decoration` tokens. Widening the enum is
// additive (no caller loses an option) and needs no token work.
const avatarVariants = cva(
  'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden ' +
    'size-[var(--ui-avatar-global-avatar-size)] rounded-[var(--ui-avatar-global-avatar-border-border-radius)] ' +
    // Outset ring (see the note above). Raw `box-shadow` arbitrary property, NOT
    // Tailwind's `shadow-[…]`, which routes through `--tw-shadow-color` and resolves
    // inconsistently for spread-only rings across engine versions.
    '[box-shadow:0_0_0_var(--ui-avatar-global-avatar-border-border-width)_var(--ui-avatar-global-avatar-border-color)] ' +
    'text-xs font-semibold leading-4',
  {
    variants: {
      color: {
        teal: 'bg-[var(--ui-avatar-color-teal)] text-[var(--ui-avatar-label-color-teal)]',
        violet:
          'bg-[var(--ui-avatar-color-violet)] text-[var(--ui-avatar-label-color-violet)]',
        red: 'bg-[var(--ui-avatar-color-red)] text-[var(--ui-avatar-label-color-red)]',
        yellow:
          'bg-[var(--ui-avatar-color-yellow)] text-[var(--ui-avatar-label-color-yellow)]',
        orange:
          'bg-[var(--ui-avatar-color-orange)] text-[var(--ui-avatar-label-color-orange)]',
        blue: 'bg-[var(--ui-avatar-color-blue)] text-[var(--ui-avatar-label-color-blue)]',
        gray: 'bg-[var(--ui-avatar-color-gray)] text-[var(--ui-avatar-label-color-gray)]',
        green:
          'bg-[var(--ui-avatar-color-green)] text-[var(--ui-avatar-label-color-green)]',
      },
    },
    defaultVariants: {
      color: 'teal',
    },
  }
);

export interface AvatarProps
  extends
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

/**
 * A user/entity avatar: a colored circle showing an image or initials. Compose
 * `AvatarImage` and/or `AvatarFallback` inside; stack several in `AvatarGroup`.
 */
const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, color, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ color }), className)}
    {...props}
  />
));
Avatar.displayName = 'Avatar';

export type AvatarImageProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Image
>;

/** The avatar image; hidden by Base UI until it loads, revealing the fallback. */
const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('size-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

export type AvatarFallbackProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Fallback
>;

/** Shown when there's no image (or it fails) — typically the user's initials. */
const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('flex size-full items-center justify-center', className)}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Overlapping stack of avatars. Each avatar after the first is pulled toward the
 * inline start by `--ui-avatar-global-avatar-group-gap` (a negative offset), so
 * their 2px outset rings form the layered look; later avatars render above
 * earlier ones.
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center [&>*:not(:first-child)]:ms-[var(--ui-avatar-global-avatar-group-gap)]',
        className
      )}
      {...props}
    />
  )
);
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatarVariants };
