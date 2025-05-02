describe('Backend API', () => {
    it('should return 200 on health check', () => {
        cy.request('GET', 'http://localhost:3000/api/health')
            .then((response) => {
                expect(response.status).to.eq(200)
            })
    })
})