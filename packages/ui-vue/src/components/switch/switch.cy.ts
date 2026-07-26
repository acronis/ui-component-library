import { mount } from '@cypress/vue';
import SwitchBasic from '../../../../examples/demos/switch/SwitchBasic.vue';
import SwitchSizes from '../../../../examples/demos/switch/SwitchSizes.vue';

describe('Switch', () => {
  it('basic', () => {
    mount(SwitchBasic);

    cy.matchImageSnapshot('switch-states');
  });

  it('sizes', () => {
    mount(SwitchSizes);

    cy.matchImageSnapshot('switch-sizes');
  });
});
