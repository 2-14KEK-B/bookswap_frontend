describe("LOGOUT", () => {
	before(() => {
		cy.request("http://127.0.0.1:3000/healthcheck").then((response) => {
			expect(response.status).to.eq(200);
		});
	});

	beforeEach(() => {
		cy.loginSession("test", "1234");
	});

	it("should logout", () => {
		cy.visit("/");
		cy.get("[data-cy='profilePicture']").click();
		cy.get("[data-cy='profileMenu']").contains("Kijelentkezés").click();
		cy.get("[data-cy='openLoginButton']").should("exist");
	});
});
