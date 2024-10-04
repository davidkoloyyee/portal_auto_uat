"use strict";

import { test } from "@playwright/test";
import * as process from "node:process";
import {
  addFile, addParty, checkByDfn,
  checkByDfnByValue,
  emailPwCreate, fillEmailPW, fillFirstLastName, fillReturnUser, handleSubmit, handleTC, usernamePwCreate
} from "../util/core-fn";
import { EDfn } from "../util/enums";

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })
// let url = "";
// rl.question("what's the url? ", input => {
//   url = input;
//   console.log({url})
//   rl.close();
// });


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

test.describe(` 2-Way Portal Reporter Test`, () => {

  let url = process.env.URL ?? "https://plab08.i-sightlab.com/portal";
  const pathname = new URL(url).toString();
  let testerName = new URL(url).hostname.split(".")[0] + "test" + Math.floor(Math.random() * 1000);
  url = url.replace(pathname, "") + "/login";

  const rand = Math.floor(Math.random() * 1000);
  let email = `test${rand}@email.com`;

  testerName.replace("@", "");
  let username = process.env.USER ?? testerName;
  let password = process.env.PW ?? "Test1@$%^";

  // const twoway = TwoWayFn(url);

  test.beforeEach(async ({ page }) => {
    if (url.includes("reportonline")) {
      url = url.replace("/reportonline", "");
    }
    await handleTC(page, url);
    // added special required fields here.

    for (let tb of await page.getByRole("textbox").all()) {
      await tb.fill(new Date() + " " + url);
    }

    for (const select of await page.locator("select").all()) {
      if (await select.isVisible()) {
        select.selectOption({ index: 1 })
      }
    }

    for (const textInput of await page.locator("input[type='text']").all()) {
      if (await textInput.isVisible()) {
        textInput.fill(new Date() + " " + url)
      }
    }

    for (const select of await page.locator("dialog").all()) {
      console.log("I shouldn't see this. ")
      if (await select.isVisible()) {
        select.selectOption({ index: 1 })
      }
    }

  });


  /**
   *
   *  test  | anonymous | returning | update | username | email          | password  | first name | last name |
   *   1    |   y       |   n       |   n    |          |                |           |            |           |
   */
  test("T1: A=Y R=N U=N", async ({ page }) => {

    // let twp = new TwoWayPortal(page, url);
    // await twp.test1();
    // await handleSubmit(page);

    await checkByDfn(page, EDfn.anon, true);
    await checkByDfn(page, EDfn.returning, false);

    const provideEmail = await page.locator(`div[data-field-name='${EDfn.provideEmail}']`);
    // await provideEmail.click();
    const provideEmailExists = await provideEmail.isVisible();
    console.log(provideEmailExists);
    if (provideEmailExists) {
      await checkByDfnByValue(page, EDfn.provideEmail, "No User Create")
    } else {
      await checkByDfn(page, EDfn.update, false);
    }

    await handleSubmit(page);
  });

  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   2    |   y       |   n       |   y    | test2    |                | Test1@$%^ |            |           |
   */
  test("T2-1: A=Y R=N U=Y ", async ({ page }) => {
    // let twp = new TwoWayPortal(page, url);
    // await twp.test2();
    // await handleSubmit(page);

    await checkByDfn(page, EDfn.anon, true);
    await checkByDfn(page, EDfn.returning, false);
    await checkByDfn(page, EDfn.update, true);
    // select create with username
    await checkByDfn(page, EDfn.provideEmail, false);

    await usernamePwCreate(page, username, password);
    await handleSubmit(page);
  });



  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   3    |   y       |   n       |   y    |          |test@example.com| Test1@$%^ |            |           |
   */
  test("T3: A=Y R=N U=Y", async ({ page }) => {
    // let twp = new TwoWayPortal(page, url);
    // await twp.test3();
    // await handleSubmit(page);

    await checkByDfn(page, EDfn.anon, true);
    await checkByDfn(page, EDfn.returning, false);
    // create with email and password
    await checkByDfn(page, EDfn.update, true);
    await emailPwCreate(
      page,
      EDfn.provideEmail,
      email,
      password
    );
    await handleSubmit(page);
  });

  /**
   * TODO: NOT DONE YET because of the fail to login.
   * 
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   4    |   y       |   y       |        |  test2   |                | Test1@$%^ |            |           |
   */
  test("T4: A=Y R=Y ", async ({ page }) => {
    await checkByDfn(page, EDfn.anon, true);
    await checkByDfn(page, EDfn.returning, true);
    await fillReturnUser(page, {
      dnf: EDfn.loginUsernameEmail,
      username: email,
      password: password
    }
    );

    // sign in
    await page.locator("buttonlogin").click();
    await page.waitForSelector("p[id='login-success']");

    await handleSubmit(page);
  });

  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   5    |   n       |   n       |   n    |          |                |            | test5      |  test5    |
   */
  test("T5: A=N R=N U=N", async ({ page }) => {
    // let twp = new TwoWayPortal(page, url);
    // await twp.test5();
    // await twoway.test5(page);
    // await handleSubmit(page);

    await checkByDfn(page, EDfn.anon, false);
    await checkByDfn(page, EDfn.returning, false);
    await checkByDfn(page, EDfn.update, false);

    await fillFirstLastName(page, { firstName: username, lastName: username });

    await handleSubmit(page);
  });

  /**
   * 
   * | test  | anonymous | returning | update | username | email          | password   | first name | last name |
   * | 6     |   n       |   n       |   y    |          |test@example.com| Test1@$%^ | test6      | test6     |
   */
  test("T6: A=N R=N U=Y", async ({ page }) => {
    await checkByDfn(page, EDfn.anon, false);
    await checkByDfn(page, EDfn.returning, false);
    await checkByDfn(page, EDfn.update, true);

    await fillFirstLastName(page, { firstName: username, lastName: username });
    await fillEmailPW(page, email, password);
    await handleSubmit(page);
  });
  /**
   * 
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   7    |   n       |   y       |        |          |test@example.com| Test1@$%^ | test7      | test7     |
   */
  test("T7: A=N R=Y", async ({ page }) => {
    await checkByDfn(page, EDfn.anon, false);
    await checkByDfn(page, EDfn.returning, true);

    await fillFirstLastName(page, { firstName: username, lastName: username });
    await fillReturnUser(page, { dnf: EDfn.loginUsernameEmail, username: email, password })
    await handleSubmit(page);
  })

  test("Add Party", async ({ page }) => {
    await addParty(page);
  });

  test("Add File", async ({ page }) => {
    await addFile(page);
  });


  test.afterEach(async ({ page }, testInfo) => {
    // await screenshotOnFailed(page, testInfo);
  });
});