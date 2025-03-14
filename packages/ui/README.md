# Acronis UI Component Library

The Acronis UI Component Library is meant to be used in Web applications and Web-based Desktop applications and is based on Vue.js 3

## Features

- Design system with support for theming using CSS variables
- Simple and easy to use components
- Sufficient detailed documentation
- Coverage of unit tests and visual regression tests
- Written in Typescript

## Installation

Please refer to the [detailed docs](https://acronis.github.io/ui-component-library/guide/install.html)

```bash
git clone https://github.com/acronis/ui-component-library.git acronis-ui-component-library
cd acronis-ui-component-library
pnpm install
```

## Usage

Acronis UI Component Library is a toolset with components, directives and some utilities.
You can use is as a whole or import only the components you need.

Import the whole library:

```javascript
import UIKit from '@acronis-platform/ui-component-library';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(UIKit);
app.mount('#app');
```

Import only the components you need, the best way, with usage of tree-shakable named imports:

```javascript
import { Button, Input } from '@acronis-platform/ui-component-library';
import { createApp } from 'vue';
import '@acronis-platform/ui-component-library/dist/styles/themes.css';
// import '@acronis-platform/ui-component-library/dist/styles.css';
// import '@acronis-platform/ui-component-library/dist/button/styles.css';
// import '@acronis-platform/ui-component-library/dist/input/styles.css';
import App from './App.vue';

const app = createApp(App);
app.component('Button', Button);
app.component('Input', Input);
app.mount('#app');
```

Please, refer to [the documentation](https://acronis.github.io/ui-component-library/guide/install.html#full-import) for detailed information on how to use the library.

## Contributing

If you really want to contribute to the project, you can start by forking the repository and creating a pull request.
Please make sure to follow the guidelines, and make sure all tests pass before submitting a pull request.

Please refer to the [CONTRIBUTING.md](https://github.com/acronis/ui-component-library/blob/main/CONTRIBUTING.md) file for information on how to contribute to the project.

## Browser support

All modern browsers

## License

[MIT](https://github.com/acronis/ui-component-library/blob/main/LICENSE)
