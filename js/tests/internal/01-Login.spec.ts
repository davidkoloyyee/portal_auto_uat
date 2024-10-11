
/**
 * A Test Group on Login Page
 */

import test, { expect } from "@playwright/test";
import * as process from "node:process";
import { checkIntroJs, login } from "../../src/util/core-fn";

test.describe("Login UAT tests", () => {

  let url = new URL(process.env.URL).origin;
  let username = process.env.USER;
  let password = process.env.PW;

  test.beforeEach("going to login", async({ page }) => {
    await page.goto(url + "/login");

  });

  test("should be successful", async ({ page }) => {
    const signInTitle: string = await page.title();
    expect(signInTitle).toBe("i-Sight: Sign In");

    await login(page, { username, password });
    await page.waitForTimeout(10000);

    const postLoginTitle: string = await page.title();
    expect(postLoginTitle).toBe("i-Sight | Home");

  })

  test("should failed without username", async ({ page }) => {
    await page.goto(url + "/login");
    await login(page, { username: "", password });

    await page.waitForSelector("p.bg-danger");
    const message = await page.getByRole("alert").textContent();
    expect(message).toBe("Missing credentials");
  });

  test("should failed without password", async ({ page }) => {
    await page.goto(url + "/login");
    await login(page, { username, password: "" });

    await page.waitForSelector("p.bg-danger");
    const message = await page.getByRole("alert").textContent();
    expect(message).toBe("Missing credentials");
  });

  test("check introJS", async ({ page }) => {

    await login(page, { username, password});
    await page.waitForTimeout(10000);
    await checkIntroJs(page);
  })
});