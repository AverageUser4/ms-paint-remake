import con from '../constants';

/* NOTE: these tests assume that initially PaintXPlatfor window is pretty small
   (all of its elements are not expanded) */

it('can be opened and closed (by clicking appropriate buttons, clicking outside of it does not close it)', () => {
  cy.visit('/');

  cy.get(con.PromptWindow).should('not.exist');
  cy.get(con.WindowControls_close).click();
  cy.get(con.PromptWindow);

  cy.get('body').click('topLeft');
  cy.wait(1000);
  cy.get(con.PromptWindow);

  cy.get(con.WindowControls_InnerWindow_close).click();
  cy.get(con.PromptWindow).should('not.exist');
});