import { mount } from '@cypress/vue';
import AsideBasic from '../../../../examples/demos/aside/AsideBasic.vue';

describe('Aside', () => {
  it('test case for all aside variants and states', () => {
    mount(AsideBasic as any);

    cy.matchImageSnapshot('aside-all-variants');
  });
});
