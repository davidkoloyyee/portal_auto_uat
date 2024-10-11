
import { chromium } from "@playwright/test";
import * as readlineSync from "readline-sync";

async function runTest() {
  
  let url = readlineSync.question("What's the url?");
  console.log("launching chromium");
  const browser = await chromium.launch({ headless : false});  // Or 'firefox' or 'webkit'.
  const page = await browser.newPage();
  await page.goto(url);

  await browser.close();
}

function main() {
  runTest();
}

main();
