import test from "@playwright/test";
import { env } from "node:process";
import { addParty, handleTC } from "../util/portal";

let url: string = env.URL || "https://plab08.i-sightlab.com/portal";

test.describe("upload", () => {
  test.beforeEach(async ({ page }) => {
    await handleTC(page, url);
  })
  test("add party", async ({ page }) => {
    await addParty(page);
  })
})