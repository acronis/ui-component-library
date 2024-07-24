function createComponent(figma, componentTemplate) {
  console.log('Creating component', componentTemplate);

  const component = figma.createComponent();

  Object.assign(component, componentTemplate);

  const componentsPage = figma.root.children.find(child => child.name === 'Test');

  // Append the component to the Test Components page
  componentsPage.appendChild(component);
}

export { createComponent };
