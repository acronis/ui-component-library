function createComponent(figma, componentTemplate) {
  const component = figma.createComponent();

  Object.assign(component, componentTemplate);

  const componentsPage = figma.root.children.find(child => child.name === 'Test');

  // Append the component to the Test Components page
  componentsPage.appendChild(component);
}

export { createComponent };
