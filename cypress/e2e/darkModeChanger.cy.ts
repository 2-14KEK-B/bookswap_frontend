describe("DARK MODE", () => {
	it("should change dark mode to light", () => {
		cy.visit("/");
		cy.get("div.q-page-container main.q-page").should("exist");
		cy.get("div.q-page-container main.q-page").should("have.class", "bg-grey-9");
		cy.get("[data-cy='darkModeButton']").should("exist").click();
		cy.get("div.q-page-container main.q-page").should("have.class", "bg-grey-4");
	});
	it("should change light mode to dark", () => {
		cy.visit("/");
		cy.get("[data-cy='darkModeButton']").should("exist").click();
		cy.get("div.q-page-container main.q-page").should("exist");
		cy.get("div.q-page-container main.q-page").should("have.class", "bg-grey-4");
		cy.get("[data-cy='darkModeButton']").should("exist").click();
		cy.get("div.q-page-container main.q-page").should("have.class", "bg-grey-9");
	});

	// it("should change language from 'hu' to 'en'", () => {
	// 	cy.visit("/");
	// 	cy.get("div.q-page-container main.q-page").should("exist");
	// 	cy.get("main.q-page .q-btn-group a.q-btn").contains("Könyv feltöltés");
	// 	cy.get("[data-cy='langSelect']").click();
	// 	cy.get("[data-cy='langList'] .q-item .q-item__section").contains("en").click();
	// 	cy.get("main.q-page .q-btn-group a.q-btn").contains("Upload new");
	// });
});
