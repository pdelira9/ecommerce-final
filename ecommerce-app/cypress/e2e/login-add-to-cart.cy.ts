describe('E2E: register, login and add a product to cart', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('register 201 -> login 200 -> add to cart 200', () => {
    cy.intercept('POST', '**/api/auth/register').as('registerRequest');
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');
    cy.intercept('GET', '**/api/products*').as('getProducts');
    cy.intercept('POST', '**/api/cart/add-product').as('addToCart');

    const timestamp = Date.now();
    const emailTest = `cypress_cart_${timestamp}@example.com`;
    const passwordTest = 'Test12345!';

    cy.visit('/register');

    cy.get('#displayName').type(`cypress cart ${timestamp}`);
    cy.get('#dateOfBirth').type('1990-01-01');
    cy.get('#email').type(emailTest);
    cy.get('#phone').type('1234567890');
    cy.get('#password').type(passwordTest);
    cy.get('#repeatPassword').type(passwordTest);

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest', { timeout: 10000 }).then((interception) => {
      expect(interception.response).to.not.be.undefined;
      expect(interception.response!.statusCode).to.equal(201);
    });

    // 2) LOGIN
    cy.visit('/login');

    cy.get('input[type="email"]').should('exist').clear().type(emailTest);
    cy.get('input[type="password"]').should('exist').clear().type(passwordTest);
    cy.get('button[type="submit"]').should('exist').click();

    cy.wait('@loginRequest', { timeout: 10000 }).then((interception) => {
      expect(interception.response).to.not.be.undefined;
      expect(interception.response!.statusCode).to.equal(200);
    });

    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.not.be.null;
    });

    cy.visit('/products');

    cy.wait('@getProducts', { timeout: 10000 });

    cy.get('[data-cy="product-card"]', { timeout: 10000 })
      .should('have.length.at.least', 1)
      .first()
      .as('firstProduct');

    cy.get('@firstProduct').find('[data-cy="add-to-cart-btn"]').click();

    cy.wait('@addToCart', { timeout: 10000 }).then((interception) => {
      expect(interception.response).not.to.be.undefined;
      expect(interception.response!.statusCode).to.equal(200);
    });
  });
});
