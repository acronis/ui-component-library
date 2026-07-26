import { mount } from '@cypress/vue';
import ChipBasic from '../../../../examples/demos/chip/ChipBasic.vue';
import ChipEllipsis from '../../../../examples/demos/chip/ChipEllipsis.vue';

const testComponents = [
  ['basic', ChipBasic],
  ['ellipsis', ChipEllipsis],
];

describe('Chip', () => {
  testComponents.forEach(([testName, component]) => {
    it(`test case for ${testName}`, () => {
      mount(component as any);

      cy.matchImageSnapshot(`chip-${testName}`);
    });
  });
});
