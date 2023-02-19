it('standard QAT elements are in DOM', () => {
  cy.visit('/');
  cy.get('[data-cy="qat-save"]');
  cy.get('[data-cy="qat-undo"]');
  cy.get('[data-cy="qat-redo"]');
  cy.get('[data-cy="qat-open"]').should('not.exist');
});

it('QAD is not open by default and can be opened and closed', () => {
  cy.visit('/');
  cy.get('[data-cy="QuickAccessDropdown"]').should('not.exist');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="QuickAccessDropdown"]');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="QuickAccessDropdown"]').should('not.exist');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="QuickAccessDropdown"]');
  cy.get('body').click(0, 0);
  cy.get('[data-cy="QuickAccessDropdown"]').should('not.exist');
});

it('can remove element from QAT, and QAD gets closed after clicking button that removes the element', () => {
  cy.visit('/');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-save"]').click();
  cy.get('[data-cy="QuickAccessDropdown"]').should('not.exist');
  cy.get('[data-cy="qat-save"]').should('not.exist');
});

it('can add element to QAT', () => {
  cy.visit('/');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-open"]').click();
  cy.get('[data-cy="qat-open"]');
});

it('initially QAT is inside topbar (above the ribbon) but it can be moved below the ribbon and then back above', () => {
  cy.visit('/');
  cy.get('[data-cy="TopBar"]').should('have.descendants', '[data-cy="QuickAccessToolbar"]');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-position"]').click();
  cy.get('[data-cy="TopBar"]').should('not.have.descendants', '[data-cy="QuickAccessToolbar"]');
  cy.get('[data-cy="QuickAccessToolbar"]');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-position"]').click();
  cy.get('[data-cy="TopBar"]').should('have.descendants', '[data-cy="QuickAccessToolbar"]');
});

it("QAT's state (visible buttons) is persisted when it is moved below above ribbon", () => {
  cy.visit('/');

  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-save"]').click();
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-open"]').click();

  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-position"]').click();

  cy.get('[data-cy="qat-save"]').should('not.exist');
  cy.get('[data-cy="qat-open"]');

  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-position"]').click();
});

it('can hide the ribbon, and then bring it back', () => {
  cy.visit('/');
  cy.get('[data-cy="Ribbon"]');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-ribbon"]').click();
  cy.get('[data-cy="Ribbon"]').should('not.exist');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-ribbon"]').click();
  cy.get('[data-cy="Ribbon"]');
});

it('QAT can be moved below the ribbon even when the ribbon is hidden', () => {
  cy.visit('/');

  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-ribbon"]').click();

  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-position"]').click();
  cy.get('[data-cy="TopBar"]').should('not.have.descendants', '[data-cy="QuickAccessToolbar"]');
  cy.get('[data-cy="QuickAccessToolbar"]');
});