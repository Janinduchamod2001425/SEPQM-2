describe("Add Budget Functionality", () => {
    it("should log in and add a new budget successfully", () => {
        cy.visit("http://localhost:5173");

        // Login
        cy.get("input[placeholder='Email']").type("test@example.com");
        cy.get("input[placeholder='Password']").type("password123");
        cy.contains("Login").click();

        // Check if redirected correctly to /add_budget page
        cy.url({timeout: 10000}).should('include', '/add_budget');

        // Fill form
        cy.get("input[placeholder='Category']").type(`Transport-${Date.now()}`);
        cy.get("input[placeholder='Amount']").type("4000");

        // Ensure that the select dropdown is available and the option exists
        cy.get("select").should('be.visible').select("May 2024");

        // Submit the form
        cy.contains("Add").click();

        // Assert success alert is shown
        cy.on("window:alert", (txt) => {
            expect(txt).to.contains("Budget added successfully");
        });

        // Optionally, assert that the budget is visible or stored in the UI
        cy.contains("Transport").should('be.visible');  // Example check to verify that the budget appears
    });
});
