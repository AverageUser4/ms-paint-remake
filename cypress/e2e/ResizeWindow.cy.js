import con from '../constants';

/* NOTE: these tests assume that initially PaintXPlatfor window is pretty small
   (all of its elements are not expanded) */

it('can be opened and closed (by clicking appropriate buttons, clicking outside of it does not close it)', () => {
  cy.visit('/');

  cy.get(con.ResizeWindow).should('not.exist');
  cy.get(con.RibbonItemContainer_Image).click();
  cy.get(con.Image_open_ResizeWindow).click();
  cy.get(con.ResizeWindow);
});

// it('interacting with form elements works as expected', () => {

// });