// cypress/e2e/functional/add_transaction.cy.js

describe("Add Transaction Functionality", () => {
    beforeEach(() => {
        // Mock API responses
        cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
            statusCode: 200,
            body: { token: "fake-token" }
        }).as('login');

        cy.intercept('POST', `${Cypress.env('apiUrl')}/transaction/add`, {
            statusCode: 200,
            body: { 
                _id: "mock-transaction-id",
                type: "expense",
                amount: 150.50,
                category: "Food"
            }
        }).as('addTransaction');

        cy.visit('/');

        // Login
        cy.get('[data-cy=email]', { timeout: 10000 })
            .should('be.visible')
            .type('test@example.com', { delay: 100 });

        cy.get('[data-cy=password]')
            .type('password123', { delay: 100 });

        cy.get('[data-cy=login-btn]')
            .click();

        // Wait for login and navigate to transaction page
        cy.wait('@login', { timeout: 10000 });
        cy.visit('/add_transaction');
    });

    it('should successfully add an expense transaction and stay on page', () => {
        // Fill transaction form
        cy.get('[data-cy=transaction-type-expense]').should('be.checked');
        cy.get('[data-cy=transaction-amount]').type('150.50');
        cy.get('[data-cy=transaction-currency]').select('USD');
        cy.get('[data-cy=transaction-category]').select('Food');
        
        // Add tags
        cy.get('[data-cy=transaction-tag-input]').type('dining');
        cy.get('[data-cy=transaction-add-tag]').click();
        cy.get('[data-cy=transaction-tag-input]').type('lunch');
        cy.get('[data-cy=transaction-add-tag]').click();
        
        // Verify tags were added
        cy.get('[data-cy=transaction-tag-dining]').should('exist');
        cy.get('[data-cy=transaction-tag-lunch]').should('exist');

        // Submit form
        cy.get('[data-cy=transaction-submit]').click();

        // Verify API call
        cy.wait('@addTransaction').then((interception) => {
            expect(interception.request.body).to.deep.include({
                type: "expense",
                amount: 150.50,
                category: "Food",
                tags: ["dining", "lunch"]
            });
        });

        // Verify success message
        cy.contains('Transaction added successfully').should('be.visible');
        
        // Verify we stayed on the same page
        cy.url().should('include', '/add_transaction');
        
        // Verify form was reset
        cy.get('[data-cy=transaction-amount]').should('have.value', '');
        cy.get('[data-cy=transaction-tag-input]').should('have.value', '');
        cy.get('[data-cy=transaction-tag-dining]').should('not.exist');
        cy.get('[data-cy=transaction-tag-lunch]').should('not.exist');
    });

    
    it('should show validation errors for invalid inputs', () => {
        // Try submitting empty form
        cy.get('[data-cy=transaction-submit]').click();
        
        // Verify validation message
        cy.get('[data-cy=error-message]')
            .should('be.visible')
            .and('contain', 'Amount must be greater than 0');
            
        // Test invalid amount
        cy.get('[data-cy=transaction-amount]').type('0');
        cy.get('[data-cy=transaction-submit]').click();
        cy.get('[data-cy=error-message]')
            .should('be.visible')
            .and('contain', 'Amount must be greater than 0');
    });

    it('should allow adding and removing tags', () => {
        // Add tag
        cy.get('[data-cy=transaction-tag-input]').type('shopping');
        cy.get('[data-cy=transaction-add-tag]').click();
        
        // Verify tag exists
        cy.get('[data-cy=transaction-tag-shopping]').should('exist');
        
        // Remove tag
        cy.get('[data-cy=transaction-remove-tag-shopping]').click();
        
        // Verify tag was removed
        cy.get('[data-cy=transaction-tag-shopping]').should('not.exist');
    });

    it('should show recurring fields only when recurring is checked', () => {
    // Recurring fields should be hidden initially
    cy.get('[data-cy=transaction-recurrence-container]').should('not.exist');
    
    // Check recurring checkbox with more reliable interaction
    cy.get('[data-cy=transaction-recurring]')
        .click({ force: true })
        .should('be.checked');
    
    // Recurring fields should now be visible
    cy.get('[data-cy=transaction-recurrence-container]')
        .should('be.visible')
        .within(() => {
            cy.get('[data-cy=transaction-recurrence]').should('be.visible');
        });
    
    // Uncheck recurring checkbox
    cy.get('[data-cy=transaction-recurring]')
        .click({ force: true })
        .should('not.be.checked');
    
    // Recurring fields should be hidden again
    cy.get('[data-cy=transaction-recurrence-container]').should('not.exist');
});
});