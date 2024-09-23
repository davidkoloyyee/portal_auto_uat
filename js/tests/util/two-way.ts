import { Page } from "@playwright/test";
import { EDfn } from "./enums";
import {
  checkByDfn,
  checkByDfnByValue,
  emailPwCreate,
  fillEmailPW,
  fillFirstLastName,
  fillReturnUser,
  usernamePwCreate
} from "./portal";
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
export default class TwoWayPortal {
  #page: Page;
  #url: string;
  #username: string;
  #password: string;
  #email: string;

  /**
   * @param {import("@playwright/test").Page} page
   * @param {String} url
   */
  constructor(page, url) {
    this.#page = page;
    this.#url = url;

    const rand = Math.floor(Math.random() * 1000);
    this.#email = `test${rand}@email.com`;

    const route = new URL(this.#url);
    let testerName =
      route.hostname.split(".")[0] + "test" + Math.floor(Math.random() * 1000);
    testerName.replace("@", "");
    this.#username = testerName;

    this.#password = "Test1@#$%^";
  }

  /**
   *
   *  test  | anonymous | returning | update | username | email          | password  | first name | last name |
   *   1    |   y       |   n       |   n    |          |                |           |            |           |
   */
  async test1() {
    await checkByDfn(this.#page, EDfn.anon, true);
    await checkByDfn(this.#page, EDfn.returning, false);

    const provideEmail = await this.#page.locator(`div[data-field-name='${EDfn.provideEmail}']`);
    await provideEmail.click();
    const provideEmailExists = await provideEmail.isVisible();
    console.log(provideEmailExists);
    if (provideEmailExists) {
      await checkByDfnByValue(this.#page, EDfn.provideEmail, "No User Create")
    } else {
      await checkByDfn(this.#page, EDfn.update, false);
    }
  }


  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   2    |   y       |   n       |   y    | test2    |                | Test1@#$%^ |            |           |
   */
  async test2() {
    // this.#page = await handleTC(this.#page, this.#url);
    await checkByDfn(this.#page, EDfn.anon, true);
    await checkByDfn(this.#page, EDfn.returning, false);
    await checkByDfn(this.#page, EDfn.update, true);
    // select create with username
    await checkByDfn(this.#page, EDfn.provideEmail, false);

    await usernamePwCreate(this.#page, this.#username, this.#password);
  }
  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   3    |   y       |   n       |   y    |          |test@example.com| Test1@#$%^ |            |           |
   */
  async test3() {
    await checkByDfn(this.#page, EDfn.anon, true);
    await checkByDfn(this.#page, EDfn.returning, false);
    // create with email and password
    await checkByDfn(this.#page, EDfn.update, true);
    await emailPwCreate(
      this.#page,
      EDfn.provideEmail,
      this.#email,
      this.#password
    );
  }

  /**
   * TODO: NOT DONE YET because of the fail to login.
   * 
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   4    |   y       |   y       |        |  test2   |                | Test1@#$%^ |            |           |
   */
  async test4() {
    await checkByDfn(this.#page, EDfn.anon, true);
    await checkByDfn(this.#page, EDfn.returning, true);
    await fillReturnUser({
      page: this.#page,
      dnf: EDfn.loginUsernameEmail,
      username: this.#username,
      password: this.#password
    }
    );

    // sign in
    await this.#page.locator("button#login").click();
    await this.#page.waitForSelector("p[id='login-success']");
  }

  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   5    |   n       |   n       |   n    |          |                |            | test5      |  test5    |
   */
  async test5() {
    await checkByDfn(this.#page, EDfn.anon, false);
    await checkByDfn(this.#page, EDfn.returning, false);
    await checkByDfn(this.#page, EDfn.update, false);
    await fillFirstLastName({ page: this.#page, firstName: this.#username, lastName: this.#username });

  }

  /**
   * 
   * | test  | anonymous | returning | update | username | email          | password   | first name | last name |
   * | 6     |   n       |   n       |   y    |          |test@example.com| Test1@#$%^ | test6      | test6     |
   */
  async test6() {
    await checkByDfn(this.#page, EDfn.anon, false);
    await checkByDfn(this.#page, EDfn.returning, false);
    await checkByDfn(this.#page, EDfn.update, true);

    await fillFirstLastName({ page: this.#page, firstName: this.#username, lastName: this.#username });
    await fillEmailPW(this.#page, this.#email, this.#password);
  }
}
