
/**
 * Ths is the testing group for small functions, not actual test.
 */

import test, { Locator } from "@playwright/test";
import * as process from "node:process";
import { click, extract, fill, processURL } from "../../src/util/core-fn";
import { handleTC } from "../../src/util/portal/core-fn";


test.describe("unit tests", () => {
  let url = processURL(process.env.URL, { isPortal: true })
  let addBtns: Locator[] = [];


  test.beforeEach(async ({ page }) => {
    await handleTC(page, url);
  })
  test("add btns ", async ({ page }) => {
    // get all the buttons with class btn-add-xxxxx
    const addBtns = await page.locator("button[class*='btn-add-']").all();
    const dialog = await extract.modalDialog(page, addBtns, "party");
    const phones = await extract.phones(dialog);

    for(const p of phones ) {
      await fill.phone(page, p, "1", "1234567890");
    }

    const selects = await extract.selects(dialog);
    for (const s of selects) {
      await fill.select(s);
    }

    const selectizeds = await extract.selectizeds(dialog);
    const selectizedIds: any = [];
    for (const s of selectizeds) {
      selectizedIds.push(await s.getAttribute("id"));
    }

    await fill.email(page, dialog, "dko@caseiq.com");

    const textInputs = await extract.textInputs(dialog);
     for(const t of textInputs) {
      await fill.textInput(page, t, "abc");
     }

    const postalCodes = await extract.postalCodes(dialog);
    for (const p of postalCodes) {

      await fill.zipPostalCode(page, p , "k2r59e")
    }
    const calendars = await extract.calendars(dialog);
    for (const c of calendars) {
      if (await c.isVisible()) {
        await fill.calendar(page, c);

      }
    }
    await click.save(dialog);
  })
})