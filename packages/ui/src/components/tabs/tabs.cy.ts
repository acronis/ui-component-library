import { mount } from '@cypress/vue';
import TabsBasic from '../../../../examples/demos/tabs/TabsBasic.vue';
import TabsLarge from '../../../../examples/demos/tabs/TabsLarge.vue';
import TabsLargeWithIcons from '../../../../examples/demos/tabs/TabsLargeWithIcons.vue';

describe('Tabs', () => {
  it('basic', () => {
    mount(TabsBasic);

    cy.get('.acv-tabs').matchImageSnapshot('tabs-basic');
  });

  it('large', () => {
    mount(TabsLarge);

    cy.get('.acv-tabs').matchImageSnapshot('tabs-large');
  });

  it('large with icons', () => {
    mount(TabsLargeWithIcons);

    cy.get('.acv-tabs').matchImageSnapshot('tabs-large-with-icons');
  });
});
