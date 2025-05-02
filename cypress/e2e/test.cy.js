describe('Cypress Kitchen Sink Tests', () => {
    it('should demonstrate basic form interactions', () => {
        // Arrange
        const testEmail = 'fake@email.com'

        // Act
        cy.visit('https://example.cypress.io')
        cy.contains('type').click()

        // Assert
        cy.url().should('include', '/commands/actions')

        // Act + Assert
        cy.get('.action-email')
            .type(testEmail)
            .should('have.value', testEmail)
    })
})