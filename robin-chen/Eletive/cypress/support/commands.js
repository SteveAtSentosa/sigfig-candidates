const disableLog = { log: false };

const types = {
  admin: {
    name: 'Jane Lane',
    email: 'sasha.vincic@eletive.com',
    password: 'foo',
    admin: true,
  },
  user: {},
  analyst: {},
};

Cypress.Commands.add('signin', (userType) => {
  const user = types[userType];
  cy.visit('/');
  cy.window(disableLog)
    .then(({ actions }) => {
      const { email, password } = user;

      cy.log('Signin');
      cy.window({ log: false }).its('store').invoke('dispatch', actions.auth.signin(email, password));
    });
});

Cypress.Commands.add('logout', () => {
  cy.visit('/');
  cy.window(disableLog)
    .then(({ actions }) => {
      cy.log('Logout');
      cy.window(disableLog).its('store').invoke('dispatch', actions.auth.logout());
      window.sessionStorage.clear();
    });
});

Cypress.Commands.add('addAttribute', ({ type, name }) => {
  cy.window(disableLog)
    .then(({ actions }) => {
      cy.log('select first organization');
      cy.window(disableLog).its('store').invoke('dispatch', actions.app.selectOwnOrganizationID());
      cy.log('create Attribute with segment');
      cy.window(disableLog)
        .its('store')
        .invoke('dispatch', actions.attributes.createAttribute(type, name))
        .then((attribute) => {
          const segments = [{
            managers: [],
            name: 'choice segment',
            value: 1,
            valueUpTo: 1,
          }];

          cy.window(disableLog)
            .its('store')
            .invoke('dispatch', actions.attributes.updateAttribute({ ...attribute, segments }));

          const segment = { id: `${attribute.id}_${segments[0].value}_${segments[0].valueUpTo}` };
          cy.window(disableLog)
            .its('store')
            .invoke('dispatch', actions.attributes.addSegmentManager(types.user, attribute, segment));
        });
    });
});

Cypress.Commands.add('seed', () => {
  const token = Cypress.env('ACCESS_TOKEN');

  const generateTestUser = {
    action: 'testFrontEnd',
    token,
  };

  const baseUrl = Cypress.env('STAGE') === 'dev' ? 'https://api.eletive.com/dev' : 'http://localhost:4000';

  cy.request('POST', `${baseUrl}/auth`, generateTestUser)
    .then(({ body: { data } }) => {
      const { admin, user } = data;
      types.admin = { ...types.admin, ...admin };
      types.user = { ...types.user, ...user };
    });
});

Cypress.Commands.add('cleanup', () => {
  // TODO delete created organization and its data
});
