/**
 * 
 * The Goal for this test is to perform a robust, flexible, regression testing for portal,
 * to achieve that we will be targeting the classes, the html tags rather than specific title or text.
 * 
 * Although Playwright supports getByRole, GetByTitle, etc, but it seems to not reliable for the use cases,
 * so I will be relying much on the css-selector and xpath, however, getByRole or other methods are not excluded.
 * 
 */


/**
 * this is handle common two-way portal. <br>
 *
 * Theses tests are based on the Excel file.
 *
 * *** All T&C are accepted in the beforeEach ***
 *
 * *** There is no submit is because all submits are handled in test.AfterEach ***
 *
 *  test  | anonymous | returning | update | username | email          | password   | first name | last name |
 *   1    |   y       |   n       |   n    |          |                |            |            |           |
 *   2    |   y       |   n       |   y    | test2    |                | Test1@$%^ |            |           |
 *   3    |   y       |   n       |   y    |          |test@example.com| Test1@$%^ |            |           |
 *   4    |   y       |   y       |        |  test2   |                | Test1@$%^ |            |           |
 *   5    |   n       |   n       |   n    |          |                |            | test5      |  test5    |
 *   6    |   n       |   n       |   y    |          |test@example.com| Test1@$%^ | test6      | test6     |
 *   7    |   n       |   y       |        |          |test@example.com| Test1@$%^ | test7      | test7     |
 *   8    |   n       |   y       |        |  test2   |                | Test1@$%^ | test7      | test7     |
 */

