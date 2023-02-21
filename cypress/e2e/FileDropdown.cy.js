import con from '../constants';

it('FileDropdown is not open by default and can be opened and closed', () => {
  cy.visit('/');
  cy.get(con.FileDropdown).should('not.exist');
  cy.get(con.RibbonControls_toggle_FileDropdown).click();
  cy.get(con.FileDropdown);
  cy.get(con.FileDropdown_close).click();
  cy.get(con.FileDropdown).should('not.exist');
  cy.get(con.RibbonControls_toggle_FileDropdown).click();
  cy.get(con.FileDropdown);
  cy.get('body').click(0, 0);
  cy.get(con.FileDropdown).should('not.exist');
});

it('FileDropdown more is in DOM after opening FileDropdown', () => {
  cy.visit('/');
  cy.get(con.RibbonControls_toggle_FileDropdown).click();
  cy.get(con.FileDropdownMore);
});

it('clicking any of the arrow buttons opens appropriate dropdown', () => {
  cy.visit('/');
  cy.get(con.RibbonControls_toggle_FileDropdown).click();
  cy.get(con.FileDropdownMore_Dropdown_any).should('not.exist');

  cy.get(con.FileDropdown_duo_arrow_save).click();
  cy.get(con.FileDropdownMore_Dropdown_save);
  // clicking is not necessary but it moves mouse from the button so dropdown can disappear
  cy.get(con.FileDropdown).click('topRight');
  cy.get(con.FileDropdownMore_Dropdown_save).should('not.exist');

  cy.get(con.FileDropdown_duo_arrow_print).click();
  cy.get(con.FileDropdownMore_Dropdown_print);
  cy.get(con.FileDropdown).click('topRight');
  cy.get(con.FileDropdownMore_Dropdown_print).should('not.exist');

  cy.get(con.FileDropdown_duo_arrow_set).click();
  cy.get(con.FileDropdownMore_Dropdown_set);
  cy.get(con.FileDropdown).click('topRight');
  cy.get(con.FileDropdownMore_Dropdown_set).should('not.exist');
});

it('active dropdown can be changed when it is open', () => {
  cy.visit('/');
  cy.get(con.RibbonControls_toggle_FileDropdown).click();
  cy.get(con.FileDropdownMore_Dropdown_any).should('not.exist');

  cy.get(con.FileDropdown_duo_arrow_save).click();
  cy.get(con.FileDropdownMore_Dropdown_save);

  cy.get(con.FileDropdown_duo_arrow_print).click();
  cy.get(con.FileDropdownMore_Dropdown_print);
  cy.get(con.FileDropdownMore_Dropdown_save).should('not.exist');

  cy.get(con.FileDropdown).click('topRight');
  cy.get(con.FileDropdownMore_Dropdown_print).should('not.exist');
});

it('after opening dropdown it does not disappear on its own', () => {
  cy.visit('/');
  cy.get(con.RibbonControls_toggle_FileDropdown).click();
  cy.get(con.FileDropdown_duo_arrow_print).click();
  cy.get(con.FileDropdownMore_Dropdown_print);
  cy.wait(1000);
  cy.get(con.FileDropdownMore_Dropdown_print).click('bottom');
  cy.wait(1000);
  cy.get(con.FileDropdownMore_Dropdown_print);
  cy.get(con.FileDropdown).click('topRight');
  cy.get(con.FileDropdownMore_Dropdown_print).should('not.exist');
});