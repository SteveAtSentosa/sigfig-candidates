describe('Custom surveys', () => {
  beforeEach(() => {
    cy.viewport(1920, 2026);
    cy.server().route('POST', /api/).as('api');
    cy.signin('admin');
    cy.wait('@api');
    cy.get('[data-cy=Organization]').click();
    cy.wait('@api');
    cy.get('[data-cy="Custom surveys"]').click();
    cy.url().should('match', /organization\/custom-surveys\/list\/active/);
  });

  afterEach(() => {
    cy.logout();
  });

  it('create custom survey', () => {
    cy.get('[data-cy=SectionActionSubmit]').click();
    cy.url().should('match', /organization\/custom-surveys\/create/);
    cy.get('input').type('Custom survey by cypress');
    cy.get('button[data-cy=large-button]').last().click();
    cy.wait('@api');
    cy.url().should('match', /organization\/custom-surveys\/([0-9])+\/edit/);
  });

  it('add 1-5 choice question to custom survey', () => {
    cy.get('button[data-tab-id=draft]').click();
    cy.get('[data-cy="SortableTableRow"]').first().click();
    cy.get('button[data-cy=SectionActionSubmit]').click();
    cy.get('button[data-cy=QuestionTypeButton]').first().click();
    const question = 'Cypress choice 1-5 question';
    cy.get('textarea').type(question);
    cy.get('button[data-cy=CreateQuestion]').click();
    cy.contains(question).should('be.visible');
    cy.get('[data-cy=PreviewContainer] button').should('have.length', 5);
  });
});
