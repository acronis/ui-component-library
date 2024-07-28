import { mount } from '@cypress/vue';
import AccordionBasic from '../../../../demos/src/accordion/AccordionBasic.vue';
import AccordionBackground from '../../../../demos/src/accordion/AccordionBackground.vue';

describe('Accordion', () => {
  it('basic', () => {
    mount(AccordionBasic);

    // To match whole document use
    // cy.matchImageSnapshot('accordion-basic');

    cy.get('.acv-accordion').matchImageSnapshot('accordion-basic', {
      capture: 'viewport'
    });
  });

  it('background', () => {
    mount(AccordionBackground);
    cy.get('.acv-accordion-panel').click({ multiple: true });

    cy.get('.acv-accordion').matchImageSnapshot('accordion-background');
  });
});
