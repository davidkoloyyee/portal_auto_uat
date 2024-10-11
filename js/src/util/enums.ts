/**
 * EDfn - Enum of Data Field Names, corresponding to the Portal page radio groups
 * @enum {string}
 * @property {string} anon - Represents the field name for reporting anonymously. Possible value: "reportedAnonymously".
 * @property {string} returning - Represents the field name for returning portal users. Possible value: "isReturningPortalUser".
 * @property {string} update - Represents the field name for creating a portal user account. Possible value: "createPortalUserAccount".
 * @property {string} provideEmail - Represents the field name for providing email credentials. Possible value: "portalUserProvideEmail".
 * @property {string} loginUsernameEmail - Represents the field name for login username or email. Possible value: "portalLoginUsernameEmail".
 */
export const EDfn = Object.freeze({
  anon: "reportedAnonymously",
  returning: "isReturningPortalUser",
  update: "createPortalUserAccount",
  provideEmail: "portalUserProvideEmail",
  loginUsernameEmail: "portalLoginUsernameEmail",
});


/**
 * EInputNames - Enum of Input Names used in the Portal page forms
 * @enum {string}
 * @property {string} username - Represents the input name for the portal user username. Possible value: "name='portalUserUsername'".
 * @property {string} password - Represents the input name for the portal user new password. Possible value: "name='portalUserNewPassword'".
 * @property {string} confirmPassword - Represents the input name for confirming the portal user password. Possible value: "name='portalUserConfirmedPassword'".
 * @property {string} idEmailWild - Represents the input id pattern for the portal user email. Possible value: "id*='portalUserEmail'".
 * @property {string} loginUsername - Represents the input name for the login username. Possible value: "name='username'".
 * @property {string} loginPassword - Represents the input name for the login password. Possible value: "name='password'".
 * @property {string} returnUsername - Represents the input name for the returning username. Possible value: "name='username'".
 * @property {string} returnPwWild - Represents the input id pattern for the returning password. Possible value: "id*='portalLoginPassword'".
 * @property {string} calendarDMY - Represents the input placeholder for the calendar date in DD-MMM-YYYY format. Possible value: "input[placeholder='DD-MMM-YYYY']".
 * @property {string} datepicker - Represents the input name pattern for date pickers. Possible value: "input[name*='date']".
 * @property {string} provideCred - Represents the field name for providing email credentials. Possible value: "portalUserProvideEmail".
 */
export const EInputNames = Object.freeze({
  username : "name='portalUserUsername'",
  password : "name='portalUserNewPassword'",
  confirmPassword: "name='portalUserConfirmedPassword'",
  idEmailWild: "id*='portalUserEmail'",
  loginUsername: "name='username'",
  loginPassword: "name='password'",
  returnUsername: "name='username'",
  returnPwWild: "id*='portalLoginPassword'",
  calendarDMY: "input[placeholder='DD-MMM-YYYY']",
  datepicker: "input[name*='date']",
  countryCode :"name='countryCode'",
  phoneNumber: "aria-label='Phone Number'",
});