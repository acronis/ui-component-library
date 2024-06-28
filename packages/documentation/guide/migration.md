# Migration

This guide is intended to help you migrate from one version of the package to another.
It will provide you with a list of changes that you need to make in order to update your codebase.
Components were refactored and api revised, but in order to make migration process easier we tried to keep all existing API,
as well as same prop names, emmited events, slots and hierarchical structure.
All changes are listed by package and component, widget, directive or composable.

## Acronis

### Acronis components

| Old name               | New name       |
|------------------------|----------------|
| Alert                  |                |
| Aside                  |                |
| Autocomplete           |                |
| Breadcrumb             |                |
| BreadcrumbItem         |                |
| Button                 |                |
| Card                   |                |
| Carousel               |                |
| CarouselItem           |                |
| Cascader               |                |
| Checkbox               |                |
| CheckboxButton         |                |
| CheckboxGroup          |                |
| Chip                   |                |
| Col                    |                |
| Collapse               | Accordion      |
| CollapseItem           | AccordionPanel |
| Combobox               |                |
| Container              |                |
| DataTable              |                |
| DatePicker             |                |
| Dialog                 |                |
| Divider                |                |
| Dropdown               |                |
| DropdownItem           |                |
| DropdownMenu           |                |
| FileBrowser            |                |
| FilePicker             |                |
| Filter                 |                |
| Footer                 |                |
| Form                   |                |
| FormError              |                |
| FormItem               |                |
| Highlight              |                |
| Icon                   |                |
| IconSprite             |                |
| Input                  |                |
| Link                   |                |
| Loading                |                |
| Main                   |                |
| Map                    |                |
| MarkupTable            |                |
| Menu                   |                |
| MenuGroup              |                |
| MenuItem               |                |
| Notification           |                |
| NotificationComponent  |                |
| NumPicker              |                |
| Option                 |                |
| OptionGroup            |                |
| Pagination             |                |
| Password               |                |
| Popover                |                |
| Popper                 |                |
| Progress               |                |
| Radio                  |                |
| RadioButton            |                |
| RadioGroup             |                |
| Ribbon                 |                |
| Row                    |                |
| ScriptEditor           |                |
| Scrollbar              |                |
| Search                 |                |
| Select                 |                |
| Slider                 |                |
| Spinner                |                |
| SplitButton            |                |
| Step                   |                |
| Stepper                |                |
| StepperItem            |                |
| Steps                  |                |
| Submenu                |                |
| Switch                 |                |
| Table                  |                |
| TableActions           |                |
| TableActionsColumn     |                |
| TableColumn            |                |
| TableColumnsVisibility |                |
| TableDataCell          |                |
| TableRowsGroup         |                |
| TabNav                 |                |
| TabPane                |                |
| Tabs                   |                |
| Tag                    |                |
| TextMiddleEllipsis     |                |
| Tiles                  |                |
| TimePicker             |                |
| Tooltip                |                |
| Tree                   |                |
| Upload                 |                |
| VirtualScroll          |                |

### Acronis widgets

| Old name         | New name |
|------------------|----------|
| AboutWindow      |          |
| Details          |          |
| DetailsTable     |          |
| DetailsView      |          |
| Empty            |          |
| FittedActions    |          |
| Header           |          |
| HeaderMenu       |          |
| HeaderSearch     |          |
| LineChart        |          |
| LiveTracker      |          |
| LoadingComplex   |          |
| MultiSearch      |          |
| PieChart         |          |
| PopoverWidget    |          |
| ProgressRadial   |          |
| SidebarAction    |          |
| SidebarLayout    |          |
| SidebarPanel     |          |
| SidebarTitle     |          |
| StackedAreaChart |          |
| TableWidget      |          |
| Toolbar          |          |
| ToolbarContainer |          |
| ToolbarSearch    |          |
| WhatIsNew        |          |
| WidgetWrapper    |          |

### Acronis directives

| Old name           | New name |
|--------------------|----------|
| Highlight          |          |
| Loading            |          |
| TextMiddleEllipsis |          |

### Acronis composables

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

## Constructor

### Constructor components

