import { mount } from '@cypress/vue';
import LinkStates from '../../../../documentation/demos/link/LinkStates.vue';
import LinkBasic from '../../../../documentation/demos/link/LinkBasic.vue';

describe('Link', () => {
  it('basic', () => {
    mount(LinkBasic);

    cy.matchImageSnapshot('link-basic');
  });

  it('states', () => {
    mount(LinkStates);

    cy.matchImageSnapshot('link-states');
  });
});
