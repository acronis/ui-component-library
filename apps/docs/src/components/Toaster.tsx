'use client';

// Re-export the UIKit Toaster directly. next-themes is externalized in the
// UIKit build, so useTheme() shares the same context as the docs app's
// ThemeProvider (from Fumadocs RootProvider). sonner is also externalized,
// so toast() calls from demos reach this same Toaster instance.
export { Toaster } from '@spec-lab/shadcn-uikit/react';
