# Migration guide Acronis UI-kit to Acronis UI component library v1

This guide is intended to help you migrate from one version of the package to another.
It will provide you with a list of changes that you need to make in order to update your codebase.
Components were refactored and api revised, but in order to make migration process easier we tried to keep all existing API,
as well as same prop names, emitted events, slots and hierarchical structure.
All changes are listed by package and component, widget, directive or composable.

## Components

| Name A                        | Replacement       | 
|-------------------------------|-------------------|
| Alert / Message               |                   |
| Aside                         |                   |
| Autocomplete                  |                   |
| Breadcrumb                    |                   |
| BreadcrumbItem                |                   |
| Button                        | AcvButton         |
| ButtonGroup                   | AcvButtonGroup    |
| Captcha                       |                   |
| Card                          | AcvCard, AcvLayer |
| Carousel                      |                   |
| CarouselItem                  |                   |
| Cascader                      |                   |
| Checkbox                      |                   |
| CheckboxButton                |                   |
| CheckboxGroup                 | AcvButtonGroup    |
| Chip                          |                   |
| CloseButton                   | AcvColumn         |
| Code / ScriptEditor           |                   |
| Col                           | AcvColumn         |
| Collapse                      | Accordion         |
| CollapseItem / AccordionPanel | AccordionPanel    |
| Combobox                      |                   |
| ConfigProvider                |                   |
| ConfirmDialog                 |                   |
| Container                     | Grid              |
| ContextMenu                   | Grid              |
| DataTable                     |                   |
| DatePicker                    |                   |
| Dialog                        |                   |
| Disclosure                    | AcvColumn         |
| Divider                       |                   |
| DragAndDrop                   |                   |
| Dropdown                      |                   |
| DropdownItem                  |                   |
| DropdownMenu                  |                   |
| Dropzone                      |                   |
| ExpandedIcon                  |                   |
| FileBrowser                   |                   |
| FilePicker                    |                   |
| FileUploader                  |                   |
| Filter                        |                   |
| Footer                        |                   |
| Form                          |                   |
| FormatDate                    |                   |
| FormError                     |                   |
| FormFields                    |                   |
| FormItem / FormControl        |                   |
| Highlight                     |                   |
| Icon                          |                   |
| IconSprite                    |                   |
| ImageUploader                 |                   |
| Input                         |                   |
| InputNumber                   |                   |
| KeepAliveSwitch               |                   |
| Link                          |                   |
| List                          |                   |
| Loading / Loader / Spinner    |                   |
| LocaleProvider                |                   |
| Main                          |                   |
| Map                           |                   |
| MarkupTable                   |                   |
| Menu                          |                   |
| MenuGroup                     |                   |
| MenuItem                      |                   |
| Notification                  |                   |
| NotificationComponent         |                   |
| NumPicker / InputNumber       |                   |
| Option                        |                   |
| OptionGroup                   |                   |
| Pagination                    |                   |
| Password                      |                   |
| Placeholder                   |                   |
| Popover                       |                   |
| Popper                        |                   |
| ProgressBar                   |                   |
| Radio                         |                   |
| RadioButton                   |                   |
| RadioGroup / SegmentGroup     |                   |
| Range                         |                   |
| Ribbon                        |                   |
| Row                           |                   |
| Scrollbar                     |                   |
| Search                        |                   |
| Select                        |                   |
| Skeleton                      |                   |
| Slider                        |                   |
| Spinner                       |                   |
| SplitButton                   |                   |
| Status                        |                   |
| Step                          |                   |
| Stepper                       |                   |
| StepperItem                   |                   |
| Steps                         |                   |
| Submenu                       |                   |
| Switch / Toggle               |                   |
| Table                         |                   |
| TableActions                  |                   |
| TableActionsColumn            |                   |
| TableColumn                   |                   |
| TableColumnsVisibility        |                   |
| TableDataCell                 |                   |
| TableRowsGroup                |                   |
| TabNav                        |                   |
| TabPane                       |                   |
| Tabs                          |                   |
| Tag                           |                   |
| Textarea                      |                   |
| TextMiddleEllipsis            |                   |
| ThemeProvider                 |                   |
| Tiles                         |                   |
| TimePicker                    |                   |
| Tooltip                       |                   |
| Tree                          |                   |
| Upload                        |                   |
| VirtualScroll                 |                   |