| Old name              | New name  |
|-----------------------|-----------|
| GoAnsi                |           |
| GoAutosizeInput       |           |
| GoBarButton           |           |
| GoBreadcrumbs         |           |
| GoButton              |           |
| GoCheckbox            |           |
| GoCircle              |           |
| GoCircularProgressBar |           |
| GoCloseButton         |           |
| GoCode                |           |
| GoCollapse            | Accordion |
| GoContextMenu         |           |
| GoContextPopover      |           |
| GoDatePicker          |           |
| GoDescriptionList     |           |
| GoDialog              |           |
| GoDropdownMenu        |           |
| GoDropZone            |           |
| GoExpandedIcon        |           |
| GoFile                |           |
| GoFileUploader        |           |
| GoFillerBlock         |           |
| GoForm                |           |
| GoFormatDate          |           |
| GoFormFields          |           |
| GoImageUploader       |           |
| GoInput               |           |
| GoKeepAliveSwitch     |           |
| GoLink                |           |
| GoListItem            |           |
| GoLoad                |           |
| GoLoader              |           |
| GoLoadError           |           |
| GoMenuItem            |           |
| GoMessage             |           |
| GoNotification        |           |
| GoNumberedRows        |           |
| GoPane                |           |
| GoPopover             |           |
| GoPopoverTools        |           |
| GoProgressBar         |           |
| GoRadio               |           |
| GoRange               |           |
| GoSegmentButton       |           |
| GoSegmentGroup        |           |
| GoSegmentItem         |           |
| GoSegmentLink         |           |
| GoSelect              |           |
| GoStatusTag           |           |
| GoTable               |           |
| GoTabs                |           |
| GoTag                 |           |
| GoTextIcon            |           |
| GoToggle              |           |
| GoToolbar             |           |
| GoTooltip             |           |
| GoTree                |           |
| GoUploadInput         |           |
| GoUploadZone          |           |
| GoWidget              |           |

### Constructor directives

| Old name     | New name |
|--------------|----------|
| Autofocus    |          |
| Intersection |          |
| Resize       |          |

## Comparison of Acronis and Constructor components

**Acronis** ui-kit: 110 components, some of them a bit complicated and must be decoupled or replaced with simple one.

**Constructor** ui-kit: 61 component, most of them represent simple visual representation.

**Virtuozzo** ui-kit: about 31 component, most of them are visually compatible to Acronis UI-kit.

Each kit support own design system rules.
For the most components we have intersections, and we can use same internal logic and external behaviour.
Differences in styling can be implemented with different themes and branding support.

### List of UIKit components and its apis(props, slots, events)

