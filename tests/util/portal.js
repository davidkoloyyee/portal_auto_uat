/**
 * Portal is a set of functions to handle common portal reporter operations.
 * @module Portal
 * We are trying to keep it as flexible as possible by selecting the element by CSS selector as
 * we might encounter different languages.
 *
 */

import { Page } from "@playwright/test";
import { EDnf } from "./data-field-names";

/**
 * @param {boolean}  yesOrNo - the html attribute "value=['yes' or 'no']" true is "yes", false is "no";
 * @param {EDnf}  dfn - html attribute: data-field-name
 * @param {import("@playwright/test").Page} page
 */
async function checkByDfn(page, dfn, yesOrNo) {
  const choice = yesOrNo ? "yes" : "no";
  await page
    .locator(`[data-field-name='${dfn}'] input[value='${choice}']`)
    .check();
  return page;
}

/**
 *
 * @param {import("@playwright/test").Page} page
 * @returns
 */
async function submit(page) {
  await page.locator("button#submit").click();
}

/**
 *
 * @param {Page} page
 */
async function confirmSubmit(page) {
  await (
    await page.waitForSelector(
      "div.portal-submission-confirmation-modal-tmpl.bb-view.modal-tmpl  button#submit"
    )
  ).click();
}

/**
 * @param {string}  inputVal - input value
 * @param {EDnf}  dfn - html attribute: data-field-name
 * @param {import("@playwright/test").Page} page
 */
async function clickByDfn(page, dfn, inputVal) {
  if (page === null || page === undefined || typeof page !== "object") {
    throw new Error("page is null or undefined or not an object");
  }
  if (dnf === null || dnf === undefined || typeof dnf !== "string") {
    throw new Error("data field names is null or undefined or Enum type");
  }
  if (
    inputVale.trim() === "" ||
    inputVal === null ||
    inputVal === undefined ||
    typeof inputVal !== "string"
  ) {
    throw new Error("inputVal is null or undefined or not a string");
  }
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
async function captureSubmitMessage(page) {
  const modal = await page.waitForSelector(
    "div[data-handle*='portal-submission-success-modal-tmpl'] div.modal-content"
  );
  const message = modal.innerText();
  return message;
}

/**
 *
 * @param {import("@playwright/test").Page} page
 * @param {EDnf}  dfn - html attribute: data-field-name
 * @param {string} email
 * @param {string} password
 */
async function emailPwCreate(page, dnf, email, password) {
  if (page === null) {
    throw new Error("page is null");
  }
  if (typeof email !== "string") {
    throw new Error("email is not a string");
  }
  if (typeof password !== "string") {
    throw new Error("password is not a string");
  }

  if (email === null || email.trim() === "") {
    throw new Error("email is empty or null ");
  }
  if (password === null || password.trim() === "") {
    throw new Error("email is empty or null ");
  }

  await checkByDfn(page, dnf, true);
  await fillEmailPW(page, email, password);
}

async function fillEmailPW(page, email, password) {

  await fillInput(page, "id*='portalUserEmail'", email, 1);
  await fillInput(page, "name='portalUserNewPassword'", password);
  await fillInput(page, "name='portalUserConfirmedPassword'", password);
}

/**
 *
 * @param {import("@playwright/test").Page} page
 * @param {EDnf}  dfn - html attribute: data-field-name
 * @param {string} username
 * @param {string} password
 */
async function usernamePwCreate(page, username, password) {
  await fillInput(page, "name='portalUserUsername'", username);
  await fillInput(page, "name='portalUserNewPassword'", password);
  await fillInput(page, "name='portalUserConfirmedPassword'", password);
}

/**
 *
 * @param {import("@playwright/test").Page} page
 * @param {EDnf}  dnf - html attribute: data-field-name
 * @param {string} username - username or email
 * @param {string} password
 */
async function fillReturnUser(page, dnf, username, password) {
  if (page === null || page === undefined || typeof page !== "object") {
    throw new Error("page is null or undefined or not an object");
  }
  if (dnf === null || dnf === undefined || typeof dnf !== "string") {
    throw new Error("data field names is null or undefined or Enum type");
  }
  if (
    username.trim() === "" ||
    username === null ||
    username === undefined ||
    typeof username !== "string"
  ) {
    throw new Error("username is null or undefined or not a string");
  }
  if (
    password.trim() === "" ||
    password === null ||
    password === undefined ||
    typeof password !== "string"
  ) {
    throw new Error("password is null or undefined or not a string");
  }

  await page.waitForSelector(`[data-field='${dnf}']`);
  // await page.waitForTimeout(1000);
  console.log({password});
  await fillInput(page, "name='username'", "test@email.com");
  await fillInput(page, "id*='portalLoginPassword'", password);
}


/**
 * 
 * @param {Page} page 
 * @param {string} firstName 
 * @param {string} lastName 
 */
async function fillFirstLastName(page, firstName, lastName) {
  if(page === null || page === undefined || typeof page !== "object") {
    throw new Error("page is null or undefined or not an object");
  }
  if(firstName === null || firstName === undefined || typeof firstName !== "string") {
    throw new Error("firstName is null or undefined or not a string");
  }
  if(lastName === null || lastName === undefined || typeof lastName !== "string") {
    throw new Error("lastName is null or undefined or not a string");
  }

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
async function fillInput(page, cssSelector, value, index = 0) {
  if (page === null || page === undefined || typeof page !== "object") {
    throw new Error("page is null or undefined or not an object");
  }
  if (
    cssSelector.trim() === "" ||
    cssSelector === null ||
    cssSelector === undefined ||
    typeof cssSelector !== "string"
  ) {
    throw new Error("cssSelector is null or undefined or not a string");
  }
  if (cssSelector.includes("[") || cssSelector.includes("]")) {
    throw new Error("cssSelector should not contain [ or ] ");
  }
  if (
    index < 0 ||
    index === null ||
    index === undefined ||
    typeof index !== "number"
  ) {
    index = 0;
  }

  await page.locator(`input[${cssSelector}]`).nth(index).click();
  await page.keyboard.type(value);
  await page.keyboard.press("Tab");
}

/**
 *
 * @param {import('@playwright/test').Page} page - playwright Page, everything about interact with the webpage.
 * @param {String} url
 */
async function handleTC(page, url) {
  await page.goto(url);
  await page.getByRole("link", { name: "Report Online" }).click();
  await page.getByRole("button", { name: "Accept" }).click();
  return page;
}

export {
  captureSubmitMessage,
  checkByDfn,
  clickByDfn,
  confirmSubmit,
  emailPwCreate, fillEmailPW, fillFirstLastName, fillInput,
  fillReturnUser,
  handleTC,
  submit,
  usernamePwCreate
};

