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

it('hovering over one of the expandable buttons opens appropriate dropdown, hovering out of the button closes the dropdown', () => {
  cy.visit('/');

  cy.get(con.RibbonControls_toggle_FileDropdown).click();
  cy.get(con.FileDropdownMore_Dropdown_any).should('not.exist');
  cy.get(con.FileDropdown_duo_save).trigger('mouseenter');
  cy.get(con.FileDropdownMore_Dropdown_save);
});