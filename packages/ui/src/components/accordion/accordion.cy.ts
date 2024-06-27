import { mount } from '@cypress/vue';
import AccordionBasic from '../../../../documentation/demos/accordion/AccordionBasic.vue';
import AccordionBackground from '../../../../documentation/demos/accordion/AccordionBackground.vue';

describe.only('Accordion', () => {
  it('basic', () => {
    mount(AccordionBasic);

    cy.matchImageSnapshot('accordion-basic');
  });

  it('background', () => {
    mount(AccordionBackground);
    cy.get('.acv-accordion-panel').click({ multiple: true });

    cy.matchImageSnapshot('accordion-background');
  });
});
