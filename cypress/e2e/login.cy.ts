describe("LOGIN", () => {
	before(() => {
		cy.request("http://127.0.0.1:3000/healthcheck").then((response) => {
			expect(response.status).to.eq(200);
		});
	});

	it("should login", () => {
		cy.login("test", "1234");
		cy.get("[data-cy='profilePicture']").should("exist");
	});
});
