// cypress/e2e/functional/add_budget.cy.js

describe("Add Budget Functionality", () => {
    beforeEach(() => {
        cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
            statusCode: 200,
            body: {token: "fake-token"}
        }).as('login');

        cy.intercept('POST', `${Cypress.env('apiUrl')}/budget/add`, {
            statusCode: 200,
            body: {message: "Budget added successfully"}
        }).as('addBudget');

        cy.visit('/');

        // Login
        cy.get('[data-cy=email]').type('test@example.com');
        cy.get('[data-cy=password]').type('password123');
        cy.get('[data-cy=login-btn]').click();
        cy.wait('@login');

        cy.visit('/add_budget');
    });

    it("should successfully add a budget", () => {
        cy.get('[data-cy=category]').type('Groceries');
        cy.get('[data-cy=amount]').type('200');

        // Select the first available valid month (ensuring it exists)
        cy.get('[data-cy=month-select]')
            .should('be.visible')
            .find('option')
            .eq(1) // skip the "Select Month" option
            .then((option) => {
                cy.get('[data-cy=month-select]').select(option.text());
            });

        cy.get('[data-cy=add-budget-btn]').click();

        cy.wait('@addBudget').then((interception) => {
            expect(interception.request.body).to.have.all.keys('category', 'amount', 'month');
            expect(interception.request.body).to.deep.include({
                category: 'Groceries',
                amount: 200
            });
        });

        cy.contains('Budget added successfully').should('be.visible');

        // Ensure form is reset
        cy.get('[data-cy=category]').should('have.value', '');
        cy.get('[data-cy=amount]').should('have.value', '');
        cy.get('[data-cy=month-select]').should('have.value', '');
    });

    it("should show validation error for empty fields", () => {
        cy.get('[data-cy=add-budget-btn]').click();

        cy.get('[data-cy=error-message]')
            .should('be.visible')
            .and('contain', 'All fields are required');
    });

    it("should show validation error for zero or negative amount", () => {
        cy.get('[data-cy=category]').type('Transport');
        cy.get('[data-cy=amount]').type('0');
        cy.get('[data-cy=month-select]')
            .find('option')
            .eq(1)
            .then((option) => {
                cy.get('[data-cy=month-select]').select(option.text());
            });

        cy.get('[data-cy=add-budget-btn]').click();

        cy.get('[data-cy=error-message]')
            .should('be.visible')
            .and('contain', 'Amount must be positive');
    });
});
