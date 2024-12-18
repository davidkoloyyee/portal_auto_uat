import { Page } from "@playwright/test";
import {
  checkRadioByDfn,
  checkRadioByDfnByValue,
  emailPwCreate,
  fillEmailPW,
  fillFirstLastName,
  fillReturnUser,
  handleSubmit,
  usernamePwCreate
} from "./core-fn";
import { EDfn } from "./enums";
import { fillAllSelectRand, fillInputFake, fillTextboxFake } from "./internal/fillers";
import { handleTC } from "./portal/core-fn";
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
 *   2    |   y       |   n       |   y    | test2    |                | Test1@$%^ |            |           |
 *   3    |   y       |   n       |   y    |          |test@example.com| Test1@$%^ |            |           |
 *   4    |   y       |   y       |        |  test2   |                | Test1@$%^ |            |           |
 *   5    |   n       |   n       |   n    |          |                |            | test5      |  test5    |
 *   6    |   n       |   n       |   y    |          |test@example.com| Test1@$%^ | test6      | test6     |
 *   7    |   n       |   y       |        |          |test@example.com| Test1@$%^ | test7      | test7     |
 *   8    |   n       |   y       |        |  test2   |                | Test1@$%^ | test7      | test7     |
 */

/**
 * @param {import("@playwright/test").Page} page
 * @param {String} url
 */
export function TwoWayFn(url: string) {

  const rand = Math.floor(Math.random() * 1000);
  let email = `test${rand}@email.com`;

  const route = new URL(url);
  let testerName =
    route.hostname.split(".")[0] + "test" + Math.floor(Math.random() * 1000);
  testerName.replace("@", "");
  let username = testerName;

  let password = "Test1@$%^";

  /**
   *
   *  test  | anonymous | returning | update | username | email          | password  | first name | last name |
   *   1    |   y       |   n       |   n    |          |                |           |            |           |
   */
  async function test1(page: Page) {
    await checkRadioByDfn(page, EDfn.anon, true);
    await checkRadioByDfn(page, EDfn.returning, false);

    const provideEmail = await page.locator(`div[data-field-name='${EDfn.provideEmail}']`);
    // await provideEmail.click();
    const provideEmailExists = await provideEmail.isVisible();
    console.log(provideEmailExists);
    if (provideEmailExists) {
      await checkRadioByDfnByValue(page, EDfn.provideEmail, "No User Create")
    } else {
      await checkRadioByDfn(page, EDfn.update, false);
    }
  }


  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   2    |   y       |   n       |   y    | test2    |                | Test1@$%^ |            |           |
   */
  async function test2(page: Page) {
    // page = await handleTC(page, url);
    await checkRadioByDfn(page, EDfn.anon, true);
    await checkRadioByDfn(page, EDfn.returning, false);
    await checkRadioByDfn(page, EDfn.update, true);
    // select create with username
    await checkRadioByDfn(page, EDfn.provideEmail, false);

    await usernamePwCreate(page, username, password);
  }
  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   3    |   y       |   n       |   y    |          |test@example.com| Test1@$%^ |            |           |
   */
  async function test3(page: Page) {
    await checkRadioByDfn(page, EDfn.anon, true);
    await checkRadioByDfn(page, EDfn.returning, false);
    // create with email and password
    await checkRadioByDfn(page, EDfn.update, true);
    await emailPwCreate(
      page,
      EDfn.provideEmail,
      email,
      password
    );
  }

  /**
   * TODO: NOT DONE YET because of the fail to login.
   * 
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   4    |   y       |   y       |        |  test2   |                | Test1@$%^ |            |           |
   */
  async function test4(page: Page) {
    await checkRadioByDfn(page, EDfn.anon, true);
    await checkRadioByDfn(page, EDfn.returning, true);
    await fillReturnUser(
      page,
      {
        dnf: EDfn.loginUsernameEmail,
        username: username,
        password: password
      }
    );

    // sign in
    await page.locator("buttonlogin").click();
    await page.waitForSelector("p[id='login-success']");
  }

  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   5    |   n       |   n       |   n    |          |                |            | test5      |  test5    |
   */
  async function test5(page: Page) {
    await checkRadioByDfn(page, EDfn.anon, false);
    await checkRadioByDfn(page, EDfn.returning, false);
    await checkRadioByDfn(page, EDfn.update, false);
    await fillFirstLastName(page, { firstName: username, lastName: username });

  }

  /**
   * 
   * | test  | anonymous | returning | update | username | email          | password   | first name | last name |
   * | 6     |   n       |   n       |   y    |          |test@example.com| Test1@$%^ | test6      | test6     |
   */
  async function test6(page: Page) {
    await checkRadioByDfn(page, EDfn.anon, false);
    await checkRadioByDfn(page, EDfn.returning, false);
    await checkRadioByDfn(page, EDfn.update, true);

    await fillFirstLastName(page, { firstName: username, lastName: username });
    await fillEmailPW(page, email, password);
  }


  return {
    test1, test2, test3, test4, test5, test6
  }
}

export class TwoWayPortal {
  #page: Page;
  #url: string;
  #username: string;
  #password: string;
  #email: string;

