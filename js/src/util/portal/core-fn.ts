/**
 * All the core functions for handling automations for portal.
 */

import { expect, Page } from "@playwright/test";


/**
 * Handle v9^ T&C Modal. 
 * @param page - Playwright Page object.
 * @param url - Client's UAT test link.
 * @returns 
 */
export async function handleTC(page: Page, url: string): Promise<Page> {
  await page.goto(url);
  // await page.getByRole("link", { name: "Report Online" }).click();
  await page.getByRole("button", { name: "Accept" }).click();
  return page;
}

/* Extracting html or String from the dom. */
export const extract = {

  caseSubmitMsg: async (page: Page) => {
    const modalContent = page.locator("[data-handle*='portal-submission-success-modal-tmpl'] div.modal-content");
    if (modalContent === null) return "";
    const header = await modalContent.locator("div.modal-header div.title").textContent();
    expect(header).toContain("Submitted");

    const message = await modalContent.locator("div.modal-body").textContent();
    expect(message).toContain("successfully")
    return message;
  }
}