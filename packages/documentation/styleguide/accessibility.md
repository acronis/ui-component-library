# Accessibility style guide

Overview the accessibility features of the Acronis UI Component Library and how to use them.

Ui component Library provides a set of features to make the components accessible.
The following features are provided:

- markup semantics
- attributes
- accessible keyboard navigation
- styling
- focus management

Fulfill WCAG 2.1 requirements for the following criteria:

- [WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/example-index/).

## Basics

Learn basics of accessibility in web development.
Start with [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/standards-guidelines/).
And read Vue.js guideline [Accessibility Guide](https://v3.vuejs.org/guide/accessibility.html).

## Check source code with eslint

Check source code with eslint to find accessibility issues.
Use [eslint-plugin-vue-a11y](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility)

## Test with Vue Testing Library

Confirm that your components function correctly for all users by testing them with the Vue Testing Library.
This approach emphasizes accessibility and user-friendly design.
[Explore the Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/).

## Test with screen readers

Regularly use a screen reader to experience how your site is navigated audibly.
This insight is invaluable for understanding the challenges faced by visually impaired users.

## Check color contrast

Check color contrast with [Color Contrast Checker](https://webaim.org/resources/contrastchecker/).
Ensure that text and interactive elements have sufficient contrast to be readable.

## Use semantic HTML

Use semantic HTML elements to improve the accessibility of your website.
[Learn more about semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)

## Use ARIA attributes

Use ARIA attributes to improve the accessibility of your website.
[Learn more about ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

## Check web interfaces with Lighthouse

Use [Lighthouse](https://developers.google.com/web/tools/lighthouse) to audit your website's accessibility

## Automate Tests with Cypress

Automate your accessibility testing with Cypress.
This helps you save time and detect issues early in the development process.
[Learn how to integrate Cypress for accessibility testing](https://github.com/component-driven/cypress-axe)
