# Figma Icons

## Steps for Using

1. **Navigate to Figma Access Tokens:**

- Go to [Figma Developers API Access Tokens](https://www.figma.com/developers/api#access-tokens) and obtain your token.

2. **Create Environment File:**

- In the directory where you want to use this library, create a `.env.local` file.

3. **Download Icons:**

- Run the command `fetch-icons` in the package where you want to store your icons.

## Example of `.env.local`

```plaintext
FIGMA_FETCHER_FIGMA_TOKEN="PUT_YOUR_FIGMA_TOKEN"
FIGMA_FETCHER_FILE_KEY="PUT_YOUR_FILE_KEY"
FIGMA_FETCHER_PAGE_NAMES="PAGE_NAMES_WITH_ICONS, SEPARATED_BY_COMMA"
FIGMA_FETCHER_FRAME_NAMES="FRAME_NAMES_WITH_ICONS, SEPARATED_BY_COMMA"
FIGMA_FETCHER_CLASS_NAME="acv-icon"
FIGMA_FETCHER_SYSTEM_COLOR="#181818"
```

## Command to Fetch Icons

```bash
fetch-icons
```

You will download your icons to the specified directory.
