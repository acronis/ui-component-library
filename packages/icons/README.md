# Acronis Icons

This package provides a collection of SVG icons used in Acronis web applications. 
It is designed for easy integration into Vue.js projects or any web-based application.

## Installation

To install the `acronis-icons` package, run the following command in your project directory:

```bash
pnpm install @acronis-platform/icons
```

## Fetching icons using Figma API

- Navigate to https://www.figma.com/developers/api#access-tokens and get your token
- Create `.env.local` in the directory when you want to use this lib
- Add variable `FIGMA_FETCHER_FIGMA_TOKEN='your token'` in `.env.local`
- Run the command `fetch-icons`

```bash
pnpm run figma-icons
```

## Usage

This package provides a collection of icons grouped by categories.
Each category is a separate module that exports a set of icon components.

```javascript
import { IconArrowUp32 } from '@acronis-platform/icons/arrows';
```
