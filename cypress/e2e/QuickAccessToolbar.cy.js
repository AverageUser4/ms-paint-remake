import con from '../constants';

it('only expected QAT elements are in DOM', () => {
  cy.visit('/');
  cy.get(con.QAT_el_save);
  cy.get(con.QAT_el_undo);
  cy.get(con.QAT_el_redo);
  cy.get(con.QAT_el_open).should('not.exist');
  cy.get(con.QAT_el_email).should('not.exist');
  cy.get(con.QAT_el_newFile).should('not.exist');
  cy.get(con.QAT_el_print).should('not.exist');
  cy.get(con.QAT_el_printPreview).should('not.exist');
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
  cy.get(con.QAD_toggle_el_save).click();
  cy.get(con.QuickAccessDropdown).should('not.exist');
  cy.get(con.QAT_el_save).should('not.exist');
});

it('can add element to QAT', () => {
  cy.visit('/');
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_el_open).click();
  cy.get(con.QAT_el_open);
});

it('all elements can be added and removed', () => {
  function openAndClick(element) {
    cy.get(con.QAT_toggle_QAD).click();
    cy.get(element).click();
  }

  function clickThem(isAll = false) {
    openAndClick(con.QAD_toggle_el_save);
    openAndClick(con.QAD_toggle_el_undo);
    openAndClick(con.QAD_toggle_el_redo);
    if(isAll) {
      openAndClick(con.QAD_toggle_el_open);
      openAndClick(con.QAD_toggle_el_email);
      openAndClick(con.QAD_toggle_el_newFile);
      openAndClick(con.QAD_toggle_el_print);
      openAndClick(con.QAD_toggle_el_printPreview);
    }
  }

  function assertExistance(isExist = false) {
    cy.get(con.QAT_el_save).should(`${!isExist ? 'not.' : ''}exist`);
    cy.get(con.QAT_el_undo).should(`${!isExist ? 'not.' : ''}exist`);
    cy.get(con.QAT_el_redo).should(`${!isExist ? 'not.' : ''}exist`);
    cy.get(con.QAT_el_open).should(`${!isExist ? 'not.' : ''}exist`);
    cy.get(con.QAT_el_email).should(`${!isExist ? 'not.' : ''}exist`);
    cy.get(con.QAT_el_newFile).should(`${!isExist ? 'not.' : ''}exist`);
    cy.get(con.QAT_el_print).should(`${!isExist ? 'not.' : ''}exist`);
    cy.get(con.QAT_el_printPreview).should(`${!isExist ? 'not.' : ''}exist`);  
  }
  
  cy.visit('/');
  clickThem();
  assertExistance(false);
  clickThem(true);
  assertExistance(true);
  clickThem(true);
  assertExistance(false);
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
  cy.get(con.QAD_toggle_el_save).click();
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_el_open).click();

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
  cy.get(con.QAD_toggle_Ribbon).click();
  cy.get(con.Ribbon).should('not.exist');
  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_Ribbon).click();
  cy.get(con.Ribbon);
});

it('QAT can be moved below the ribbon even when the ribbon is hidden', () => {
  cy.visit('/');

  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_Ribbon).click();

  cy.get(con.QAT_toggle_QAD).click();
  cy.get(con.QAD_toggle_position).click();
  cy.get(con.TopBar).should('not.have.descendants', con.QuickAccessToolbar);
  cy.get(con.QuickAccessToolbar);
});