# Acronis Cyber UI Kit

The Acronis Cyber UI Kit is an UI Components Library for Web applications and Web-based Desktop applications based on Vue.js v3

# Installation

```
npm i @acronis-platform/ui-component-library
```

# Usage

You can either import all of UI Kit components at once and register them globally:

```
import * as UIComponentLibrary from '@acronis-platform/ui-component-library'

const app = createApp(App)

for (let module in UIComponentLibrary) {
    app.component(module, UIComponentLibrary[module])
}

app.mount('#app')
```

Or import them individually where required:

```
import { ElButton } from '@acronis-platform/ui-component-library'
```

Render the components as shown below:
```
<el-button>This is my button</el-button>
```

# Browser support
All modern browsers

# License
MIT
