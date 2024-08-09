import { mount } from '@cypress/vue';
import SwitchBasic from '@demos/src/switch/SwitchBasic.vue';
import SwitchSizes from '@demos/src/switch/SwitchSizes.vue';

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
