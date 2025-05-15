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
        
        // In a real app, you might click a navigation link
        cy.visit('/add_transaction');
    });

    it('should add an expense transaction successfully', () => {
        // Fill transaction form
        cy.get('[data-cy=transaction-type-expense]').check();
        cy.get('[data-cy=transaction-amount]').type('150.50');
        cy.get('[data-cy=transaction-currency]').select('USD');
        cy.get('[data-cy=transaction-category]').select('Food');
        
        // Add tags
        cy.get('[data-cy=transaction-tag-input]').type('dining');
        cy.get('[data-cy=transaction-add-tag]').click();
        cy.get('[data-cy=transaction-tag-input]').type('lunch');
        cy.get('[data-cy=transaction-add-tag]').click();
        
        // Set date (today by default)
        
        // Submit form
        cy.get('[data-cy=transaction-submit]').click();

        // Verify API call
        cy.wait('@addTransaction', { timeout: 10000 }).then((interception) => {
            expect(interception.request.body).to.deep.include({
                type: "expense",
                amount: 150.50,
                category: "Food",
                tags: ["dining", "lunch"]
            });
        });

        // Verify success (adjust based on your success handling)
        cy.contains('Transaction added successfully').should('be.visible');
    });

    it('should add a recurring income transaction', () => {
        // Fill transaction form
        cy.get('[data-cy=transaction-type-income]').check();
        cy.get('[data-cy=transaction-amount]').type('2000');
        cy.get('[data-cy=transaction-currency]').select('USD');
        cy.get('[data-cy=transaction-category]').select('Salary');
        
        // Enable recurring
        cy.get('[data-cy=transaction-recurring]').check();
        cy.get('[data-cy=transaction-recurrence]').select('monthly');
        
        // Submit form
        cy.get('[data-cy=transaction-submit]').click();

        // Verify API call
        cy.wait('@addTransaction').then((interception) => {
            expect(interception.request.body).to.deep.include({
                isRecurring: true,
                recurrence: "monthly"
            });
        });

        // Verify success
        cy.contains('Transaction added successfully').should('be.visible');
    });

    
});