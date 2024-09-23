import { EDfn, EInputNames } from "../../tests/util/enums";

/**
 * this is handle common two-way portal. <br>
 *
 * Theses tests are based on the Excel file.
 *
 * *** All T&C are accepted in the beforeEach ***
 *
 * *** There is no submit is because all submits are handled in test.AfterEach ***
 *
 *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
 *   1    |   y       |   n       |   n    |          |                |            |            |           |
 *   2    |   y       |   n       |   y    | test2    |                | Test1@#$%^ |            |           |
 *   3    |   y       |   n       |   y    |          |test@example.com| Test1@#$%^ |            |           |
 *   4    |   y       |   y       |        |  test2   |                | Test1@#$%^ |            |           |
 *   5    |   n       |   n       |   n    |          |                |            | test5      |  test5    |
 *   6    |   n       |   n       |   y    |          |test@example.com| Test1@#$%^ | test6      | test6     |
 *   7    |   n       |   y       |        |          |test@example.com| Test1@#$%^ | test7      | test7     |
 *   8    |   n       |   y       |        |  test2   |                | Test1@#$%^ | test7      | test7     |
 */
describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })

})

describe('Two Way Portal', () => {
  beforeEach(() => {
    cy.visit("https://plab08.i-sightlab.com/portal/reportonline")
    cy.get("#confirm").click();
  })
  it('do test 1 ', () => {
    // cy.visit('https://example.cypress.io');
    // cy.contains("hype"); // failed case
    // cy.contains("type").click();

    // assertion
    // cy.url().should("include", "/commands/actions");

    // input
    // cy.get(".action-email").type("fake@email.com");

    // verify input has value
    // cy.get(".action-email").should('have.value', 'fake@email.com' )

    // get by dfn
    // cy.get("[data-field-name='reportedAnonymously'] [value='yes'] ").click();
    checkDfn(EDfn.anon, true);
    checkDfn(EDfn.returning, false);
    checkDfn(EDfn.update, false);
  });

  it("test 2 ", () => {

    checkDfn(EDfn.anon, true);
    checkDfn(EDfn.returning, false);
    checkDfn(EDfn.update, true);
    // create with username 
    checkDfn(EDfn.provideEmail, false);

    const username = "test-user";
    const password = "Test1@#$%";
    usernamePwCreate(username, password);
  });
  /**
   * 
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   3    |   y       |   n       |   y    |          |test@example.com| Test1@#$%^ |            |           |
   */
  it("do test 3 ", () => {
    checkDfn(EDfn.anon, true);
    checkDfn(EDfn.returning, false);
    checkDfn(EDfn.update, true);

    // create with email 
    checkDfn(EDfn.provideEmail, true);
    const password = "Test1@#$%";
    fillEmailPw("test@emailemail.com", password);
  });

  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   4    |   y       |   y       |        |  test2   |                | Test1@#$%^ |            |           |
   */
  it("do test 4 ", () => {
    checkDfn(EDfn.anon, true);
    checkDfn(EDfn.returning, true);

    const password = "Test1@#$%";
    fillReturnUser("test@email.com", password);
    cy.get("button#login").click();
  });
  afterEach(() => {
    submit();
    // confirmSubmit();
  });
  it.only("do test 5", () => {

  })
});

function checkDfn(dfn: string, yesOrNo: boolean) {
  const choice = yesOrNo ? "yes" : "no";
  cy
    .get(`[data-field-name='${dfn}'] input[value='${choice}']`)
    .check();
}

function submit() {
  cy.get("button#submit").click();
}

function confirmSubmit() {
  cy.get("div.portal-submission-confirmation-modal-tmpl.bb-view.modal-tmpl  button#submit", { timeout: 10000 }).should("be.visible")
    .click();
}

function usernamePwCreate(username: string, password: string) {
  fillInput(EInputNames.username, username)
  fillInput(EInputNames.password, password)
  fillInput(EInputNames.confirmPassword, password)
}

function emailPwCreate(email: string, password: string) {

}

function fillReturnUser(username: string, password: string) {
  fillInput(EInputNames.returnUsername, username);
  fillInput("name='password'", password, 1);
}

function clickBtn(cssSelector:string) {

}

function fillEmailPw(email: string, password: string) {
  cy.get(`input[${EInputNames.idEmailWild}]`).eq(1).type(email).type("{enter}").type("{esc}")
  fillInput(EInputNames.password, password);
  fillInput(EInputNames.confirmPassword, password);
}

function fillInput(cssSelector: string, value: string, index = 0) {
  cy.get(`input[${cssSelector}]`)
    .eq(index)
    .type(value);
}