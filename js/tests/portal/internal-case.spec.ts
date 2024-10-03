/**
 * Internal case for testing add party and edit/update case.
 */

import test, { expect } from "@playwright/test";
import * as process from "node:process";
import { EInputNames } from "../util/enums";
import { addParty, fillInput } from "../util/portal";

test.describe("Login as internal user ", () => {

  let url = process.env.URL || "https://plab08.i-sightlab.com/portal";
  const pathname = new URL(url).toString();
  url = url.replace(pathname, "") + "/login";

  const username = "isight";
  const password = "#Case2024!!";

  test("add party", async ({ page }) => {
    /**
     * go to /login
     * acc: isight
     * pw : #Case2024!!
     * go to /case
     * click first with case type Internal Matter 
     * click parties
     * click "add party"
     * fill all inputs  
     */
    await page.goto(url);
    // await fillReturnUser(page, { dnf: "" ,username, password });

    await fillInput({ page, cssSelector: EInputNames.loginUsername, value: username });
    await fillInput({ page, cssSelector: EInputNames.loginPassword, value: password });
    await page.locator("button#login").click();


    const dialog = page.locator("div[role='dialog']");
    await dialog.locator("a.introjs-button").first().click();


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
    // await fillReturnUser(page, { dnf: "" ,username, password });

    await fillInput({ page, cssSelector: EInputNames.loginUsername, value: username });
    await fillInput({ page, cssSelector: EInputNames.loginPassword, value: password });
    await page.locator("button#login").click();


    const dialog = page.locator("div[role='dialog']");
    await dialog.locator("a.introjs-button").first().click();


    await page.locator("a[data-route='/cases']").click();
    await page.locator("tr[tabindex='0']").first().click();




      await page.locator("button#edit").click();

    // await page.getByRole("form").locator("label").first().isVisible();

      // console.log(await page.locator("select").first().click({ clickCount: 10 }));
      for (const select of await page.locator("select").all()) {
        console.log(await select.allInnerTexts());
        // while ((await select.inputValue()) === "") {
          const options = await select.locator("option").all();
          let rand = Math.floor(Math.random() * (options.length - 1)) + 1;
          await select.selectOption({ index: rand });
        // }
      }

      await page.locator("button#save").click();


      const tmsg = await page.locator("div.toast-message").textContent();
      expect(tmsg).toContain("Updated");

  });
})