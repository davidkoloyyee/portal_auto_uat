import { Page } from "@playwright/test";

/**
 * 
* One-Way Portal
*
* | test | anonymous | add party | submit with file | username | email | password | first name | last name |
* | ---- | --------- | --------- | ---------------- | -------- | ----- | -------- | ---------- | --------- |
* | 1    | n         |           |                  |          |       |          | test1      | test1     |
* | 2    | y         |           |                  |          |       |          |            |           |
* | 3    |           | y         |                  |          |       |          |            |           |
* | 4    |           |           | y                |          |       |          |            |           |
 */
export default class OneWayPortal {
  #page: Page;
  #url: string;
  #username: string;
  #password: string;
  #email: string;

  /**
   * 
  * | test | anonymous | add party | submit with file | username | email | password | first name | last name |
  * | ---- | --------- | --------- | ---------------- | -------- | ----- | -------- | ---------- | --------- |
  * | 1    | n         |           |                  |          |       |          | test1      | test1     |
   */
  test1() {
    
  }
}