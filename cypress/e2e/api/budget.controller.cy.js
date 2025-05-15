describe("Functional Test: Add Budget", function () {
  const testUser = {
    email: "test@example.com",
    password: "password123",
  };

  it("should add a new budget successfully", function () {
    // Login and get token first
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: testUser,
      failOnStatusCode: false,
    }).then((loginRes) => {
      const token = loginRes.body.token;

      const budgetData = {
        category: `Transport-${Date.now()}`,
        amount: 4000,
        month: "May",
      };

      // Use token to add budget
      cy.request({
        method: "POST",
        url: "/budget/add",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: budgetData,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq("Budget added successfully");
      });
    });
  });

  it("should retrieve all budgets", function () {
    // Get new token for this test
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: testUser,
      failOnStatusCode: false,
    }).then((loginRes) => {
      const token = loginRes.body.token;

      // Use token to get all budgets
      cy.request({
        method: "GET",
        url: "/budget/getall",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");
      });
    });
  });

  // update budget
  it("should update an existing budget", function () {
    // Login and get token first
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: testUser,
      failOnStatusCode: false,
    }).then((loginRes) => {
      const token = loginRes.body.token;

      // First add a budget to get its ID
      const initialBudget = {
        category: `Transport-${Date.now()}`,
        amount: 4000,
        month: "May",
      };

      cy.request({
        method: "POST",
        url: "/budget/add",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: initialBudget,
        failOnStatusCode: false,
      }).then((addRes) => {
        const budgetId = addRes.body.budget._id; // Get the ID of created budget

        // Now update the budget
        const updatedBudgetData = {
          category: `Updated-Transport-${Date.now()}`,
          amount: 5000,
          month: "June",
        };

        cy.request({
          method: "PUT",
          url: `/budget/update/${budgetId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: updatedBudgetData,
          failOnStatusCode: false,
        }).then((updateRes) => {
          expect(updateRes.status).to.eq(200);
          expect(updateRes.body.message).to.eq("Budget updated successfully!");
          expect(updateRes.body.budget.category).to.eq(
            updatedBudgetData.category
          );
          expect(updateRes.body.budget.amount).to.eq(updatedBudgetData.amount);
          expect(updateRes.body.budget.month).to.eq(updatedBudgetData.month);
        });
      });
    });
  });

  // delete budget
  it("should delete an existing budget", function () {
    // Login and get token first
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: testUser,
      failOnStatusCode: false,
    }).then((loginRes) => {
      const token = loginRes.body.token;

      // First add a budget to get its ID
      const budgetToDelete = {
        category: `Transport-To-Delete-${Date.now()}`,
        amount: 3000,
        month: "May",
      };

      cy.request({
        method: "POST",
        url: "/budget/add",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: budgetToDelete,
        failOnStatusCode: false,
      }).then((addRes) => {
        const budgetId = addRes.body.budget._id;

        // Now delete the budget
        cy.request({
          method: "DELETE",
          url: `/budget/delete/${budgetId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          failOnStatusCode: false,
        }).then((deleteRes) => {
          expect(deleteRes.status).to.eq(200);
          expect(deleteRes.body.message).to.eq("Budget deleted successfully!"); // Updated message with exclamation mark

          // Verify deletion
          cy.request({
            method: "GET",
            url: `/budget/getall`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            failOnStatusCode: false,
          }).then((getRes) => {
            const deletedBudget = getRes.body.find((b) => b._id === budgetId);
            expect(deletedBudget).to.be.undefined;
          });
        });
      });
    });
  });
});
