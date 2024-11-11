import { mount } from '@cypress/vue';
import CheckboxSizes from '../../../../examples/demos/checkbox/CheckboxSizes.vue';
import CheckboxStates from '../../../../examples/demos/checkbox/CheckboxStates.vue';

describe('Checkbox', () => {
  it('states', () => {
    mount(CheckboxStates);

    cy.matchImageSnapshot('checkbox-states');
  });

  it('sizes', () => {
    mount(CheckboxSizes);

    cy.matchImageSnapshot('checkbox-sizes');
  });
});
