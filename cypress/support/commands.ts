/// <reference types="cypress" />

export {};

declare global {
	namespace Cypress {
		interface Chainable {
			login(emailOrUsername: string, password: string): Chainable<void>;
			loginSession(emailOrUsername: string, password: string): Chainable<void>;
		}
	}
}

const login = (emailOrUsername: string, password: string) => {
	cy.visit("/");
	cy.get("[data-cy='openLoginButton']").click();
	cy.get("[data-cy='emailOrUsernameLogin']").type(emailOrUsername);
	cy.get("[data-cy='passwordLogin']").type(password);
	cy.get("[data-cy='loginButton']").click();
};

Cypress.Commands.add("login", (emailOrUsername, password) => {
	login(emailOrUsername, password);
});
Cypress.Commands.add("loginSession", (emailOrUsername, password) => {
	cy.session([emailOrUsername, password], () => {
		login(emailOrUsername, password);
		cy.get("[data-cy='profilePicture']").should("exist");
	});
});
