import test from "@playwright/test";
import * as process from "node:process";
import { addNew, fillAllSelectRand, fillInputFake, fillTextboxFake, handlePhone, login, menuNavigate } from "../../src/util/core-fn";

test.describe("Settings", () => {

  let url = process.env.URL;
  url = new URL(url).origin;
  const username = process.env.USER;
  const password = process.env.PW;


  test("Create User Profile", async ({ page }) => {
    /**
     * 1. login - test/changeme
     * 2. click settings (data-route="/settings" or href="/settings")
     * 3. click (button href="/settings/access/user/new")
     * 4. fill in the inputs, select, textbox
     * 5. handle phone number - country code: name="countryCode" |  phone:(aria-label="Phone Number")
     * 6. submit
     */
    url += "/login";
    await page.goto(url);
    await login(page, { username, password });
    await page.waitForLoadState("domcontentloaded");

    await menuNavigate(page, { route: 'settings' })
    await addNew(page, { href: "/settings/access/user/new" });

    await page.locator("input[role='combobox'][id*='userRoleId']").click();
    await page.locator("div.picklist-selectize-api-component-tmpl").nth(0).locator("div[role='option']").first().click();
    await page.locator("input[id*='email'][role='combobox']").fill("test@example.com")
    await page.keyboard.press("Tab");

    await fillInputFake(page, url);
    await fillAllSelectRand(page);
    await fillTextboxFake(page, url);
    
    await handlePhone(page, { phone: "4376699010" });

    await page.waitForTimeout(3000);
    await page.locator("button#save").click();
  });
});