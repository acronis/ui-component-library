import { mount } from '@cypress/vue';
import LinkStates from '@demos/src/link/LinkStates.vue';
import LinkBasic from '@demos/src/link/LinkBasic.vue';

// TODO: use it after normalizing the view of icons inside components
describe.skip('Link', () => {
  it('basic', () => {
    mount(LinkBasic);

    cy.matchImageSnapshot('link-basic');
  });

  it('states', () => {
    mount(LinkStates);

    cy.matchImageSnapshot('link-states');
  });
});
