// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'cypress/vue';

// Ensure global styles are loaded
import '../../src/styles/reset.css';
import '../../src/styles/themes/acronis/acronis.pcss';
import '../../src/styles/_deprecated_/public/acronis.css';

// eslint-disable-next-line import/no-extraneous-dependencies
import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';

// Example use:
// cy.mount(MyComponent)
Cypress.Commands.add('mount' as any, mount);

// can also add any default options to be used
// by all instances of `matchImageSnapshot`
addMatchImageSnapshotCommand({
  failureThreshold: 0.2,
  capture: 'viewport'
});
