# Unit test style guide

## Use createWrapper Function

The createWrapper function is your helper for creating and configuring component wrappers consistently across tests.

## Focus on Behavior, Not Implementation for Robust Tests

Tests should focus on software's behavior, not its internal workings. Consider this example with a BaseButton:

```typescript
it('emits a "buttonClicked" event when button is clicked', () => {
  const wrapper = shallowMount(BaseButton);

  wrapper.find('button').trigger('click');
  expect(wrapper.emitted('buttonClicked')).toBeTruthy();
});
```

## Keep Large Mock Data in Separate Files for Cleanliness

Large mock data can clutter your test files. Keep them in separate files for cleanliness.

## Meaningful Test Naming Conventions are Key

Use meaningful test names to make your tests easier to understand and maintain.
Use the following naming conventions: `Should<ExpectedBehavior>When<Scenario>` and `Should<ExpectedBehavior>If<Scenario>`.

## Keep test independent

Each test should be independent of the others.
This means that the order in which tests are run should not affect the outcome of the tests.

The benefits of this approach include:

**Predictability**: Tests won't fail because of some overlooked state leaking from one test into another.

**Readability**: Each test is self-explanatory. You can read a single test and understand
what it's doing without having to know about any other tests.

**Parallelizability**: Independent tests can run in any order, or even simultaneously,
which can greatly improve test suite execution time.
