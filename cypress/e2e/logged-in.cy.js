const email = Cypress.env("AMAZON_EMAIL");
const password = Cypress.env("AMAZON_PASSWORD");

let address = {
  name: "Ricardo",
  phone: "+5511993491245",
  cep: "05750220",
  number: "123",
};

beforeEach(() => {
  cy.login(email, password);
});

describe("loggedIn", () => {
  it("Validando login", () => {
    cy.visit("/");
    // Verificando se o usuário está logado.
    cy.getCookie("session-token").should("exist");
  });

  it("Adiciona endereço na conta do usuário", () => {
    cy.visit("/");
    // Acessando a página de endereços.
    cy.get('[data-nav-ref="nav_youraccount_btn"]').click();
    cy.contains("a.ya-card__whole-card-link", "Endereços").click();
    cy.get("#ya-myab-address-add-link").click();
    // Adicionando um novo endereço.
    cy.fillAddressDetails(address);
    cy.get("#address-ui-widgets-form-submit-button > span > input").click();
  });

  it('Remove o endereço do usuário caso já exista', () => {
    cy.visit('/a/addresses?ref_=ya_d_c_addr');
    // Verificando se o endereço foi adicionado.
    cy.get('.a-section.a-spacing-double-large')
      .should("exist")
      .children()
      .should('contain', address.number)
      .and('contain', address.cep) // Rua Francisco Viana
      .then(() => {
        // Removendo o endereço.
        cy.get('a#ya-myab-address-delete-btn-0').click();
        cy.get('#deleteAddressModal-0-submit-btn > span > input')
          .should('be.visible')
          .click()
          .type('{enter}');
    })
  })

  it.skip('Alterando o endereço do usuário', () => {
    cy.visit('/a/addresses?ref_=ya_d_c_addr');
    // Verificando se o endereço foi adicionado.
    cy.get('.a-section.a-spacing-double-large')
      .should("exist")
      .children()
      .should('contain', address.number)
      .and('contain', address.cep)
      .then(() => {
        address.cep = '08420720'; // Avenida Professor João Batista Conti
        address.number = '456';
        cy.log('Achou cep e número do endereço');
        cy.get('a#ya-myab-address-edit-btn-0').click();

        // Editando o endereço.
        cy.fillAddressDetails(address);
        cy.get('#address-ui-widgets-form-submit-button > span > input')
          .should('be.visible')
          .click()
    })
  })
});
