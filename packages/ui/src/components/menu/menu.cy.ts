import { mount } from '@cypress/vue';
import MenuBasic from '../../../../examples/demos/menu/MenuBasic.vue';
import MenuPrimary from '../../../../examples/demos/menu/MenuPrimary.vue';
import MenuSecondary from '../../../../examples/demos/menu/MenuSecondary.vue';
import MenuTertiary from '../../../../examples/demos/menu/MenuTertiary.vue';

const testComponents = [
  ['basic', MenuBasic],
  ['primary', MenuPrimary],
  ['secondary', MenuSecondary],
  ['tertiary', MenuTertiary],
];

describe('Menu visual regression', () => {
  testComponents.forEach(([testName, component]) => {
    it(`test case for ${testName}`, () => {
      mount(component as any);

      cy.matchImageSnapshot(`menu-${testName}`);
    });
  });
});
