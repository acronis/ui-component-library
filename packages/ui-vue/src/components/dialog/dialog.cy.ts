/* TODO: Temporarily commented out, due to issues with updating snapshots */
// import { mount } from '@cypress/vue';
// import * as DialogDemos from '../../../../examples/demos/dialog';
//
// describe('Dialog', () => {
//   Object.values(DialogDemos).forEach((component, testIndex) => {
//     const testName = Object.keys(DialogDemos)[testIndex];
//
//     it(`test case for ${testName}`, () => {
//       mount(component as any);
//
//       cy.get('button').first().click();
//
//       cy.matchImageSnapshot(`dialog-${testName}`);
//     });
//   });
// });
