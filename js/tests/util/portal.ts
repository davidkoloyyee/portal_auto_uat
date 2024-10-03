/**
 * Portal is a set of functions to handle common portal reporter operations.
 * @module Portal
 * We are trying to keep it as flexible as possible by selecting the element by CSS selector as
 * we might encounter different languages.
 *
 */

import { Page, TestInfo } from "@playwright/test";
import * as path from "node:path";
import * as process from "node:process";
import { EInputNames } from "./enums";

/**
 * @param {boolean}  yesOrNo - the html attribute "value=['yes' or 'no']" true is "yes", false is "no";
 * @param {EDfn}  dfn - html attribute: data-field-name
 * @param {import("@playwright/test").Page} page
 */
export async function checkByDfn(page: Page, dfn: string, yesOrNo: boolean) {
  const choice = yesOrNo ? "yes" : "no";
  await page
    .locator(`[data-field-name='${dfn}'] input[value='${choice}']`)
    .check();
  return page;
}

/**
 * @param {boolean}  yesOrNo - the html attribute "value=['yes' or 'no']" true is "yes", false is "no";
 * @param { EDfn}  dfn - html attribute: data-field-name
 * @param {import("@playwright/test").Page} page
 */
export async function checkByDfnByValue(page: Page, dfn: string, value: string) {
  await page
    .locator(`[data-field-name='${dfn}'] input[value='${value}']`)
    .check();
  return page;
}
/**
 *
 * @param {import("@playwright/test").Page} page
 * @returns
 */
export async function submit(page: Page) {
  await page.locator("button#submit").click();
}

/**
 *
 * @param {Page} page
 */
export async function confirmSubmit(page: Page) {
  await (
    await page.waitForSelector(
      "div.portal-submission-confirmation-modal-tmpl.bb-view.modal-tmpl  button#submit"
    )
  ).click();
}

/**
 * @param {string}  inputVal - input value
 * @param { EDfn}  dfn - html attribute: data-field-name
 * @param {import("@playwright/test").Page} page
 */
export async function clickByDfn(page: Page, dfn: string, inputVal: string) {
  await page
    .locator(`[data-field-name='${dfn}'] input[value='${inputVal}']`)
    .click();
  return page;
}

/**
 *
 * Capture the message after submission to indicate success.
 * @param {Page} page
 * @returns
 */
export async function captureSubmitMessage(page) {
  const modal = await page.waitForSelector(
    "div[data-handle*='portal-submission-success-modal-tmpl'] div.modal-content"
  );
  const message = modal.innerText();
  return message;
}

/**
 *
 * @param {import("@playwright/test").Page} page
 * @param {EDfn}  dfn - html attribute: data-field-name
 * @param {string} email
 * @param {string} password
 */
export async function emailPwCreate(page: Page, dnf: string, email: string, password: string) {
  await checkByDfn(page, dnf, true);
  await fillEmailPW(page, email, password);
}

export async function fillEmailPW(page: Page, email: string, password: string) {

  await fillInput({ page, cssSelector: EInputNames.idEmailWild, value: email, index: 1 });
  await fillInput({ page, cssSelector: EInputNames.password, value: password });
  await fillInput({ page, cssSelector: EInputNames.confirmPassword, value: password });
}

/**
 *
 * @param {import("@playwright/test").Page} page
 * @param {EDfn}  dfn - html attribute: data-field-name
 * @param {string} username
 * @param {string} password
 */
export async function usernamePwCreate(page: Page, username: string, password: string) {
  await fillInput({ page, cssSelector: EInputNames.username, value: username });
  await fillInput({ page, cssSelector: EInputNames.password, value: password });
  await fillInput({ page, cssSelector: EInputNames.confirmPassword, value: password });
}

/**
 *
 * @param {import("@playwright/test").Page} page
 * @param {EDfn}  dnf - html attribute: data-field-name
 * @param {string} username - username or email
 * @param {string} password
 */
interface FillReturnUserParams {
  dnf: string;
  username: string;
  password: string;
}

