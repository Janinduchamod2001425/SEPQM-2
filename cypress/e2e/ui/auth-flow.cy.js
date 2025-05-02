describe('Auth Flow', () => {
    it('should login successfully', () => {
        cy.visit('/login')
        cy.get('[data-cy=email]').type('test@example.com')
        cy.get('[data-cy=password]').type('password123')
        cy.get('[data-cy=submit]').click()
        cy.url().should('include', '/dashboard')
    })
})