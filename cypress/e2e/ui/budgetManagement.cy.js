describe("Functional Test: Budget Management", () => {
    const testUser = {
        email: "test@example.com",
        password: "password123",
    };

    it("should log in and add a new budget", () => {
        cy.visit("/");

        cy.get('input[type="email"]').type(testUser.email);
        cy.get('input[type="password"]').type(testUser.password);
        cy.get("button").contains("Login").click();

        cy.url().should("include", "/add_budget");

        const category = `Transport-${Date.now()}`;
        cy.get('input[placeholder="Category"]').type(category);
        cy.get('input[placeholder="Amount"]').type("4000");

        cy.get("select").select("May 2025");

        const alertStub = cy.stub();
        cy.on("window:alert", alertStub);

        cy.get("button").contains("Add").click().then(() => {
            expect(alertStub).to.have.been.calledWithMatch("successfully");
        });
    });
});
