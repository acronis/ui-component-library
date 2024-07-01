import path from 'node:path';
import props from './.docgen/props.js';
import slots from './.docgen/slots.js';
import component from './.docgen/component.js';
import events from './.docgen/events.js';

export default {
  componentsRoot: '../ui/src/components', // the folder where CLI will start searching for components.
  components: '**/[a-zA-Z]*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
  ignore: '**/examples/*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
  outDir: './components', // folder to save components docs in (relative to the current working directory)
  defaultExamples: false,
  getDocFileName: componentPath => componentPath.replace(/\.vue$/, '.md'), // specify the name of the input md file
  getDestFile: (file, config) =>
    path.join(config.outDir, file).replace(/\.vue$/, '.doc.md'), // specify the name of the output md file
  templates: {
    // global component template wrapping all others see #templates
    component,
    events,
    //   methods: import('templates/methods'),
    props,
    slots
  },
};
