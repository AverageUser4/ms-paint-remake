import con from '../constants';

it('Ribbon is initially in DOM, but can be removed after clicking toggle button and then brought back after clicking it again', () => {
  cy.visit('/');

  cy.get(con.Ribbon);
  cy.get(con.RibbonControls_toggle_Ribbon).click();
  cy.get(con.Ribbon).should('not.exist');
  cy.get(con.RibbonControls_toggle_Ribbon).click();
  cy.get(con.Ribbon);
  cy.wait(1000);
  cy.get('body').click('topLeft');
  cy.get(con.Ribbon);
});

it('when Ribbon is in hidden state clicking any of buttons that set active ribbon tab brings it back, it only gets removed again when user clicks outside the Ribbon', () => {
  cy.visit('/');

  cy.get(con.RibbonControls_toggle_Ribbon).click();
  cy.get(con.RibbonControls_setTab_home).click();
  cy.get(con.Ribbon).click('topLeft');
  cy.get(con.RibbonControls_setTab_home).click();
  cy.wait(1000);
  cy.get(con.Ribbon);
  cy.get(con.RibbonControls_setTab_view).click();
  cy.get(con.Ribbon);
  cy.get('body').click('topLeft');
  cy.get(con.Ribbon).should('not.exist');
});