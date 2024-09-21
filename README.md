# Automation UAT test for One/Two-Way Portal (v8.0+)

There are 2 libraries in this repo:

1. [Cypress](https://www.cypress.io/app):
   1. suppport language: JavaScript, TypeScript
   2. support browsers: Chromium, Firefox, Electron
2. [Playwright](https://playwright.dev/docs/intro):
   1. support languages: JavaScript, TypeScript, Python, Java, C#.
   2. support browsers: Chromium, Firefox, Safari, (Andriod)

# Introduction

CaseIQ upgrade team is helping existing client upgrading from older version to v9.x, many of our current client will have upgrade the Portal section of the application, rather than just manually test and validate, this repo is attempting to run automated testing to boost productivity and raise the quality of our application.

# How to Run the Tests?

#### Playwright

Most basic: `npx playwright test`

UI: `npx playwright test --ui`

With browser: `npx playwright test --headed`

Running specific file:

`npx playwright test tests/[to/your/file]`

Running specific directory:

`npx playwright test tests/[to/your/directory]`

### Cypress

`pnpm cypress open` or `npx cypress open`

`pnpm run cy:open` or `npm run cy:open`

kk

---

This repo is running on [pnpm](https://pnpm.io), but if you want to install the package with `npm` or `yarn` it should be just `npm install` or `yarn install .`

# Goal

Perform automated testing to check if the case has been submitted successfully.

A List of Test need to be Performed

Two-Way Portal

| test | anonymous | returning | update | username | email            | password   | first name | last name |
| ---- | --------- | --------- | ------ | -------- | ---------------- | ---------- | ---------- | --------- |
| 1    | y         | n         | n      |          |                  |            |            |           |
| 2    | y         | n         | y      | test2    |                  | Test1@#$%^ |            |           |
| 3    | y         | n         | y      |          | test@example.com | Test1@#$%^ |            |           |
| 4    | y         | y         |        | test2    |                  | Test1@#$%^ |            |           |
| 5    | n         | n         | n      |          |                  |            | test5      | test5     |
| 6    | n         | n         | y      |          | test@example.com | Test1@#$%^ | test6      | test6     |
| 7    | n         | y         |        |          | test@example.com | Test1@#$%^ | test7      | test7     |
| 8    | n         | y         |        | test2    |                  | Test1@#$%^ | test7      | test7     |

One-Way Portal

| test | anonymous | add party | submit with file | username | email | password | first name | last name |
| ---- | --------- | --------- | ---------------- | -------- | ----- | -------- | ---------- | --------- |
| 1    | n         |           |                  |          |       |          | test1      | test1     |
| 2    | y         |           |                  |          |       |          |            |           |
| 3    |           | y         |                  |          |       |          |            |           |
| 4    |           |           | y                |          |       |          |            |           |

Internal Case

| test | add party | edit + save case | username | password |
| ---- | --------- | ---------------- | -------- | -------- |
| 1    | y         |                  | depends  | depends  |
| 2    |           | y                | depends  | depends  |
