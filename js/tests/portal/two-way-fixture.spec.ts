"use strict";

import { test as base } from "@playwright/test";
import { env } from "node:process";
import { addParty } from "../util/portal";

import { TwoWayPortal } from "../util/two-way";

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
let url: string = env.URL || "https://plab08.i-sightlab.com/portal";
const route = new URL(url);
let testerName = route.hostname.split(".")[0] + "test" + Math.floor(Math.random() * 1000);

const test = base.extend<{ twp: TwoWayPortal }>({
  twp: async ({ page }, use) => {
    const twp = new TwoWayPortal(page, url);
    await twp.pretest();
    await use(twp);
    await twp.submit();
  },
});
test.describe(` 2-Way Portal Reporter Test`, () => {

  /**
   *
   *  test  | anonymous | returning | update | username | email          | password  | first name | last name |
   *   1    |   y       |   n       |   n    |          |                |           |            |           |
   */
  test("T1: A=Y R=N U=N", async ({ twp }) => {
    await twp.test1();
  });

  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   2    |   y       |   n       |   y    | test2    |                | Test1@$%^ |            |           |
   */
  test("T2-1: A=Y R=N U=Y ", async ({ twp }) => {
    await twp.test2();
  });



  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   3    |   y       |   n       |   y    |          |test@example.com| Test1@$%^ |            |           |
   */
  test("T3: A=Y R=N U=Y", async ({ twp }) => {
    await twp.test3();
  });

  /**
   * TODO: NOT DONE YET because of the fail to login.
   * 
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   4    |   y       |   y       |        |  test2   |                | Test1@$%^ |            |           |
   */
  test("T4: A=Y R=Y ", async ({ twp }) => {
    await twp.test3();

  });

  /**
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   5    |   n       |   n       |   n    |          |                |            | test5      |  test5    |
   */
  test("T5: A=N R=N U=N", async ({ twp}) => {
    await twp.test5();
  });

  /**
   * 
   * | test  | anonymous | returning | update | username | email          | password   | first name | last name |
   * | 6     |   n       |   n       |   y    |          |test@example.com| Test1@$%^ | test6      | test6     |
   */
  test("T6: A=N R=N U=Y", async ({ twp}) => {
    await twp.test6()
  });
  /**
   * 
   *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
   *   7    |   n       |   y       |        |          |test@example.com| Test1@$%^ | test7      | test7     |
   */
  test("T7: A=N R=Y", async ({ twp }) => {
    await twp.test7();
  })

  test("Add Party", async ({ page }) => {
    await addParty(page);
  });
  

  test.afterEach(async ({ page }, testInfo) => {
    // await screenshotOnFailed(page, testInfo);
  });
});