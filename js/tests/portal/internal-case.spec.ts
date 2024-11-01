/**
 * Internal case for testing add party and edit/update case.
 */

import test, { expect } from "@playwright/test";
import * as process from "node:process";
import { addParty, checkIntroJs, login } from "../../src/util/core-fn";
import { fillAllSelectRand, fillInputFake, fillTextboxFake } from "../../src/util/internal/fillers";


// TODO: LOTS OF BUGS.
test.describe("Login as internal user ", () => {

  let url = process.env.URL ?? "https://plab08.i-sightlab.com/portal";
  url = new URL(url).origin + "/login";

  const username = process.env.USER ?? "isight";
  const password = process.env.PW ?? "123456";

  test("add party", async ({ page }) => {

    await page.goto(url);
    await login(page, { username, password });

    await checkIntroJs(page).then(async () => {

      await page.locator("a[data-route='/cases']").click();
      await page.locator("tr[tabindex='0']").first().click();
      await page.locator("a[id='case-parties-tab']").click();
      // count number of trs 
      await page.getByRole("table").click();
      const trCountStart = (await page.locator("tr").all()).length;

      const trCountEnd = await addParty(page, { isPortal: false });

      // new record added?
      expect(trCountStart).toBeLessThan(trCountEnd);
    })

  });

  test("edit and save case", async ({ page }) => {

    await page.goto(url);
    await login(page, { username, password });

    await checkIntroJs(page);

    await page.locator("a[data-route='/cases']").click();
    await page.locator("tr[tabindex='0']").first().click();

    await page.locator("button#edit").click();

    if (await page.locator("select").first().isVisible()) {
      await fillAllSelectRand(page);
    }
    if (await page.locator("input[type='text']").first().isVisible()) {
      await fillInputFake(page, url)
    }
    if (await page.locator("textbox").first().isVisible()) {
      await fillTextboxFake(page, url)
    }
    await page.locator("button#save").click();


    const tmsg = await page.locator("div.toast-message").textContent();
    expect(tmsg).toContain("Updated");

  });
})
