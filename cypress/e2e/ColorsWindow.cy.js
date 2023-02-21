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

it('interacting with color field and bar works as expected', () => {
  /* this garbage test can be broken by moving mouse */
  cy.visit('/');

  cy.get(con.RibbonItemContainer_Colors).click();
  cy.get(con.BigButton_Edit_Colors).click();

  cy.get(con.ColorPicker_bar).click(0, 0);
  cy.get(con.ColorPicker_bar).trigger('pointerup');
  cy.get(con.ColorPicker_field).click(0, 0);
  cy.get(con.ColorPicker_field).trigger('pointerup');

  cy.get(con.ColorPicker_input_h).should(el => expect(parseInt(el[0].value)).to.be.within(0, 4));
  cy.get(con.ColorPicker_input_s).should(el => expect(parseInt(el[0].value)).to.be.within(96, 100));
  cy.get(con.ColorPicker_input_l).should(el => expect(parseInt(el[0].value)).to.be.within(96, 100));
  cy.get(con.ColorPicker_input_r).should(el => expect(parseInt(el[0].value)).to.be.within(251, 255));
  cy.get(con.ColorPicker_input_g).should(el => expect(parseInt(el[0].value)).to.be.within(251, 255));
  cy.get(con.ColorPicker_input_b).should(el => expect(parseInt(el[0].value)).to.be.within(251, 255));

  cy.get(con.ColorPicker_bar).click(0, 30);
  cy.get(con.ColorPicker_bar).trigger('pointerup');
  cy.get(con.ColorPicker_field).click(100, 130);
  cy.get(con.ColorPicker_field).trigger('pointerup');

  cy.get(con.ColorPicker_input_h).should(el => expect(parseInt(el[0].value)).to.be.within(203, 207));
  cy.get(con.ColorPicker_input_s).should(el => expect(parseInt(el[0].value)).to.be.within(29, 33));
  cy.get(con.ColorPicker_input_l).should(el => expect(parseInt(el[0].value)).to.be.within(82, 86));
  cy.get(con.ColorPicker_input_r).should(el => expect(parseInt(el[0].value)).to.be.within(200, 204));
  cy.get(con.ColorPicker_input_g).should(el => expect(parseInt(el[0].value)).to.be.within(164, 168));
  cy.get(con.ColorPicker_input_b).should(el => expect(parseInt(el[0].value)).to.be.within(225, 229));
});

it('interacting with form elements works as expected', () => {
  cy.visit('/');

  cy.get(con.RibbonItemContainer_Colors).click();
  cy.get(con.BigButton_Edit_Colors).click();

  cy.get(con.ColorPicker_input_h).clear();
  cy.get(con.ColorPicker_input_s).clear();
  cy.get(con.ColorPicker_input_l).clear();
  
  cy.get(con.ColorPicker_input_h).should('have.value', '0');
  cy.get(con.ColorPicker_input_s).should('have.value', '0');
  cy.get(con.ColorPicker_input_l).should('have.value', '0');
  cy.get(con.ColorPicker_input_r).should('have.value', '0');
  cy.get(con.ColorPicker_input_g).should('have.value', '0');
  cy.get(con.ColorPicker_input_b).should('have.value', '0');

  cy.get(con.ColorPicker_input_h).type('44');
  cy.get(con.ColorPicker_input_s).type('66');
  cy.get(con.ColorPicker_input_l).type('55');

  cy.get(con.ColorPicker_input_h).should('have.value', '44');
  cy.get(con.ColorPicker_input_s).should('have.value', '66');
  cy.get(con.ColorPicker_input_l).should('have.value', '55');
  cy.get(con.ColorPicker_input_r).should('have.value', '216');
  cy.get(con.ColorPicker_input_g).should('have.value', '47');
  cy.get(con.ColorPicker_input_b).should('have.value', '65');

  cy.get(con.ColorPicker_input_h).type('1');
  cy.get(con.ColorPicker_input_s).type('1');
  cy.get(con.ColorPicker_input_l).type('1');

  cy.get(con.ColorPicker_input_h).should('have.value', '359');
  cy.get(con.ColorPicker_input_s).should('have.value', '100');
  cy.get(con.ColorPicker_input_l).should('have.value', '100');
  cy.get(con.ColorPicker_input_r).should('have.value', '255');
  cy.get(con.ColorPicker_input_g).should('have.value', '255');
  cy.get(con.ColorPicker_input_b).should('have.value', '255');

  cy.get(con.ColorPicker_input_r).clear();
  cy.get(con.ColorPicker_input_g).clear();
  cy.get(con.ColorPicker_input_b).clear();
    
  cy.get(con.ColorPicker_input_h).should('have.value', '0');
  cy.get(con.ColorPicker_input_s).should('have.value', '0');
  cy.get(con.ColorPicker_input_l).should('have.value', '0');
  cy.get(con.ColorPicker_input_r).should('have.value', '0');
  cy.get(con.ColorPicker_input_g).should('have.value', '0');
  cy.get(con.ColorPicker_input_b).should('have.value', '0');

  cy.get(con.ColorPicker_input_r).type('127');
  cy.get(con.ColorPicker_input_g).type('13');
  cy.get(con.ColorPicker_input_b).type('99');

  cy.get(con.ColorPicker_input_h).should('have.value', '315');
  cy.get(con.ColorPicker_input_s).should('have.value', '81');
  cy.get(con.ColorPicker_input_l).should('have.value', '27');
  cy.get(con.ColorPicker_input_r).should('have.value', '127');
  cy.get(con.ColorPicker_input_g).should('have.value', '13');
  cy.get(con.ColorPicker_input_b).should('have.value', '99');
});