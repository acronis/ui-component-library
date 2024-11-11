import { mount } from '@cypress/vue';
import SpinnerBasic from '../../../../examples/demos/spinner/SpinnerBasic.vue';
import SpinnerColors from '../../../../examples/demos/spinner/SpinnerColors.vue';
import SpinnerSizes from '../../../../examples/demos/spinner/SpinnerSizes.vue';

describe('Spinner', () => {
  it('basic', () => {
    mount(SpinnerBasic);

    cy.get('.acv-spinner').matchImageSnapshot('spinner-basic');
  });

  it('sizes', () => {
    mount(SpinnerSizes);

    cy.matchImageSnapshot('spinner-sizes');
  });

  it('colors', () => {
    mount(SpinnerColors);

    cy.matchImageSnapshot('spinner-colors');
  });
});
