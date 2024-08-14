import { mount } from '@cypress/vue';
import ButtonBasic from '../../../../demos/src/button/ButtonBasic.vue';
import ButtonBlock from '../../../../demos/src/button/ButtonBlock.vue';
import ButtonColorDanger from '../../../../demos/src/button/ButtonColorDanger.vue';
import ButtonColorInfo from '../../../../demos/src/button/ButtonColorInfo.vue';
import ButtonColorInverted from '../../../../demos/src/button/ButtonColorInverted.vue';
import ButtonColorPrimary from '../../../../demos/src/button/ButtonColorPrimary.vue';
import ButtonColorSecondary from '../../../../demos/src/button/ButtonColorSecondary.vue';
import ButtonDocIconStates from '../../../../demos/src/button/ButtonDocIconStates.vue';

const testComponents = [
  ['basic', ButtonBasic],
  ['block', ButtonBlock],
  ['color-danger', ButtonColorDanger],
  ['color-info', ButtonColorInfo],
  ['color-inverted', ButtonColorInverted],
  ['color-primary', ButtonColorPrimary],
  ['color-secondary', ButtonColorSecondary],
  ['icon', ButtonDocIconStates],
];

describe('Button', () => {
  testComponents.forEach(([testName, component]) => {
    it(`test case for ${testName}`, () => {
      mount(component as any);

      cy.matchImageSnapshot(`button-${testName}`);
    });
  });
});
