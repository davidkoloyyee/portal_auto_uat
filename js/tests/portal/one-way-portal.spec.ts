import test, { expect } from "@playwright/test";
import { env } from "node:process";
import { checkRadioByDfn, fillFirstLastName, handleSubmit, handleTC } from "../../src/util/core-fn";
import { EDfn } from "../../src/util/enums";
/**
 * 1 Way Portal
 * ------------------
 * 
 * | test | anonymous | add party | submit with file | username | email | password | first name | last name |
 * | ---- | --------- | --------- | ---------------- | -------- | ----- | -------- | ---------- | --------- |
 * | 1    | n         |           |                  |          |       |          | test1      | test1     |
 * | 2    | y         |           |                  |          |       |          |            |           |
 * | 3    |           | y         |                  |          |       |          |            |           |
 * | 4    |           |           | y                |          |       |          |            |           |
 */
let url: string = env.URL || "https://plab08.i-sightlab.com/portal";
const route = new URL(url);
let testerName = route.hostname.split(".")[0] + "test" + Math.floor(Math.random() * 1000);
test.describe(`1-Way Portal Reporter Test`, () => {

  const rand = Math.floor(Math.random() * 1000);
  let email = `test${rand}@email.com`;

  testerName.replace("@", "");
  let username = testerName;

  let password = "Test1@$%^";


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
        try {
          select.selectOption({ index: 1 });
        } catch (ignored) { // not sure why it didn't failed and pass to here??
          select.selectOption({ index: 0 });
        }
      }
    }

    for (const textInput of await page.locator("input[type='text']").all()) {
      const attrName = await textInput.getAttribute("name");
      if (await textInput.isVisible() && !attrName?.includes("date")) {
        textInput.fill(new Date() + " " + url)
      }
    }

    for (const select of await page.locator("dialog").all()) {
      console.log("I shouldn't see this. ")
    }

  });

  /**
   * 
   * | test | anonymous | add party | submit with file | username | email | password | first name | last name |
   * | ---- | --------- | --------- | ---------------- | -------- | ----- | -------- | ---------- | --------- |
   * | 1    | n         |           |                  |          |       |          | test1      | test1     |
   */
  test("T1: A=N", async ({ page }) => {

    await checkRadioByDfn(page, EDfn.anon, false);
    await fillFirstLastName(page, { firstName: "test", lastName: "1" });

    // for (let tb of await page.getByRole("textbox").all()) {
    //   await tb.fill(new Date() + " " + url);
    // }

    // await handleCal(page);
    await handleSubmit(page);
  })

  /**
   * 
   * | test | anonymous | add party | submit with file | username | email | password | first name | last name |
   * | ---- | --------- | --------- | ---------------- | -------- | ----- | -------- | ---------- | --------- |
   * | 2    | y         |           |                  |          |       |          |            |           |
   */
  test("T2: A=Y", async ({ page }) => {
    await checkRadioByDfn(page, EDfn.anon, true);
    await handleSubmit(page)
  })

  /**
   * 
   * | test | anonymous | add party | submit with file | username | email | password | first name | last name |
   * | ---- | --------- | --------- | ---------------- | -------- | ----- | -------- | ---------- | --------- |
   * | 3    |           | y         |                  |          |       |          |            |           |
   */
  test("T3: P=Y", async ({ page }) => {
    await page.locator("button[data-display-rule='displayParty']").click()

    const party = page.locator("div#party-modal");
    await party.waitFor();

    await expect(party).toBeVisible({ timeout: 10000 })

    for (const select of await party.locator("select").all()) {
      if (await select.isVisible()) {
        try {
          select.selectOption({ index: 1 });
        } catch (ignored) { // not sure why it didn't failed and pass to here??
          select.selectOption({ index: 0 });
        }
      }
    }
    await party.getByRole("button", { name: "Save" }).click();
  });

})