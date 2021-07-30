import moment from 'moment';

describe('Actions', () => {
  const defaultObjective = {
    name: 'Objective',
    description: 'Objective description',
    driver: 'Autonomy',
    startAt: moment().add(30, 'days').unix(),
  };

  const defaultKey = {
    name: 'Key',
    minValue: 123,
    maxValue: 666,
  };

  before(() => {
    cy.seed();
    cy.server().route('POST', /api/).as('api');
    cy.signin('admin');
    cy.wait('@api');
  });


  const getObjectiveForm = () => cy.get('[data-cy=content] form');

  const editObjectiveKey = (keyData, getKeyForm, suffix = ' by cypress') => {
    const { name, minValue, maxValue, currency } = keyData;
    getKeyForm().find('[name=key-name]').type(`${name} ${suffix}`);

    minValue && getKeyForm().find('[name=start]').type(`{selectAll}${minValue}`);
    maxValue && getKeyForm().find('[name=target]').type(`{selectAll}${maxValue}`);

    if (currency) {
      getKeyForm().find('[data-cy=popover-button]').click();
      cy.contains('div:visible', currency).click();
    }
  };

  const addObjectiveKey = (type = 'percent') => {
    getObjectiveForm().find('[data-cy=minimal-button]').click();

    const objectiveKeyForm = () => cy.get('[data-cy=key-result-item]').last();
    objectiveKeyForm().find(`[data-cy=key-type-${type}]`).click();
  };

  const editObjectivForm = (objective, suffix = ' by cypress') => {
    const { name, description, driver, isPublic } = objective;

    getObjectiveForm().find('input[name=name]').type(`${name} ${suffix}`);
    getObjectiveForm().find('[name=description]').type(`${description} ${suffix}`);
    getObjectiveForm().find('[data-cy=popover-button]').first().click();
    cy.contains('[data-cy=list-item]:visible', driver).click();
    const publicOrPrivateSelector = isPublic ? '[data-cy=Public]' : '[data-cy=Private]';
    cy.get(publicOrPrivateSelector).click();
  };

  const alignWithParent = (parent) => {
    getObjectiveForm().find('[data-cy=popover-button]').eq(1).click();
    cy.contains('[data-cy=list-item]:visible', parent).click();
  };

  const alignWithObjective = (parent) => {
    getObjectiveForm().find('[data-cy=popover-button]').eq(2).click();
    cy.contains('[data-cy=list-item]:visible', parent).click();
  };

  const submitForm = () => {
    cy.get('[data-cy="form-actions"] button').last().click();
    cy.wait('@api');
    cy.url().should('match', /organization\/organization\/([0-9])+\/actions\/list/);
  };

  describe('Organization', () => {
    beforeEach(() => {
      cy.viewport(1920, 2026);
      cy.server().route('POST', /api/).as('api');
      cy.get('[data-cy=Organization]').click();
      cy.get('[data-cy="Actions"]').click();
      cy.url().should('match', /organization\/organization\/([0-9])+\/actions/);
    });

    describe('Create objective', () => {
      it('with one key', () => {
        const suffix = ' by cypress with one key';

        cy.get('[data-cy="section-header"] button').click();
        cy.url().should('match', /organization\/organization\/([0-9])+\/actions\/create/);
        editObjectivForm(defaultObjective, suffix);

        const getKeyForm = () => cy.get('[data-cy=key-result-item]');
        editObjectiveKey(defaultKey, getKeyForm, suffix);

        submitForm();
        cy.contains('[data-cy=objective-list-item] div', `${defaultObjective.name} ${suffix}`).should('be.visible');
      });

      it('with four keys', () => {
        const suffix = ' by cypress with four keys';

        cy.get('[data-cy="section-header"] button').click();
        cy.url().should('match', /organization\/organization\/([0-9])+\/actions\/create/);
        editObjectivForm(defaultObjective, suffix);

        const getKeyForm = () => cy.get('[data-cy=key-result-item]').last();
        editObjectiveKey(defaultKey, getKeyForm, suffix);

        addObjectiveKey('currency');
        const currencyKey = { ...defaultKey, currency: 'SEK' };
        editObjectiveKey(currencyKey, getKeyForm, `currency ${suffix}`);

        addObjectiveKey('number');
        const numberKey = { ...defaultKey, minValue: 1, maxValue: 10 };
        editObjectiveKey(numberKey, getKeyForm, `number ${suffix}`);

        addObjectiveKey('complete');
        const compeletedKey = { name: 'Key' };
        editObjectiveKey(compeletedKey, getKeyForm, ` complete ${suffix}`);

        submitForm();
        cy.contains('[data-cy=objective-list-item] div', `${defaultObjective.name} ${suffix}`).should('be.visible');
      });
    });

    describe('Edit objective', () => {
      it('select first objective and change name and driver', () => {
        const suffix = ' by cypress, first objective ';

        cy.get('[data-cy=objective-list-item] button').first().click();
        cy.get('[data-cy=edit]:visible').click();

        cy.url().should('match', /organization\/organization\/([0-9])+\/actions\/edit\/([0-9])+/);
        const name = 'Edited objective';
        const driver = 'Workplace and Tools';
        const editedObjective = { ...defaultObjective, name, driver };
        editObjectivForm(editedObjective, suffix);

        submitForm();
        cy.contains('[data-cy=objective-list-item] div', `${name} ${suffix}`).should('be.visible');
      });
    });

    describe('List objectives', () => {
      const suffix = ' by cypress with one key';
      const getFirstObjective = () => cy.get('[data-cy=objective-list-item]').last();

      it('should be expandable', () => {
        getFirstObjective().find('[data-cy=objective-title]').click();
        getFirstObjective().find('[data-cy=objective-list-item-content]').should('be.visible');
        getFirstObjective().contains('div:visible', `${defaultKey.name} ${suffix}`).should('be.visible');
      });

      it('should be inline editable', () => {
        getFirstObjective().find('[data-cy=objective-title]').click();

        const { minValue, maxValue } = defaultKey;
        cy.contains('div:visible', `${minValue}% - ${maxValue}%`).click();
        getFirstObjective().find('[data-cy=objective-list-item-content] button').click();
        const currentValue = 321;
        getFirstObjective().find('[data-cy=objective-list-item-content] input').type(`{selectAll}${currentValue}`);
        getFirstObjective().find('[data-cy=objective-list-item-content] button').click();
        cy.contains('div:visible', `${currentValue}% - ${maxValue}%`).should('be.visible');
      });
    });
  });

  describe('Segment', () => {
    before(() => {
      cy.server().route('POST', /api/).as('api');
      cy.addAttribute({ type: 0, name: 'Test choices attribute' });
      cy.wait('@api');
      cy.logout();
      cy.signin('user');
      cy.visit('/');
    });

    describe('Create objective', () => {
      beforeEach(() => {
        cy.viewport(1920, 2026);
        cy.server().route('POST', /api/).as('api');
        cy.get('[data-cy=Segments]').click();
        cy.url().should('match', /segment\/segment\/([0-9_])+/);
        cy.get('[data-cy="Actions"]').click();
        cy.url().should('match', /segment\/organization\/([0-9])+\/segment\/([0-9_])+\/actions/);
      });

      it('with one key', () => {
        const suffix = ' segment by cypress with one key';

        cy.get('[data-cy="section-header"] button').click();
        cy.url().should('match', /segment\/organization\/([0-9])+\/segment\/([0-9_])+\/actions\/create/);
        editObjectivForm(defaultObjective, suffix);

        const getKeyForm = () => cy.get('[data-cy=key-result-item]');
        editObjectiveKey(defaultKey, getKeyForm, suffix);

        submitForm();
      });

      it('aligned with organization objective', () => {
        const suffix = ' segment by cypress aligned with organization objective';

        cy.get('[data-cy="section-header"] button').click();
        cy.url().should('match', /segment\/organization\/([0-9])+\/segment\/([0-9_])+\/actions\/create/);
        editObjectivForm(defaultObjective, suffix);

        const getKeyForm = () => cy.get('[data-cy=key-result-item]');
        editObjectiveKey(defaultKey, getKeyForm, suffix);

        alignWithParent('testFrontEnd organization');
        const parentSuffix = ' segment by cypress with one key';
        const parentObjective = `${defaultObjective.name} ${parentSuffix}`;
        alignWithObjective(parentObjective);

        submitForm();
      });
    });
  });

  describe('Individual', () => {
    before(() => {
      cy.server().route('POST', /api/).as('api');
      cy.signin('user');
      cy.wait('@api');
      cy.visit('/');
    });

    describe('Create objective', () => {
      beforeEach(() => {
        cy.viewport(1920, 2026);
        cy.get('[data-cy=Me]').click();
        cy.url().should('match', /individual/);
        cy.get('[data-cy="Actions"]').click();
        cy.url().should('match', /individual\/actions\/list/);
      });

      it('own objective', () => {
        const suffix = ' individual by cypress my own';

        cy.get('[data-cy="section-header"] button').click();
        cy.url().should('match', /individual\/actions\/create/);
        editObjectivForm(defaultObjective, suffix);

        const getKeyForm = () => cy.get('[data-cy=key-result-item]');
        editObjectiveKey(defaultKey, getKeyForm, suffix);

        submitForm();
        cy.url().should('match', /individual\/actions\/list/);
      });
    });
  });
});
