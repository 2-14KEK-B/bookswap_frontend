describe("NEW BOOK", () => {
	before(() => {
		cy.request("http://127.0.0.1:3000/healthcheck").then((response) => {
			expect(response.status).to.eq(200);
		});
	});

	beforeEach(() => {
		cy.loginSession("test", "1234");
	});

	it("should open 'newBook' page", () => {
		cy.visit("/");
		cy.get("[data-cy='openNewBookButton']").click();
		cy.url().should("include", "book/new");
	});
});
