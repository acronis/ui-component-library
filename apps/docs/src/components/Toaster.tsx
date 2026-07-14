'use client';

// Re-export the ui-react Toaster directly. next-themes is externalized in the
// ui-react build, so useTheme() shares the same context as the docs app's
// ThemeProvider (from Fumadocs RootProvider), and toast() calls from demos
// reach this same Toaster instance.
export { Toaster } from '@constructor-lab/ui-react';