## Widgets

| Name A           | New implementation |
|------------------|--------------------|
| AboutWindow      | Demo in dialog     |
| Details          |                    |
| DetailsTable     |                    |
| DetailsView      |                    |
| Empty            |                    |
| FittedActions    |                    |
| Header           |                    |
| HeaderMenu       |                    |
| HeaderSearch     |                    |
| LiveTracker      |                    |
| LoadError        |                    |
| LoadingComplex   |                    |
| MultiSearch      |                    |
| PopoverWidget    |                    |
| ProgressRadial   |                    |
| SidebarAction    |                    |
| SidebarLayout    |                    |
| SidebarPanel     |                    |
| SidebarTitle     |                    |
| TableWidget      |                    |
| Toolbar          |                    |
| ToolbarContainer |                    |
| ToolbarSearch    |                    |
| WhatIsNew        |                    |
| WidgetWrapper    |                    |

## Charts

| Name A           | New name |
|------------------|----------|
| LineChart        |          |
| PieChart         |          |
| StackedAreaChart |          |


### Directives

| Old name           | New name |
|--------------------|----------|
| Highlight          |          |
| Loading            |          |
| TextMiddleEllipsis |          |
| Autofocus          |          |
| Intersection       |          |
| Resize             |          |

### Mixins and composables

| Old name            | New name |
|---------------------|----------|
| useBrandColor       |          |
| useColor            |          |
| useContent          |          |
| useEventListener    |          |
| useFocus            |          |
| useFocusableTab     |          |
| useLocale           |          |
| useNodeText         |          |
| usePopper           |          |
| useResizeObserver   |          |
| useSize             |          |
| useWidgetChart      |          |
| useWidgetChartMulti |          |

## Migration steps

Before migrating to a new version of the package, you need to check the release notes and changelog to see what has changed.

During the migration process, you need to follow these steps:
- Find the component, widget, directive or composable that you are using in the list above.
- Replace the old name with the new name.
- Make sure that the new component, widget, directive or composable has the same API as the old one.
- If the new component, widget, directive or composable has a different API, update your code accordingly.
- If the new component, widget, directive or composable does not exist, you need to find an alternative solution.
- If you cannot find an alternative solution, you need to create a custom component, widget, directive or composable.
- If you create a custom component, widget, directive or composable, make sure to follow the best practices and guidelines provided by the package.
- Test your code thoroughly to make sure that everything works as expected.
- If you encounter any issues during the migration process, please refer to the package documentation or ask for help in the community forum.
- Once you have completed the migration process, you can continue using the package with the new version.
- If you encounter any issues with the new version, please report them to the package maintainers so that they can be fixed in future releases.
- If you have any feedback or suggestions for the package maintainers, please share them in the community forum or create a pull request with your changes.
- Thank you for using the package and for helping to improve it with your feedback and contributions.

### Components

#### ElAlert

- Title <Badge type="danger" text="Breaking" /> prop was removed. Use `variant` instead.

#### ElButton

- <Badge type="danger" text="Deprecated" /> textColor values: muted, high-emphasis, medium-emphasis, disabled, high-emphasis-inverse, medium-emphasis-inverse, disabled-inverse.
- <Badge type="danger" text="Deprecated" /> `type` prop renamed to `variant`.
- <Badge type="danger" text="Deprecated" /> `type="ghost"` renamed to `variant="tertiary"`.
- <Badge type="danger" text="Deprecated" /> type values: success, ghost, inverted.

#### ElCard
#### ElDropdown
#### ElLink
#### ElSpinners

#### ElTooltip

- <Badge type="danger" text="Deprecated" /> `type` placement renamed to `position`.
