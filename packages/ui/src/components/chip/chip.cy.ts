import { mount } from '@cypress/vue';
import ChipBasic from '../../../../demos/src/chip/ChipBasic.vue';
import ChipEllipsis from '../../../../demos/src/chip/ChipEllipsis.vue';

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
