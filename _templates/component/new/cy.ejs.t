---
to: "packages/ui/src/components/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.camel(name) %>.cy.ts"
---
import { mount } from '@cypress/vue';
import <%= h.changeCase.pascal(name) %>Basic from '../../../../demos/src/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.pascal(name) %>Basic.vue';

const testComponents = [
  ['basic', <%= h.changeCase.pascal(name) %>Basic]
];

describe('<%= h.changeCase.pascal(name) %>', () => {
  testComponents.forEach(([testName, component]) => {
    it(`test case for ${testName}`, () => {
      mount(component as any);

      cy.matchImageSnapshot(`<%= h.changeCase.kebab(name) %>-${testName}`);
    });
  });
});
