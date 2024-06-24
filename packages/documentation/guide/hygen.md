# Creating components using Hygen

### Naming convention

The components that have the tendency of being used round the application have the 'Ui' prefix attached i.e UiInput. 

### Automation

All components should be created using the command:

```bash
hygen component new [ComponentName]
```

Component name should follow the naming convention above.
This command would create a component with the default structure.

### SFC structure

For ease and better Developer Experience the template of all components would be placed in the middle of the script and styling.

### Unit Testing

All component tests should be kept in the components folder and saved in the below-mentioned format to foster writing of unit tests.

```bash
[ComponentName].spec.ts
```

### Styling

Styles would make use of scoped.
Each component should have set of components' tokens in css format, that should be used in the component's styles.

```bash
[ComponentName].css
```

Global variables can be imported from the styles directory using:

```css
@import "@/styles";
```

or globally in entry file.
