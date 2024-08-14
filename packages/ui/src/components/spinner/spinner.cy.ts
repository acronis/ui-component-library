import { mount } from '@cypress/vue';
import SpinnerBasic from '../../../../demos/src/spinner/SpinnerBasic.vue';
import SpinnerSizes from '../../../../demos/src/spinner/SpinnerSizes.vue';
import SpinnerColors from '../../../../demos/src/spinner/SpinnerColors.vue';

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