| Acronis/Constructor/Virtuozzo ui kit Component name | Alternative components                                              | Can be:<br/> decoupled, replaced with dumb, deprecated or merged |
|:----------------------------------------------------|:--------------------------------------------------------------------|:-----------------------------------------------------------------|
| el-about-window                                     |                                                                     | + (example with dialog)                                          |
| el-alert                                            | go-message                                                          | + (merge implementations)                                        |
| el-aside                                            |                                                                     |                                                                  |
| el-autocomplete                                     |                                                                     | +                                                                |
| el-breadcrumb                                       | go-breadcrumbs                                                      |                                                                  |
| el-breadcrumb-item                                  |                                                                     |                                                                  |
| el-button                                           | go-button                                                           |                                                                  |
| el-button-group                                     |                                                                     |                                                                  |
| el-calendar                                         |                                                                     |                                                                  |
| el-card                                             | go-pane, go-widget                                                  | + (layout, segment, card)                                        |
| el-carousel                                         |                                                                     |                                                                  |
| el-carousel-item                                    |                                                                     |                                                                  |
| el-cascader                                         |                                                                     |                                                                  |
| el-checkbox                                         | go-checkbox                                                         |                                                                  |
| el-checkbox-button                                  |                                                                     |                                                                  |
| el-checkbox-group                                   | go-segment-button-group                                             | + (button-group)                                                 |
| el-chip                                             | vz-chips                                                            |                                                                  |
| el-col                                              |                                                                     | + (grid)                                                         |
| el-collapse                                         | go-collapse, go-list-item-collapse, vz-accordion                    | Accordion                                                        |
| el-collapse-item                                    |                                                                     |                                                                  |
| el-combobox                                         |                                                                     |                                                                  |
| el-container                                        |                                                                     | + (grid)                                                         |
| el-date-picker                                      | go-date-picker, vz-datapicker                                       |                                                                  |
| el-details                                          |                                                                     |                                                                  |
| el-details-table                                    |                                                                     |                                                                  |
| el-details-view                                     |                                                                     |                                                                  |
| el-dialog                                           | go-dialog                                                           | +                                                                |
| el-divider                                          | vz-separator                                                        | +                                                                |
| el-drag-drop                                        |                                                                     |                                                                  |
| el-dropdown                                         |                                                                     |                                                                  |
| el-dropdown-item                                    |                                                                     |                                                                  |
| el-dropdown-menu                                    | go-dropdown-menu-popover                                            | +                                                                |
| el-file-browser                                     |                                                                     |                                                                  |
| el-file-picker                                      | go-file, go-file-uploader, go-upload-input                          |                                                                  |
| el-filter                                           |                                                                     | +                                                                |
| el-fitted-actions                                   |                                                                     |                                                                  |
| el-footer                                           |                                                                     | +                                                                |
| el-form                                             |                                                                     |                                                                  |
| el-form-error                                       |                                                                     |                                                                  |
| el-form-item                                        | go-form-control                                                     |                                                                  |
| el-header                                           |                                                                     |                                                                  |
| el-header-menu                                      |                                                                     |                                                                  |
| el-header-search                                    |                                                                     |                                                                  |
| el-highlight                                        |                                                                     | +                                                                |
| el-icon                                             |                                                                     | +                                                                |
| el-icon-sprite                                      |                                                                     |                                                                  |
| el-input                                            | go-input, go-input-number                                           | +                                                                |
| el-line-chart                                       |                                                                     | +                                                                |
| el-link                                             | go-link, go-segment-link, vz-link                                   |                                                                  |
| el-list                                             |                                                                     | + (list)                                                         |
| el-live-tracker                                     |                                                                     | +                                                                |
| el-loading                                          | go-loader, go-load, go-load-alive, go-load-page, go-load-page-alive | + (loaders)                                                      |
| el-loading-complex                                  |                                                                     |                                                                  |
| el-main                                             |                                                                     |                                                                  |
| el-map                                              |                                                                     |                                                                  |
| el-menu                                             |                                                                     | + (menu)                                                         |
| el-menu-group                                       |                                                                     | + (menu)                                                         |
| el-menu-item                                        | go-menu-item                                                        | + (menu)                                                         |
| el-multi-search                                     |                                                                     |                                                                  |
| el-notification                                     | go-notification, vz-toast                                           |                                                                  |
| el-notification-component                           |                                                                     |                                                                  |
| el-num-picker                                       | go-input-number                                                     |                                                                  |
| el-option                                           |                                                                     |                                                                  |
| el-option-group                                     |                                                                     |                                                                  |
| el-pagination                                       | vz-pagination                                                       |                                                                  |
| el-password                                         |                                                                     |                                                                  |
| el-pie-chart                                        |                                                                     | +                                                                |
| el-popover                                          | go-popover                                                          |                                                                  |
| el-popover-widget                                   |                                                                     |                                                                  |
| el-progress                                         | go-progress-bar, vz-progressbar                                     |                                                                  |
| el-progress-radial                                  | go-progress-radial, go-circular-progress-bar                        |                                                                  |
| el-radio                                            | go-radio                                                            | + (form elements)                                                |
| el-radio-button                                     |                                                                     |                                                                  |
| el-radio-group                                      | go-segment-button-group, go-segment-group                           | + (button-group)                                                 |
| el-ribbon                                           |                                                                     |                                                                  |
| el-row                                              |                                                                     | + (grid)                                                         |
| el-script-editor                                    | go-code, vz-codeblock                                               |                                                                  |
| el-scrollbar                                        |                                                                     |                                                                  |
| el-search                                           | vz-search                                                           |                                                                  |
| el-select                                           | go-select                                                           | +                                                                |
| el-sidebar-action                                   |                                                                     |                                                                  |
| el-sidebar-layout                                   |                                                                     |                                                                  |
| el-sidebar-panel                                    |                                                                     |                                                                  |
| el-sidebar-title                                    |                                                                     |                                                                  |
| el-skeleton                                         | vz-ghost                                                            |                                                                  |
| el-slider                                           |                                                                     |                                                                  |
| el-spinner                                          |                                                                     |                                                                  |
| el-split-button                                     |                                                                     |                                                                  |
| el-stacked-area-chart                               |                                                                     |                                                                  |
| el-step                                             |                                                                     |                                                                  |
| el-stepper                                          |                                                                     |                                                                  |
| el-stepper-item                                     |                                                                     |                                                                  |
| el-steps                                            |                                                                     |                                                                  |
| el-submenu                                          |                                                                     |                                                                  |
| el-switch                                           | go-toggle, vz-toggle                                                | + (merge)                                                        |
| el-tab-pane                                         |                                                                     |                                                                  |
| el-table                                            | go-table                                                            | + (table, markup-table)                                          |
| el-table-actions                                    |                                                                     |                                                                  |
| el-table-actions-column                             |                                                                     |                                                                  |
| el-table-column                                     |                                                                     |                                                                  |
| el-table-columns-visibility                         |                                                                     |                                                                  |
| el-table-data-cell                                  |                                                                     |                                                                  |
| el-table-rows-group                                 |                                                                     |                                                                  |
| el-table-widget                                     |                                                                     |                                                                  |
| el-tabs                                             | go-tabs                                                             | + (merge)                                                        |
| el-tag                                              | go-tag                                                              | + (merge)                                                        |
| el-text-middle-ellipsis                             |                                                                     |                                                                  |
| el-textarea                                         |                                                                     | + (form elements)                                                |
| el-time-picker                                      |                                                                     |                                                                  |
| el-toolbar                                          | go-toolbar                                                          | + (toolbar)                                                      |
| el-toolbar-container                                |                                                                     | + (toolbar)                                                      |
| el-toolbar-search                                   |                                                                     | + (toolbar)                                                      |
| el-tooltip                                          | go-tooltip, go-tooltip-help                                         | + (merge)                                                        |
| el-tree                                             | go-tree                                                             | + (tree)                                                         |
| el-upload                                           | go-image-uploader, go-upload-zone                                   |                                                                  |
| el-virtual-scroll/list                              |                                                                     | + (providers)                                                    |
| el-what-is-new                                      |                                                                     |                                                                  |
| el-widget-wrapper                                   |                                                                     |                                                                  |
| go-ansi                                             |                                                                     |                                                                  |
| go-autosize-input                                   |                                                                     |                                                                  |
| go-bar-button (button with slots)                   |                                                                     |                                                                  |
| go-circle (icon with circle)                        |                                                                     |                                                                  |
| go-close-button (icon with close)                   |                                                                     |                                                                  |
| go-context-menu                                     |                                                                     |                                                                  |
| go-context-provider                                 |                                                                     |                                                                  |
| go-description-list                                 |                                                                     | example with ACI shared component                                |
| go-dialog-confirm                                   |                                                                     | example with confirm dialog                                      |
| go-dropzone                                         |                                                                     |                                                                  |
| go-expanded-icon                                    |                                                                     | icon with expand behaviour                                       |
| go-filler-block                                     |                                                                     | css classes example                                              |
| go-form-fields                                      |                                                                     | + (form)                                                         |
| go-format-date                                      |                                                                     | + (formatters)                                                   |
| go-keep-alive-switch                                |                                                                     | + (providers)                                                    |
| go-list-item                                        |                                                                     | + (list component)                                               |
| go-load-error                                       |                                                                     | + (empty component)                                              |
| go-numbered-rows                                    |                                                                     | + (list component)                                               |
| go-pick (icon with pick)                            |                                                                     |                                                                  |
| go-range                                            |                                                                     | + (form elements)                                                |
| go-segment-button                                   |                                                                     | + (button type)                                                  |
| go-status, go-status-tag                            | aci status component                                                | example with ACI shared component                                |
| go-text-icon                                        |                                                                     | + (inline icon)                                                  |
| I18n component                                      |                                                                     | + (providers)                                                    |
| vz-logotype                                         |                                                                     |                                                                  |
| Placeholder component                               |                                                                     | + (empty component)                                              |
| Theme component                                     |                                                                     | + (providers)                                                    |
| vz-banner                                           |                                                                     | + (examples)                                                     |
| vz-captcha                                          |                                                                     | + (form elements)                                                |
|                                                     |                                                                     |                                                                  |
| Total amount of components:                         | 146                                                                 |                                                                  |

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

