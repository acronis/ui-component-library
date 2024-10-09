import { mount } from '@cypress/vue';
import CheckboxSizes from '../../../../demos/src/checkbox/CheckboxSizes.vue';
import CheckboxStates from '../../../../demos/src/checkbox/CheckboxStates.vue';

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
