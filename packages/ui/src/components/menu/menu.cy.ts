import { mount } from '@cypress/vue';
import MenuBasic from '../../../../demos/src/menu/MenuBasic.vue';
import MenuPrimary from '../../../../demos/src/menu/MenuPrimary.vue';
import MenuSecondary from '../../../../demos/src/menu/MenuSecondary.vue';
import MenuTertiary from '../../../../demos/src/menu/MenuTertiary.vue';

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
