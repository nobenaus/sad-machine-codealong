describe('Search', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should show details for Vienna on load', () => {
    cy.contains('Vienna, Austria');
    cy.get('[data-cy="error-message"]').should('be.empty');
  });

  it('should show details for Vienna in US upon searching', () => {
    cy.get('[data-cy="search-field"]').type(',US{enter}');
    cy.contains('Vienna, United States');
    cy.get('[data-cy="error-message"]').should('be.empty');
  });

  it('should show details for Moscow upon searching', () => {
    cy.get('[data-cy="search-field"]').clear().type('Moscow{enter}');
    cy.contains('Moscow, Russia');
    cy.get('[data-cy="error-message"]').should('be.empty');
  });

  it("should show error message for cities that don't exist", () => {
    cy.get('[data-cy="search-field"]').type(
      'some city that surely doesnt exist{enter}',
    );
    cy.get('[data-cy="error-message"]').should(
      'contain.text',
      'city not found',
    );
  });
});