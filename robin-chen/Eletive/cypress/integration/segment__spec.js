describe('Segment report', () => {
  beforeEach(() => {
    cy.viewport(1920, 2026);
    cy.signin('admin');
    cy.server().route('POST', /api/).as('api');
    cy.wait('@api');
    cy.addAttribute({ type: 0, name: 'Test choices attribute' });
    cy.visit('/');
  });

  afterEach(() => {
    cy.logout();
  });

  it('go to segment report', () => {
    cy.get('[data-cy=Segments]').click();
    cy.url().should('match', /segment\/segment/);
  });
});
