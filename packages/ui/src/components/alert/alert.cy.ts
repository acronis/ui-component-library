import type { ComponentPublicInstance } from 'vue';
import AlertBasic from '@demos/src/alert/AlertBasic.vue';
import Alert from './alert.vue';

describe('Alert', () => {
  it('render', () => {
    cy.mount(Alert as Partial<ComponentPublicInstance>, {
      propsData: {
        title: 'my header',
      },
    });

    cy.get('.title').should('have.text', 'my header');

    cy.matchImageSnapshot('alert-render');
  });

  it('basic', () => {
    cy.mount(AlertBasic);

    cy.matchImageSnapshot('alert-basic');
  });
});
