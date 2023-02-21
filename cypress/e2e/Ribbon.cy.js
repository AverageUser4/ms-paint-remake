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

it('Clipboard', () => {
  cy.visit('/');

  cy.get(con.Clipboard).should('not.exist');
  cy.get(con.RibbonItemContainer_Clipboard).click();
  cy.get(con.Clipboard);
  cy.get(con.Clipboard_buttons);
  cy.get(con.Clipboard_Paste_Dropdown).should('not.exist');

  cy.get(con.BigButtonDuo_bottom_Paste).click();
  cy.get(con.Clipboard_Paste_Dropdown).click('topRight');
  cy.wait(1000);
  cy.get(con.Clipboard_Paste_Dropdown);

  cy.get(con.Clipboard).click('topRight');
  cy.get(con.Clipboard_Paste_Dropdown).should('not.exist');
  cy.get(con.Clipboard);
  cy.get(con.Clipboard_buttons);

  cy.get('body').click('topLeft');
  cy.get(con.Clipboard).should('not.exist');
});

it('Image', () => {
  cy.visit('/');

  cy.get(con.Image).should('not.exist');
  cy.get(con.RibbonItemContainer_Image).click();
  cy.get(con.Image);
  cy.get(con.Image_buttons);
  cy.get(con.Image_Select_Dropdown).should('not.exist');

  cy.get(con.BigButtonDuo_bottom_Select).click();
  cy.get(con.Image_Select_Dropdown).click('topRight');
  cy.wait(1000);
  cy.get(con.Image_Select_Dropdown);

  cy.get(con.Image).click('topRight');
  cy.get(con.Image_Select_Dropdown).should('not.exist');
  cy.get(con.Image);
  cy.get(con.Image_buttons);

  cy.get(con.Image_toggle_Rotate).click();
  cy.get(con.Image_Rotate_Dropdown).click('topRight');
  cy.wait(1000);
  cy.get(con.Image_Rotate_Dropdown);

  cy.get(con.Image).click('topRight');
  cy.get(con.Image_Rotate_Dropdown).should('not.exist');
  cy.get(con.Image);
  cy.get(con.Image_buttons);

  cy.get('body').click('topLeft');
  cy.get(con.Image).should('not.exist');
});

it('Tools', () => {
  cy.visit('/');

  cy.get(con.Tools).should('not.exist');
  cy.get(con.RibbonItemContainer_Tools).click();
  cy.get(con.Tools).click('topRight');
  cy.wait(1000);
  cy.get(con.Tools);

  cy.get('body').click('topLeft');
  cy.get(con.Tools).should('not.exist');
});

it('Brushes', () => {
  cy.visit('/');

  cy.get(con.Brushes_Dropdown).should('not.exist');
  cy.get(con.BigButtonDuo_bottom_Brushes).click();
  cy.get(con.Brushes_Dropdown).click('topRight');
  cy.wait(1000);
  cy.get(con.Brushes_Dropdown);

  cy.get('body').click('topLeft');
  cy.get(con.Brushes_Dropdown).should('not.exist');
});

it('Shapes', () => {
  cy.visit('/');

  cy.get(con.Shapes).should('not.exist');
  cy.get(con.RibbonItemContainer_Shapes).click();
  cy.get(con.Shapes);
  cy.get(con.Shapes_buttons);
  cy.get(con.ShapesGrid);

  cy.get(con.Shapes_Outline_Dropdown).should('not.exist');
  cy.get(con.Shapes_Fill_Dropdown).should('not.exist');
  cy.get(con.ShapesGrid_Dropdown).should('not.exist');

  cy.get(con.Shapes_toggle_Outline).click();
  cy.get(con.Shapes_Outline_Dropdown).click('topRight');
  cy.wait(1000);
  cy.get(con.Shapes_Outline_Dropdown);
  cy.get(con.RibbonItemExpanded_Shapes).click('topRight');
  cy.get(con.Shapes_Outline_Dropdown).should('not.exist');

  cy.get(con.Shapes_toggle_Fill).click();
  cy.get(con.Shapes_Fill_Dropdown).click('topRight');
  cy.wait(1000);
  cy.get(con.Shapes_Fill_Dropdown);
  cy.get(con.RibbonItemExpanded_Shapes).click('topRight');
  cy.get(con.Shapes_Fill_Dropdown).should('not.exist');

  cy.get(con.ShapesGrid_toggle_Dropdown).click();
  cy.get(con.ShapesGrid_Dropdown).click('topRight');
  cy.wait(1000);
  cy.get(con.ShapesGrid_Dropdown);
  cy.get(con.RibbonItemExpanded_Shapes).click('topRight');
  cy.get(con.ShapesGrid_Dropdown).should('not.exist');
});

it('Size', () => {
  cy.visit('/');

  cy.get(con.Size_Dropdown).should('not.exist');
  cy.get(con.BigButton_Size).click();
  cy.get(con.Size_Dropdown).click();
  cy.wait(1000);
  cy.get(con.Size_Dropdown);

  cy.get('body').click('topLeft');
  cy.get(con.Size_Dropdown).should('not.exist');
});

it('Colors', () => {
  cy.visit('/');

  cy.get(con.Colors).should('not.exist');
  cy.get(con.RibbonItemContainer_Colors).click();
  cy.get(con.Colors);
  cy.get(con.BigButton_Color_1);
  cy.get(con.BigButton_Color_2);
  cy.get(con.BigButton_Edit_Colors);
  cy.get(con.Colors_grid);

  cy.get('body').click('topLeft');
  cy.get(con.Colors).should('not.exist');
});