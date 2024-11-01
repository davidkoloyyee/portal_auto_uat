import test, { Locator } from "@playwright/test";

import * as process from "node:process";
import { fillAllSelectRand, handleSave, login } from "../../src/util/core-fn";
import { Fill } from "../../src/util/internal/fillers";

/**
 * () Ensure you can Create a new user
* () Ensure you can edit User's field value
* () Ensure you can send temporary password for a user (by clicking on 'here' link after user is created or expanding arrow menu next to Edit button) and they receive 2 emails, one with the userid and one with the password 
* Note that sending temporary password terminates all active sessions for a user (see Scenario 2 in ITPL-18004: Password Change/Reset does not terminate user's existing sessions
* Closed()
*  () Ensure 2 users with then same username or email address cannot be created
 */
test.describe("User Verification", () => {

  let origin = new URL(process.env.URL).origin;
  let url = origin + "/login";
  const username = process.env.USER;
  const password = process.env.PW;


  test("should create user", { tag: "@fast" }, async ({ page }) => {
    // login
    await page.goto(url);
    const landing = await login(page, { username, password });
    await landing.waitForTimeout(5000)
    // await landing.waitForLoadState("domcontentloaded")
    // goto 
    await landing.goto(origin + "/settings/access/user/new");
    await landing.waitForTimeout(10000)
    await landing.waitForLoadState("domcontentloaded")
    const form = landing.locator("div.default-form-tmpl");
    await form.click();

    // expect(form).toBeVisible();
    // get all input with name has "name"
    const namesInput: Locator[] = await form.locator("input[type='text']").all();
    const allSelects = await form.locator("select").all();
    for (const s of allSelects) {
      await Fill.select(s);
    }

    for (const i of namesInput) {
      // handle combobox
      const name = await i.getAttribute("name");

      // first name, last name 
      if (name?.includes("Name")) {
        await i.fill("Peter piper");
      } else if (name?.includes("nick")) {
        await i.fill("super_fake");
      }

      await Fill.combobox(page, i);
    }
      await handleSave(page);
  });


  test.skip("generic functions ", async ({ page }) => {

    await page.goto(url);
    const landing = await login(page, { username, password });

    await landing.waitForTimeout(5000)
    // goto 
    await landing.goto(origin + "/settings/access/user/new");
    await landing.waitForTimeout(10000)


    await fillAllSelectRand(landing);

    // await fillInputFake(landing, url);
    // await fillTextboxFake(landing, url);
    // await fillAllSelectRand(landing);


    await landing.locator("input[type='text'][role='combobox'][id*='email']").fill("dko@caseiq.com").then(() => {
      landing.keyboard.press("Enter");
    })

  });

});
