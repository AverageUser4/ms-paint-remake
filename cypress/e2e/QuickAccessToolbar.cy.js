import con from '../constants';

it('standard QAT elements are in DOM', () => {
  cy.visit('/');
  cy.get(con.QAT_el_save);
  cy.get(con.QAT_el_undo);
  cy.get(con.QAT_el_redo);
  cy.get(con.QAT_el_open).should('not.exist');
});

it('QAD is not open by default and can be opened and closed', () => {
  cy.visit('/');
  cy.get(con.QuickAccessDropdown).should('not.exist');
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QuickAccessDropdown);
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QuickAccessDropdown).should('not.exist');
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QuickAccessDropdown);
  cy.get('body').click(0, 0);
  cy.get(con.QuickAccessDropdown).should('not.exist');
});

it('can remove element from QAT, and QAD gets closed after clicking button that removes the element', () => {
  cy.visit('/');
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_save).click();
  cy.get(con.QuickAccessDropdown).should('not.exist');
  cy.get(con.QAT_el_save).should('not.exist');
});

it('can add element to QAT', () => {
  cy.visit('/');
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_open).click();
  cy.get(con.QAT_el_open);
});

it('initially QAT is inside topbar (above the ribbon) but it can be moved below the ribbon and then back above', () => {
  cy.visit('/');
  cy.get(con.TopBar).should('have.descendants', con.QuickAccessToolbar);
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_position).click();
  cy.get(con.TopBar).should('not.have.descendants', con.QuickAccessToolbar);
  cy.get(con.QuickAccessToolbar);
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_position).click();
  cy.get(con.TopBar).should('have.descendants', con.QuickAccessToolbar);
});

it("QAT's state (visible buttons) is persisted when it is moved below above ribbon", () => {
  cy.visit('/');

  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_save).click();
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_open).click();

  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_position).click();

  cy.get(con.QAT_el_save).should('not.exist');
  cy.get(con.QAT_el_open);

  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_position).click();
});

it('can hide the ribbon, and then bring it back', () => {
  cy.visit('/');
  cy.get(con.Ribbon);
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_ribbon).click();
  cy.get(con.Ribbon).should('not.exist');
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_ribbon).click();
  cy.get(con.Ribbon);
});

it('QAT can be moved below the ribbon even when the ribbon is hidden', () => {
  cy.visit('/');

  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_ribbon).click();

  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_position).click();
  cy.get(con.TopBar).should('not.have.descendants', con.QuickAccessToolbar);
  cy.get(con.QuickAccessToolbar);
});