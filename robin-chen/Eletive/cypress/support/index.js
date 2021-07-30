import './commands';

before(() => {
  cy.seed();
});

after(() => {
  cy.cleanup();
});
