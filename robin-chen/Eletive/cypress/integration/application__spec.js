describe('Application', () => {
  beforeEach(() => {
    cy.window().then((window) => {
      window.sessionStorage.clear();
    });
  });

  it('redirects to sign in page when visiting basic url', () => {
    cy.visit('/');
    cy.url().should('include', '/signin');
  });

  it('redirect to individual report page after signing in', () => {
    cy.signin('admin');
    cy.url().should('include', '/individual');
  });
});
