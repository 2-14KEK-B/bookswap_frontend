describe("LANGUAGE", () => {
	it("should change language from 'hu' to 'en'", () => {
		cy.visit("/");
		cy.get("div.q-page-container main.q-page").should("exist");
		cy.get("main.q-page .q-btn-group a.q-btn").contains("Könyv feltöltés");
		cy.get("[data-cy='langSelect']").click();
		cy.get("[data-cy='langList'] .q-item .q-item__section").contains("en").click();
		cy.get("main.q-page .q-btn-group a.q-btn").contains("Upload new");
	});
});
