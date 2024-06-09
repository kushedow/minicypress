# Mini Cypress

Lightweight Cypress-like framework for grading code challenges

## Usage

1 include municypress.js to your document

2 define tests, using it(...) function

```
it('All buttons should exist', () => {
    cy.get('#error').should('exist');
    cy.get('#success').should('exist');
    cy.get('#pending').should('exist');
    cy.get('#initial').should('exist');
});
```

3 run tests when page is ready

```
document.addEventListener('DOMContentLoaded', () => {
    run_tests(tests)
})
```

4 true will be returned if all the tests are ok, false in any other case
