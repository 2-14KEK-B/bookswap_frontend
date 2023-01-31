describe("REGISTER", () => {
	it("should open the register modal", () => {
		cy.visit("/");
		cy.get("[data-cy='openLoginButton']").click();
		cy.get("[data-cy='openRegisterButton']").click();
		cy.get("[data-cy='registerModal']").contains("Regisztráció");
	});
	it("should error if user creds not valid", () => {
		cy.visit("/");
		cy.get("[data-cy='openLoginButton']").click();
		cy.get("[data-cy='openRegisterButton']").click();
		cy.get("div.q-card div.q-field__messages").children().should("not.exist");
		cy.get("[data-cy='emailRegister']").type("x");
		cy.get("[data-cy='passwordRegister']").click();
		cy.get("div.q-card div.q-field__messages").children().should("exist");
	});
});
