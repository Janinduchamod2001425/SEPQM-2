describe("Functional Test: Add Budget", () => {
    let token = "";
    const testUser = {
        email: "test@example.com",
        password: "password123"
    };

    before(() => {
        cy.request({
            method: "POST",
            url: "/auth/signup",
            body: {
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            },
            failOnStatusCode: false
        }).then(() => {
            cy.request({
                method: "POST",
                url: "/auth/login",
                body: testUser,
                failOnStatusCode: false
            }).then((res) => {
                console.log("Login response:", res.body);
                expect(res.status).to.eq(200);
                token = res.body.token;
                expect(token).to.exist;
            });
        });
    });


    it("should add a new budget successfully", () => {
        const budgetData = {
            category: `Transport-${Date.now()}`,
            amount: 4000
        };

        cy.request({
            method: "POST",
            url: "/budget/add",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: budgetData,
            failOnStatusCode: false
        }).then((res) => {
            console.log("Add Budget Response:", res.body);
            expect(res.status).to.eq(201);
            expect(res.body.message).to.eq("Budget added successfully");
        });
    });
});
