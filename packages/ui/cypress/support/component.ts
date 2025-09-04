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

import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';

// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'cypress/vue';
// Ensure global styles are loaded
import '../../src/styles/reset.css';
import '../../src/styles/themes/acronis/acronis.pcss';

import './style.css';

// Example use:
// cy.mount(MyComponent)
Cypress.Commands.add('mount' as any, mount);

// can also add any default options to be used
// by all instances of `matchImageSnapshot`
addMatchImageSnapshotCommand({
  failureThreshold: 0.01,
  // capture: 'viewport',
  // Disallow size mismatches so viewport height/width must match exactly
  allowSizeMismatch: false,
  // Ensure fonts are loaded before taking screenshot to avoid reflow-induced size changes
  onBeforeScreenshot: () => {
    return cy.document().then(doc => doc.fonts?.ready);
  },
});

// Ensure viewport and document sizing are stable for every test
beforeEach(() => {
  // Force the Cypress app iframe to the configured viewport
  cy.viewport(1000, 600);
  // Normalize document/body heights to avoid scrollbars affecting capture area
  cy.document().then((doc) => {
    doc.documentElement.style.height = '100%';
    doc.body.style.height = '100%';
    doc.documentElement.style.margin = '0';
    doc.body.style.margin = '0';
  });
  // Always start at the top-left to avoid scroll offsets
  // cy.window().then(() => cy.scrollTo(0, 0));
});
