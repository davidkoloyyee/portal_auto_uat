"use strict";

import { test } from "@playwright/test";
import { env } from "node:process";
import { captureSubmitMessage, confirmSubmit, handleTC, submit } from "../util/portal";
import TwoWayPortal from "../util/two-way";

let URL = env.URL || "https://plab08.i-sightlab.com/portal";


/**
 * Here is a demo test group for the plab08 portal.
 * In each test case we are doing the TwoWayPortal tests, we also leaving room for different client's required fields.
 */
test.describe(`${URL} portal reporter test`, () => {
  test.beforeEach(async ({ page }) => {
    if (URL.includes("reportonline")) {
      URL = URL.replace("/reportonline", "");
    }
    await handleTC(page, URL);
    // added special required fields here.

    for (let tb of await page.getByRole("textbox").all()) {
      await tb.fill(new Date() + " " + URL);
    }

    for (const select of await page.locator("select").all()) {
      if (await select.isVisible()) {
        select.selectOption({index: 1})
      }
    }

    for( const textInput of await page.locator("input[type='text']").all()) {
      if(await textInput.isVisible()) {
        textInput.fill(new Date() + " " + URL)
      }
    }

    for (const select of await page.locator("dialog").all()) {
      console.log("I shouldn't see this. ")
      if (await select.isVisible()) {
        select.selectOption({index: 1})
      }
    }

  });

  test.only("look at the dom", async ({ page }) => {


    let twp = new TwoWayPortal(page, URL);
    await twp.test1();
  })


  test("Two way portal test 1 ", async ({ page }) => {

    let twp = new TwoWayPortal(page, URL);
    await twp.test1();
  });

  test("Two way portal test 2 ", async ({ page }) => {
    let twp = new TwoWayPortal(page, URL);
    await twp.test2();
  });

  test("Two way portal test 3 ", async ({ page }) => {
    let twp = new TwoWayPortal(page, URL);
    await twp.test3();
  });
  test("Two way portal test 4 ", async ({ page }) => {
    let twp = new TwoWayPortal(page, URL);
    await twp.test4();
  });
  test("Two way portal test 5 ", async ({ page }) => {
    let twp = new TwoWayPortal(page, URL);
    await twp.test5();
  });

  test("Two way portal test 6 ", async ({ page }) => {
    let twp = new TwoWayPortal(page, URL);
    await twp.test6();
  });
  test.afterEach(async ({ page }) => {

    await submit(page);
    await confirmSubmit(page); // comment out to avoid excessive submission

    // capture the message
    const message = await captureSubmitMessage(page);
    // console.log(message); // this should be recorded somewhere.
    await page.close();
    console.log(message)
    // return message;
  });
});
