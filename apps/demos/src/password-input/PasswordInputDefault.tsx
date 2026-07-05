import { useState } from 'react';
import { Input } from '@spec-lab/ui-react';
import { EyeOffIcon, EyeIcon } from '@spec-lab/icons-react/stroke-mono'
export function PasswordInputDefault() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="pwd-default"
          className="text-xs font-medium text-[rgba(36,49,67,0.7)]"
        >
          Password
        </label>
        <div className="relative">
          <Input
            id="pwd-default"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="pr-10 h-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2668C5] hover:text-[#1a4d8f] transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeIcon className="h-4 w-4" />
            ) : (
              <EyeOffIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
