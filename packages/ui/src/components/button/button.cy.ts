import { mount } from '@cypress/vue';
import ButtonBasic from '@documentation/demos/button/ButtonBasic.vue';

describe('Button', () => {
  it('basic', () => {
    mount(ButtonBasic);

    cy.get('.acv-button').matchImageSnapshot('button-basic', {
      capture: 'viewport',

      allowSizeMismatch: true
    });
  });
});
