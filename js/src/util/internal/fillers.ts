import { Locator, Page } from "@playwright/test";
import { EInputNames } from "../enums";

export async function fillAllSelectRand(page: Page) {

  for (const select of await page.locator("select").all()) {
    if (await select.isVisible()) {
      const options = await select.locator("option").all();
      let rand = Math.floor(Math.random() * (options.length - 1)) + 1;
      await select.selectOption({ index: rand });
    }
  }
}

export async function fillInputFake(page: Page, url: string) {
  for (const textInput of await page.locator("input[type='text']").all()) {
    let exclude = ['due',]
    if (!exclude.find(async el => el === await textInput.getAttribute("name"))) {
      if (await textInput.isVisible()) {
        if (await textInput.inputValue() === "" && await page.locator(`input[${EInputNames.phoneNumber}]`).inputValue() !== "") {
          textInput.fill(new Date() + " " + url);
        }
      }
    }
  }
}

export async function fillTextboxFake(page: Page, url: string) {

  for (let tb of await page.getByRole("textbox").all()) {
    await tb.fill(new Date() + " " + url);
  }
}


async function select(select: Locator) {
  // get type of select
  if (await select.isVisible()) {
    const options = await select.locator("option").all();
    let rand = Math.floor(Math.random() * (options.length - 1)) + 1;
    await select.selectOption({ index: rand });
  }
}

async function combobox(page: Page, input: Locator) {

  // if we check the "role" is "combobox" we will click the parent, then select from sibiling of the parent.
  const role = await input.getAttribute("role")
  if (role === null || role !== "combobox") return page;

  const id = await input.getAttribute("id");
  if (id?.includes("email")) {
    // email
    await input.click();
    await page.keyboard.type("dko@caseiq.com");
    await page.keyboard.press("Enter");

    const parentXpath = `xpath=//input[@id='${id}']/parent::*`;
    const parent = page.locator(parentXpath);
    const target = parent.locator(`${parentXpath}/following-sibling::*`).locator("div[role='option']").first()

    if (await target.isVisible()) {
      await target.click();
    } else {
      await page.waitForTimeout(500);
      await target.click();
    }
    return page;

  } else if (id?.includes("selectized")) {
    //with search user
    if ((await input.getAttribute("placeholder"))?.includes("users")) {
      return await searchUser(page, input, id);
    } else {
      // multi-picklist
      // select with input
      const target = page.locator(`xpath=//input[@id='${id}']`);
      const parentXpath = `xpath=//input[@id='${id}']/parent::*`;
      const parent = page.locator(parentXpath);

      console.log(await parent.getAttribute("class"))
      const items = await parent.locator("div.item").all();
      console.log(items.length)
      if (items.length > 0) {
        return page;
      }

      if (await target.isVisible()) {
        await parent.click();
        console.log("CLICKL!!!✅")
        await page.waitForTimeout(500);

        // if (await parent.isVisible()) {
        // await parent.click();
        const options = await parent.locator(`${parentXpath}/following-sibling::*`).locator("div[role='option']").all();
        console.log("Options len: ", options.length);
        if (await options[0].isVisible()) {
          const randIdx = Math.floor(Math.random() * options.length) + 1;
          const rand = options[randIdx];
          await rand.click();
        }
        return page;
      }
    }
  }
}

async function searchUser(page: Page, input: Locator, id: string) {

  console.log("SAERCH USER!!!!!!")
  await input.click();
  await page.keyboard.type("dko@caseiq.com")

  // const target = page.locator(`xpath=//input[@id='${id}']`);
  const parentXpath = `xpath=//input[@id='${id}']/parent::*`;
  const parent = page.locator(parentXpath);
  const target = parent.locator(`${parentXpath}/following-sibling::*`).locator("div[role='option']").first()

  if (await target.isVisible()) {
    console.log("visible")
    await target.click();
  } else {
    console.log("NOT visible")
    await page.waitForTimeout(500);
    await target.click();
  }

  // await page.keyboard.press("Enter")
  return page;
}

async function email(page: Page, input: Locator, email: string) {

}

export const Fill = {
  combobox,
  select
}
