import test, { expect } from "@playwright/test";
import { env } from "node:process";
import { addNew, fillAllSelectRand, fillInputFake, fillTextboxFake, handleCal, handleSubmit, login, menuNavigate } from "../src/util/core-fn";


test.describe("exploring playwright functions", () => {
  let url: string = env.URL ?? "https://plab08.i-sightlab.com/portal";
  const username = env.USER ?? "isight";
  const password = env.PW ?? "123456";

  let menuItems: string[] = [];

  test.beforeEach(async ({ page }) => {
    url = new URL(url).origin + "/login";
    console.log({ url })
    await page.goto(url);
    await login(page, { username, password });
  });

  test("exploring", async ({ page }) => {

    const content = await page.content();
    console.log(content)
  });

  test("grab all menu links", async ({ page }) => {

    await page.waitForTimeout(5000);

    for (const link of await page.locator("#isight-navigation").locator("a").all()) {
      const href = await link.getAttribute("href");
      if (href !== null) {
        menuItems.push(href);
      }
    }

    for (const title of await page.locator("div.grid-title ").all()) {
      const content = await title.textContent();
      const h = ["My Pending To-Dos", "My Appointments", "Favorites"]
      expect(h).toContain(content);
    }
  });

  test("add case", async ({ page }) => {
    await menuNavigate(page, { route: 'cases' });

    const table = page.locator("table");
    const rowCount = (await table.locator("tr").all()).length;
    console.log(rowCount);

    await addNew(page, { href: "case/new" })
    // await page.waitForSelector("form");
    await page.waitForTimeout(3000);

    await page.locator("select[id*='caseType']").selectOption({ index: 0 });

    await page.waitForTimeout(1000);
    if (await page.locator("select").first().isVisible()) {
      await fillAllSelectRand(page);
    }
    await handleCal(page);

    if (await page.locator("input[type='text']").first().isVisible()) {
      await fillInputFake(page, url);
    }
    if (await page.getByRole("textbox").first().isVisible()) {
      await fillTextboxFake(page, url);
    }

    await handleSubmit(page);

    const table2 = page.locator("table");
    const rowCount2 = (await table2.locator("tr").all()).length;
    console.log(rowCount === rowCount2);
  });

  test("add todo", async ({ page }) => {
    await navigate(page, { route: "todos", extra: "to-dos" })
    const table = page.locator("table");
    const rowCount = (await table.locator("tr").all()).length;

    await addNew(page, { href: "to-do/new" })

    await page.waitForTimeout(1000);
    // if (await page.locator("select").first().isVisible()) {
    await fillAllSelectRand(page);
    // }
    await fillInputFake(page, url);

    await handleCal(page);

    // if (await page.locator("input[type='text']").first().isVisible()) {
    // }
    // if (await page.getByRole("textbox").first().isVisible()) {
    await fillTextboxFake(page, url);
    // }

    // await handleSubmit(page);
    await page.locator("button#save").click();

    const table2 = page.locator("table");
    const rowCount2 = (await table2.locator("tr").all()).length;
    expect(rowCount2).toBeGreaterThan(rowCount);
  });
});