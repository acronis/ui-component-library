import { mount } from '@cypress/vue';
import LinkBasic from '../../../../examples/demos/link/LinkBasic.vue';
import LinkStates from '../../../../examples/demos/link/LinkStates.vue';

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