  /**
   * @param {import("@playwright/test").Page} page
   * @param {String} url
   */
  constructor(page: Page, url: string) {
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

  async pretest() {
    if (this.#url.includes("reportonline")) {
      this.#url = this.#url.replace("/reportonline", "");
    }
    // added special required fields here.
    await handleTC(this.#page, this.#url);

    if (await this.#page.getByRole("textbox").first().isVisible()) {
    await fillTextboxFake(this.#page, this.#url);
    }
    // for (let tb of await this.#page.getByRole("textbox").all()) {
    //   await tb.fill(new Date() + " " + this.#url);
    // }

    // for (const select of await this.#page.locator("select").all()) {
    //   if (await select.isVisible()) {
    //     select.selectOption({ index: 1 })
    //   }
    // }
    if (await this.#page.locator("select").first().isVisible()) {
      await fillAllSelectRand(this.#page);
    }
    // for (const select of await this.#page.locator("select").all()) {
    //   console.log(await select.allInnerTexts());
    //   // while ((await select.inputValue()) === "") {
    //   const options = await select.locator("option").all();
    //   let rand = Math.floor(Math.random() * (options.length - 1)) + 1;
    //   await select.selectOption({ index: rand });
    //   // }
    // }



    if (await this.#page.locator("input[type='text']").first().isVisible()) {
      await fillInputFake(this.#page, this.#url);
    }
    // for (const textInput of await this.#page.locator("input[type='text']").all()) {
    //   if (await textInput.isVisible()) {
    //     textInput.fill(new Date() + " " + this.#url)
    //   }
    // }

    for (const select of await this.#page.locator("dialog").all()) {
      console.log("I shouldn't see this. ")
      if (await select.isVisible()) {
        select.selectOption({ index: 1 })
      }
    }
    // addParty(this.#page);
    // addFile(this.#page);
  }

  /**
   *
   *  test  | anonymous | returning | update | username | email          | password  | first name | last name |
   *   1    |   y       |   n       |   n    |          |                |           |            |           |
   */
  async test1() {
    await checkRadioByDfn(this.#page, EDfn.anon, true);
    await checkRadioByDfn(this.#page, EDfn.returning, false);

    const provideEmail = await this.#page.locator(`div[data-field-name='${EDfn.provideEmail}']`);
    // await provideEmail.click();
    const provideEmailExists = await provideEmail.isVisible();
    console.log(provideEmailExists);
    if (provideEmailExists) {
      await checkRadioByDfnByValue(this.#page, EDfn.provideEmail, "No User Create")
    } else {
      await checkRadioByDfn(this.#page, EDfn.update, false);
    }
  }


  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   2    |   y       |   n       |   y    | test2    |                | Test1@#$%^ |            |           |
   */
  async test2() {
    // this.#page = await handleTC(this.#page, this.#url);
    await checkRadioByDfn(this.#page, EDfn.anon, true);
    await checkRadioByDfn(this.#page, EDfn.returning, false);
    await checkRadioByDfn(this.#page, EDfn.update, true);
    // select create with username
    await checkRadioByDfn(this.#page, EDfn.provideEmail, false);

    await usernamePwCreate(this.#page, this.#username, this.#password);
  }
  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   3    |   y       |   n       |   y    |          |test@example.com| Test1@#$%^ |            |           |
   */
  async test3() {
    await checkRadioByDfn(this.#page, EDfn.anon, true);
    await checkRadioByDfn(this.#page, EDfn.returning, false);
    // create with email and password
    await checkRadioByDfn(this.#page, EDfn.update, true);
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
    await checkRadioByDfn(this.#page, EDfn.anon, true);
    await checkRadioByDfn(this.#page, EDfn.returning, true);
    await fillReturnUser(
      this.#page,
      {
        dnf: EDfn.loginUsernameEmail,
        username: "test@example.com",
        password: this.#password
      }
    );
    /**
     * TODO: handle failed case and revert back to this.#username
     */
    // sign in
    await this.#page.locator("button#login").click();
    await this.#page.waitForSelector("p[id='login-success']");
  }

  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   5    |   n       |   n       |   n    |          |                |            | test5      |  test5    |
   */
  async test5() {
    await checkRadioByDfn(this.#page, EDfn.anon, false);
    await checkRadioByDfn(this.#page, EDfn.returning, false);
    await checkRadioByDfn(this.#page, EDfn.update, false);
    await fillFirstLastName(this.#page, { firstName: this.#username, lastName: this.#username });

  }

  /**
   * 
   * | test  | anonymous | returning | update | username | email          | password   | first name | last name |
   * | 6     |   n       |   n       |   y    |          |test@example.com| Test1@#$%^ | test6      | test6     |
   */
  async test6() {
    await checkRadioByDfn(this.#page, EDfn.anon, false);
    await checkRadioByDfn(this.#page, EDfn.returning, false);
    await checkRadioByDfn(this.#page, EDfn.update, true);

    await fillFirstLastName(this.#page, { firstName: this.#username, lastName: this.#username });
    await fillEmailPW(this.#page, this.#email, this.#password);
  }

  async test7() {

    await checkRadioByDfn(this.#page, EDfn.anon, false);
    await checkRadioByDfn(this.#page, EDfn.returning, true);

    await fillFirstLastName(this.#page, { firstName: this.#username, lastName: this.#username });
    await fillReturnUser(this.#page, { dnf: EDfn.loginUsernameEmail, username: "test@example.com", password: this.#password })
    await this.#page.locator("button#login").click();
  }


  async submit() {
    await handleSubmit(this.#page);
  }
}

