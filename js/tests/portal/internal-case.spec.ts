/**
 * Internal case for testing add party and edit/update case.
 */

import test, { expect } from "@playwright/test";
import * as process from "node:process";
import { addParty, fillAllSelectRand, fillInputFake, fillTextboxFake, login } from "../util/core-fn";

test.describe("Login as internal user ", () => {

  let url = process.env.URL ?? "https://plab08.i-sightlab.com/portal";
  url = new URL(url).origin + "/login";

  const username = process.env.USER ?? "isight";
  const password = process.env.PW ?? "123456";

  test("add party", async ({ page }) => {

    await page.goto(url);
    await login(page, { username, password });

    await page.locator("a[data-route='/cases']").click();
    await page.locator("tr[tabindex='0']").first().click();
    await page.locator("a[id='case-parties-tab']").click();
    // count number of trs 
    await page.getByRole("table").click();
    const trCountStart = (await page.locator("tr").all()).length;

    const trCountEnd = await addParty(page, { isPortal: false });

    // do an assert.
    expect(trCountStart).toBeLessThan(trCountEnd);
  });

  test("edit and save case", async ({ page }) => {

    await page.goto(url);
    await login(page, { username, password });

    await page.locator("a[data-route='/cases']").click();
    await page.locator("tr[tabindex='0']").first().click();

    await page.locator("button#edit").click();

    // console.log(await page.locator("select").first().click({ clickCount: 10 }));
    if (await page.locator("select").first().isVisible()) {
      await fillAllSelectRand(page);
    }
    // for (const select of await page.locator("select").all()) {
    //   console.log(await select.allInnerTexts());
    //   // while ((await select.inputValue()) === "") {
    //   const options = await select.locator("option").all();
    //   let rand = Math.floor(Math.random() * (options.length - 1)) + 1;
    //   await select.selectOption({ index: rand });
    //   // }
    // }
    if(await page.locator("input[type='text']").first().isVisible()) {
      await fillInputFake(page, url)
    }
    if(await page.locator("textbox").first().isVisible()) {
      await fillTextboxFake(page, url)
    }
    await page.locator("button#save").click();


    const tmsg = await page.locator("div.toast-message").textContent();
    expect(tmsg).toContain("Updated");

  });
})