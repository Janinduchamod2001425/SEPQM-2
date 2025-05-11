describe("Add Budget Functionality", () => {
    beforeEach(() => {
        // Start mocking before visiting the page
        cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
            statusCode: 200,
            body: {token: "fake-token"}
        }).as('login')

        cy.intercept('POST', `${Cypress.env('apiUrl')}/budget/add`, {
            statusCode: 201,
            body: {message: "Budget added successfully"}
        }).as('addBudget')

        cy.visit('/')

        // Add longer timeout for CI environments
        cy.get('[data-cy=email]', {timeout: 10000})
            .should('be.visible')
            .type('test@example.com', {delay: 100})

        cy.get('[data-cy=password]')
            .type('password123', {delay: 100})

        cy.get('[data-cy=login-btn]')
            .click()

        // Wait for either the mock or real API call
        cy.wait('@login', {timeout: 10000}).then((interception) => {
            // Optional: Assert something about the request
            expect(interception.request.body).to.deep.equal({
                email: 'test@example.com',
                password: 'password123'
            })
        })

        // Verify navigation
        cy.location('pathname', {timeout: 10000}).should('eq', '/add_budget')
    })

    it('should add a budget successfully', () => {
        const category = `Transport-${Date.now()}`

        cy.get('[data-cy=category]').type(category)
        cy.get('[data-cy=amount]').type('4000')

        // Dynamic month selection
        const currentMonth = new Date().toLocaleString('default', {month: 'long'})
        const currentYear = new Date().getFullYear()
        cy.get('[data-cy=month-select]').select(`${currentMonth} ${currentYear}`)

        cy.get('[data-cy=add-budget-btn]').click()

        cy.wait('@addBudget', {timeout: 10000})
        cy.contains('Budget added successfully').should('be.visible')
    })
})