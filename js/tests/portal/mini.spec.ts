
/**
 * Ths is the testing group for small functions, not actual test.
 */

import test, { Locator } from "@playwright/test";
import * as process from "node:process";
import { extract, fill, processURL } from "../../src/util/core-fn";
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

    // for(const p of phones ) {
    //   await fill.phone(page, p, "1", "1234567890");
    // }

    const selects = await extract.selects(dialog);
    // for (const s of selects) {
    //   await fill.select(s);
    // }

    const selectizeds = await extract.selectizeds(dialog);
    const selectizedIds: any = [];
    for (const s of selectizeds) {
      selectizedIds.push(await s.getAttribute("id"));
    }

    fill.email(page, dialog, "dko@caseiq.com");

    await extract.textInputs(dialog);
    const postalCodes = await extract.postalCodes(dialog);

  })
})