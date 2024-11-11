import { mount } from '@cypress/vue';
import AccordionBackground from '../../../../examples/demos/accordion/AccordionBackground.vue';
import AccordionBasic from '../../../../examples/demos/accordion/AccordionBasic.vue';

describe('Accordion', () => {
  it('basic', () => {
    mount(AccordionBasic);

    // To match whole document use
    // cy.matchImageSnapshot('accordion-basic');

    cy.get('.acv-accordion').matchImageSnapshot('accordion-basic');
  });

  it('background', () => {
    mount(AccordionBackground);
    cy.get('.acv-accordion-panel').click({ multiple: true });

    cy.get('.acv-accordion').matchImageSnapshot('accordion-background');
  });
});
