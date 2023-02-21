import con from '../constants';

/* NOTE: these tests assume that initially PaintXPlatfor window is pretty small
   (all of its elements are not expanded) */

it('can be opened and closed (by clicking appropriate buttons, clicking outside of it does not close it)', () => {
  cy.visit('/');

  cy.get(con.ResizeWindow).should('not.exist');

  cy.get(con.RibbonItemContainer_Image).click();
  cy.get(con.Image_open_ResizeWindow).click();
  cy.get(con.ResizeWindow);

  cy.get('body').click('topLeft');
  cy.wait(1000);
  cy.get(con.ResizeWindow);

  cy.get(con.WindowControls_InnerWindow_close).click();
  cy.get(con.ResizeWindow).should('not.exist');

  cy.get(con.RibbonItemContainer_Image).click();
  cy.get(con.Image_open_ResizeWindow).click();
  cy.get(con.ResizeWindow);
  cy.get(con.ResizeWindow_cancel).click();
  cy.get(con.ResizeWindow).should('not.exist');

  cy.get(con.RibbonItemContainer_Image).click();
  cy.get(con.Image_open_ResizeWindow).click();
  cy.get(con.ResizeWindow);
  cy.get(con.ResizeWindow_confirm).click();
  cy.get(con.ResizeWindow).should('not.exist');
});

it('interacting with form elements works as expected', () => {
  cy.visit('/');

  cy.get(con.RibbonItemContainer_Image).click();
  cy.get(con.Image_open_ResizeWindow).click();

  cy.get(con.ResizeWindow_radio_percentage).click();
  cy.get(con.ResizeWindow_radio_percentage).should('be.checked');
  cy.get(con.ResizeWindow_radio_pixels).should('not.be.checked');

  cy.get(con.ResizeWindow_radio_pixels).click();
  cy.get(con.ResizeWindow_radio_pixels).should('be.checked');
  cy.get(con.ResizeWindow_radio_percentage).should('not.be.checked');

  cy.get(con.ResizeWindow_checkbox_maintain).should('be.checked');
  cy.get(con.ResizeWindow_checkbox_maintain).click();
  cy.get(con.ResizeWindow_checkbox_maintain).should('not.be.checked');
  cy.get(con.ResizeWindow_checkbox_maintain).click();
  cy.get(con.ResizeWindow_checkbox_maintain).should('be.checked');

  /* TODO: add tests that check that you cannot input invalid values */
  
  cy.get(con.ResizeWindow_input_resize_horizontal).type('123');
  cy.get(con.ResizeWindow_input_resize_horizontal).should('have.value', '123');
  cy.get(con.ResizeWindow_input_resize_vertical).type('123');
  cy.get(con.ResizeWindow_input_resize_vertical).should('have.value', '123');
  cy.get(con.ResizeWindow_input_skew_horizontal).type('123');
  cy.get(con.ResizeWindow_input_skew_horizontal).should('have.value', '123');
  cy.get(con.ResizeWindow_input_skew_vertical).type('123');
  cy.get(con.ResizeWindow_input_skew_vertical).should('have.value', '123');
});