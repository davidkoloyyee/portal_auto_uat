
import { chromium } from "@playwright/test";
import * as readline from 'node:readline';

function prompt() {
  let url = "";
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("what's url?", (name : string)=> {
    url = name;
    console.log("hello " + url);
    rl.close();
  });
  return url;
}

async function runTest() {
  let url = prompt();
  console.log("launching chromium");
  const browser = await chromium.launch();  // Or 'firefox' or 'webkit'.
  const page = await browser.newPage();
  await page.goto('https://playwright.dev/');
}

function main() {

(async () => {
  await runTest();
})();
}

main();