export async function fillReturnUser(page: Page, { dnf, username, password }: FillReturnUserParams) {

  await page.waitForSelector(`[data-field='${dnf}']`);
  // await page.waitForTimeout(1000);
  console.log({ password });
  await fillInput({ page, cssSelector: EInputNames.returnUsername, value: username });
  await fillInput({ page, cssSelector: EInputNames.returnPwWild, value: password });
}

interface FillLoginUserParams {
  page: Page;
  username: string;
  password: string;
}

export async function fillLoginUser(page, { username, password }: FillLoginUserParams) {

  await fillInput({ page, cssSelector: EInputNames.loginUsername, value: username });
  await fillInput({ page, cssSelector: EInputNames.loginPassword, value: password });
}


/**
 * 
 * @param {Page} page 
 * @param {string} firstName 
 * @param {string} lastName 
 */
interface FillFirstLastNameParams {
  firstName: string;
  lastName: string;
}

export async function fillFirstLastName(page: Page, { firstName, lastName }: FillFirstLastNameParams) {

  await page.waitForSelector("input[name='firstName']");

  await page.locator("input[name='firstName']").click();
  await page.keyboard.type(firstName);
  await page.locator("input[name='lastName']").click();
  await page.keyboard.type(lastName);
}

/**
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} cssSelector - it has a placeholder of `input[${cssSelector}]` therefore the argument should the css selector only e.g. "id*='portalUserEmail'" (for wildcard search) or "name='portalUserNewPassword'" (for exact search)
 * @param {string} value - keyboard typing value.
 * @param {number} index - nth child index, start with 0, if there is only 1 target put 0 as argument.
 * @returns {import("@playwright/test").Page}
 */
interface FillInputParams {
  page: Page;
  cssSelector: string;
  value: string;
  index?: number;
}

/**
 * Shorthand function for finding input by css attribute. e.g: name=xxx data-field-name=xxx
 * @param {import("@playwright/test").Page} page
 * @param {string} cssSelector - it has a placeholder of `input[${cssSelector}]` therefore the argument should the css selector only e.g. "id*='portalUserEmail'" (for wildcard search) or "name='portalUserNewPassword'" (for exact search)
 * @param {string} value - keyboard typing value.
 * @param {number} index - nth child index, start with 0, if there is only 1 target put 0 as argument.
 * @returns {import("@playwright/test").Page}
 */
export async function fillInput({ page, cssSelector, value, index = 0 }: FillInputParams): Promise<void> {

  await page.locator(`input[${cssSelector}]`).nth(index).click();
  await page.keyboard.type(value);
  await page.keyboard.press("Tab");
}

/**
 *
 * @param {import('@playwright/test').Page} page - playwright Page, everything about interact with the webpage.
 * @param {String} url
 */
interface HandleTCParams {
  page: Page;
  url: string;
}
/**
 * Handle v9^ T&C Modal. 
 * @param page - Playwright Page object.
 * @param url - Client's UAT test link.
 * @returns 
 */
export async function handleTC(page: Page, url: string): Promise<Page> {
  await page.goto(url);
  await page.getByRole("link", { name: "Report Online" }).click();
  await page.getByRole("button", { name: "Accept" }).click();
  return page;
}

/**
 * 
 * Handle Confirm Submit modal
 * @param {import('@playwright/test').Page} page - playwright Page, everything about interact with the webpage.
 */
export async function handleSubmit(page: Page) {

  await submit(page);
  await confirmSubmit(page); // comment out to avoid excessive submission

  // capture the message
  const message = await captureSubmitMessage(page);
  // console.log(message); // this should be recorded somewhere.
  await page.close();
  console.log(message)
  // return message;
}

/**
 * Portal add party
 */
