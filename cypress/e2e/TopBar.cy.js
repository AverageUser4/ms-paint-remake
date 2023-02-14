it('passes', () => {
  cy.visit('http://localhost:3000/');

  // standard QAT elements are in DOM
  cy.get('[data-cy="qat-save"]');
  cy.get('[data-cy="qat-undo"]');
  cy.get('[data-cy="qat-redo"]');
  cy.get('[data-cy="qat-open"]').should('not.exist');

  // QAD is not open by default and can be opened and closed
  cy.get('[data-cy="QuickAccessDropdown"]').should('not.be.visible');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="QuickAccessDropdown"]').should('be.visible');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="QuickAccessDropdown"]').should('not.be.visible');
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="QuickAccessDropdown"]').should('be.visible');
  cy.get('body').click(0, 0);
  cy.get('[data-cy="QuickAccessDropdown"]').should('not.be.visible');

  // can remove element from QAT, and QAD gets closed after clicking button
  // that removes the element
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-save"]').click();
  cy.get('[data-cy="QuickAccessDropdown"]').should('not.be.visible');
  cy.get('[data-cy="qat-save"]').should('not.exist');

  // can add element to QAT
  cy.get('[data-cy="qat-open-qad"]').click();
  cy.get('[data-cy="qad-toggle-open"]').click();
  cy.get('[data-cy="qat-open"]');

  // cy.get('[data-cy="qad-toggle-open"]').click();

  // cy.get('[data-cy="qat-save"]').should('not.exist');
  // cy.get('[data-cy="qat-open"]');


});