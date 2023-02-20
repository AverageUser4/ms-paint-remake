import con from '../constants';

/* NOTE: these tests assume that initially PaintXPlatfor window is pretty small
   (all of its elements are not expanded) */

it('all expected items are inside the Ribbon, changing Ribbon tab changes shown items', () => {
  cy.visit('/');

  cy.get(con.Ribbon);

  cy.get(con.RibbonItemContainer_Clipboard);
  cy.get(con.RibbonItemContainer_Image);
  cy.get(con.RibbonItemContainer_Tools);
  cy.get(con.BigButtonDuo_Brushes);
  cy.get(con.RibbonItemContainer_Shapes);
  cy.get(con.BigButton_Size);
  cy.get(con.RibbonItemContainer_Colors);
  cy.get(con.RibbonItemExpanded_Zoom).should('not.exist');
  cy.get(con.RibbonItemExpanded_ShowOrHide).should('not.exist');
  cy.get(con.RibbonItemExpanded_Display).should('not.exist');

  cy.get(con.RibbonControls_setTab_view).click();

  cy.get(con.RibbonItemContainer_Clipboard).should('not.exist');
  cy.get(con.RibbonItemContainer_Image).should('not.exist');
  cy.get(con.RibbonItemContainer_Tools).should('not.exist');
  cy.get(con.BigButtonDuo_Brushes).should('not.exist');
  cy.get(con.RibbonItemContainer_Shapes).should('not.exist');
  cy.get(con.BigButton_Size).should('not.exist');
  cy.get(con.RibbonItemContainer_Colors).should('not.exist');
  cy.get(con.RibbonItemExpanded_Zoom);
  cy.get(con.RibbonItemExpanded_ShowOrHide);
  cy.get(con.RibbonItemExpanded_Display);
});