export async function addParty(page: Page, {isPortal = true}) : Promise<number> {
  const btn = page.locator("button[data-display-rule*='displayParty']");
  await btn.click({ clickCount: 10, timeout: 3000 })

  let rowCount = 0;


  if (isPortal) {
    const modal = page.locator("div[id='party-modal']");
    await modal.click({ clickCount: 10 });
    if (await modal.isVisible()) {
      const radios = modal.getByRole("radio");
      // console.log(await radios.first().inputValue());
      console.log(await (await radios.all()).every(async el => await el.isChecked()));
      // if (!await radios.first().isChecked()) {
      //   radios.first().check()
      // }

      for (const select of await modal.locator("select").all()) {
        if (await select.isVisible()) {
          while ((await select.inputValue()) === "") {
            const options = await select.locator("option").all();
            let rand = Math.floor(Math.random() * (options.length - 1)) + 1;
            await select.selectOption({ index: rand });
          }
        }
      }

      for (const txtInput of await modal.locator("input[type='text']").all()) {
        const className = await txtInput.getAttribute("class");
        if (className === "form-control" && await txtInput.isVisible()) {
          console.log(await txtInput.getAttribute("name"))
          await txtInput.click();
          await txtInput.fill("test@example.com");
          await page.keyboard.press("Tab");
        }
      }
      // for (const cb of await modal.locator("[id*='emailAddress']").all()) {
      const cb = await modal.locator("[id*='emailAddress']").first();
      if (await cb.isVisible()) {
        await cb.click();
        // await page.keyboard.type("test@example.com");
        await cb.fill("test@example.com");
        await page.keyboard.press("Tab");
      }
      // }
      await page.getByRole("button", { name: "Save" }).click();
      
    }
  } else {
    console.log(page.url())
    const radios = page.getByRole("radio");
    // console.log(await radios.first().inputValue());
    // console.log(await (await radios.all()).every(async el => await el.isChecked()));
    // if (!await radios.first().isChecked()) {
    //   radios.first().check()
    // }

    console.log(await page.locator("select").first().click());
    for (const select of await page.locator("select").all()) {
      console.log(await select.allInnerTexts());
        while ((await select.inputValue()) === "") {
          const options = await select.locator("option").all();
          let rand = Math.floor(Math.random() * (options.length - 1)) + 1;
          await select.selectOption({ index: rand });
      }
    }

    for (const txtInput of await page.locator("input[type='text']").all()) {
      const className = await txtInput.getAttribute("class");
      if (className === "form-control" && await txtInput.isVisible()) {
        console.log(await txtInput.getAttribute("name"))
        await txtInput.click();
        await txtInput.fill("test@example.com");
        await page.keyboard.press("Tab");
      }
    }
    // for (const cb of await modal.locator("[id*='emailAddress']").all()) {
    const cb = await page.locator("[id*='emailAddress']").first();
    if (await cb.isVisible()) {
      await cb.click();
      await cb.fill("test@example.com");
      await page.keyboard.press("Tab");
    }
    await page.locator("button#save").click();
    await page.locator("button#confirm").click();
    
    // need to return the number of trs
    await page.getByRole("table").click();
    rowCount = (await page.locator("tr").all()).length;
  }
  return rowCount;
}

/**
 * TODO: upload file. 
 * @param page 
 */
export async function addFile(page: Page) {
  await page.getByRole("button", { name: "Add File" }).click({ clickCount: 10 });

  const modal = page.locator("div[id='attachment-modal']");
  await modal.click({ clickCount: 10 });
  if (await modal.isVisible()) {
    const fileDir = path.join(process.cwd(), 'tests');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator("label[id='manual-attachment-button']").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(fileDir, 'files', 'ft-82.jpg'),);
    await page.getByRole("button", { name: "Save" }).click();
  }
}


/**
 * Helper function but it is replaced by playwright.config.ts > use: {screenshot: 'only-on-failure'}
 * @param {Page} page - Playwright Page Object
 * @param {TestInfo} testInfo  - Playwright TestInfo Object
 */
export async function screenshotOnFailed(page: Page, testInfo: TestInfo) {
  console.log(testInfo.status);
  console.log(testInfo.expectedStatus);
  if (testInfo.status !== testInfo.expectedStatus) {

    const path = testInfo.outputPath(`test-failed.png`)
    console.log(testInfo.column);
    const body = await page.screenshot({ path: path, timeout: 500 });
    testInfo.attachments.push({ name: "test failed.", path: path, contentType: "image/png", body });
  }
};

export async function handleCal(page: Page) {
  const cal = await page.locator(EInputNames.calendarDMY).all();
  cal.forEach(async (c) => console.log(await c.getAttribute("aria-label")))

}