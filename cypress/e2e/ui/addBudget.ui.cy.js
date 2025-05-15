describe('Add Budget Form - UI Test', () => {
    it('should test all UI aspects of the budget form', () => {
        // 1. VISIBILITY CHECKS
        cy.visit('/add_budget');

        // Add longer timeouts for CI environments
        cy.get('[data-cy=category]', {timeout: 10000}).should('be.visible');
        cy.get('[data-cy=amount]').should('be.visible');
        cy.get('[data-cy=month-select]').should('be.visible');
        cy.get('[data-cy=add-budget-btn]')
            .should('be.visible')
            .and('contain', 'Add');

        // 2. VALIDATION TESTS
        // Test empty form submission
        cy.get('[data-cy=add-budget-btn]').click();
        cy.get('[data-cy=error-message]', {timeout: 5000})
            .should('be.visible')
            .and('contain', 'All fields are required');

        // Clear previous error - with more robust checking
        cy.get('[data-cy=category]').type('Test');
        // Wait for error to clear - check both visibility and content
        cy.get('[data-cy=error-message]')
            .should('not.be.visible')
            .and('not.contain', 'All fields are required');

        // Test negative amount
        cy.get('[data-cy=amount]').clear().type('-100');
        cy.get('[data-cy=add-budget-btn]').click();

        // Check error message - more flexible matching
        cy.get('[data-cy=error-message]')
            .should('be.visible')
            .invoke('text')
            .should('match', /amount must be positive|invalid amount/i);

        // Clear the error properly
        cy.get('[data-cy=amount]').clear().type('100');
        cy.get('[data-cy=error-message]', {timeout: 10000}).should('not.be.visible');

        // 3. SUCCESSFUL SUBMISSION FLOW
        // Mock API response
        cy.intercept('POST', '/budget/add', {
            statusCode: 201,
            body: {
                message: "Budget added successfully",
                budget: {
                    id: "test-123",
                    category: "Groceries",
                    amount: 200,
                    month: "2025-05"
                }
            }
        }).as('addRequest');

        // Fill valid form
        cy.get('[data-cy=category]').clear().type('Groceries');
        cy.get('[data-cy=amount]').clear().type('200');
        cy.get('[data-cy=month-select]').select('May 2025');

        // Verify submission
        cy.get('[data-cy=add-budget-btn]').click();
        cy.wait('@addRequest');

        // Verify success message
        cy.contains(/budget added successfully/i, {timeout: 5000})
            .should('be.visible');

        // Verify form reset
        cy.get('[data-cy=category]').should('have.value', '');
        cy.get('[data-cy=amount]').should('have.value', '');
    });
});