import * as React from 'react';
import { UserIcon } from '@spec-lab/icons-react/stroke-mono';
import {
  MoonIcon,
  SunIcon,
  LogOutIcon,
} from '@/components/icons/missing-icons';
import {
  AppShellHeader,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ButtonIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SearchGlobal,
} from '@spec-lab/ui-react';
import { getCurrentColorMode, toggleColorMode } from '@/lib/theme-switcher';
import { useAuth } from '../hooks/useAuth';
import { LanguageSelector } from '../components/LanguageSelector';
import { TOUR_ANCHORS } from '../onboarding/tour-steps';

// The AppShell top bar (protection-dashboard `header` region): a centered global
// search flanked by equal side columns so it stays truly centered regardless of
// the account label width, with the theme toggle, language selector and account
// menu pinned to the trailing (end) edge. Uses logical `justify-self` so the
// layout mirrors under RTL.
export function ConsoleHeader() {
  const { user, logout } = useAuth();
  const [mode, setMode] = React.useState<'light' | 'dark'>(() =>
    getCurrentColorMode()
  );

  const handleToggleTheme = () => setMode(toggleColorMode());

  return (
    <AppShellHeader>
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
        <span aria-hidden="true" />
        <SearchGlobal
          aria-label="Search"
          placeholder="Search…"
          className="w-[28rem] justify-self-center"
          data-tour-id={TOUR_ANCHORS.globalSearch}
        />
        <div
          className="flex items-center gap-2 justify-self-end"
          data-tour-id={TOUR_ANCHORS.account}
        >
          <ButtonIcon
            variant="ghost"
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
          >
            {mode === 'light' ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </ButtonIcon>

          <LanguageSelector />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                />
              }
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </AppShellHeader>
  );
}
