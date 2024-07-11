import { mount } from '@cypress/vue';
import CheckboxStates from '../../../../documentation/demos/checkbox/CheckboxStates.vue';
import CheckboxSizes from '../../../../documentation/demos/checkbox/CheckboxSizes.vue';

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
