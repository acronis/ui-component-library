# Getting Started

The Acronis UI Component Library is based on Vue.js v3 - it will not work with Vue.js v2.

## Installation

```
npm i @acronis-platform/ui-kit
```

## Usage

You can choose to import all of the components and widgets at once and register them globally.

```
import * as UiKit from '@acronis-platform/ui-kit'

const app = createApp(App)

for (let module in UiKit) {
    app.component(module, UiKit[module])
}

app.mount('#app')
```

Alternatively, you can import them individually where required.

```
import { ElButton } from '@acronis-platform/ui-kit'
```

Render the components as shown below.

```
<el-button>This is my button</el-button>
```

## Browser support

Supported web browsers are listed below.

* Apple Safari Mobile (mobile devices with resolution 1024 x 768 and higher)
* Apple Safari (for Mac OS X)
* Google Chrome 29 or later
* Google Chrome Mobile (mobile devices with resolution 1024 x 768 and higher)
* Mozilla Firefox 23 or later
* Opera 16 or later
* Microsoft Edge 15 or later
* Safari 8 or later running in the macOS and iOS operating systems
