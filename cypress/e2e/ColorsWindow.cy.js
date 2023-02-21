import con from '../constants';

/* NOTE: these tests assume that initially PaintXPlatfor window is pretty small
   (all of its elements are not expanded) */

it('can be opened and closed (by clicking appropriate buttons, clicking outside of it does not close it)', () => {
  cy.visit('/');

  cy.get(con.ColorsWindow).should('not.exist');

  cy.get(con.RibbonItemContainer_Colors).click();
  cy.get(con.BigButton_Edit_Colors).click();
  cy.get(con.ColorsWindow);

  cy.get('body').click('topLeft');
  cy.wait(1000);
  cy.get(con.ColorsWindow);

  cy.get(con.WindowControls_InnerWindow_close).click();
  cy.get(con.ColorsWindow).should('not.exist');

  cy.get(con.RibbonItemContainer_Colors).click();
  cy.get(con.BigButton_Edit_Colors).click();
  cy.get(con.ColorsWindow);
  cy.get(con.ColorsWindow_cancel).click();
  cy.get(con.ColorsWindow).should('not.exist');

  cy.get(con.RibbonItemContainer_Colors).click();
  cy.get(con.BigButton_Edit_Colors).click();
  cy.get(con.ColorsWindow);
  cy.get(con.ColorsWindow_confirm).click();
  cy.get(con.ColorsWindow).should('not.exist');
});

it('interacting with form elements works as expected', () => {
  cy.visit('/');

  cy.get(con.RibbonItemContainer_Colors).click();
  cy.get(con.BigButton_Edit_Colors).click();

  cy.get(con.ColorPicker_bar).click(0, 0);
  cy.get(con.ColorPicker_field).click(0, 0);

  cy.get(con.ColorPicker_input_h).its('value').then(parseFloat).should('be.within', 5, 10);
});