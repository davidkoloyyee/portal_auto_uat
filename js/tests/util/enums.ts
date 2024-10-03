/**
 * EDfn - Enum of Data Field Names, corresponding to the Portal page radio groups
 * @enum {string}
 * @property {string} anon - Represents the field name for reporting anonymously. Possible value: "reportedAnonymously".
 * @property {string} returning - Represents the field name for returning portal users. Possible value: "isReturningPortalUser".
 * @property {string} update - Represents the field name for creating a portal user account. Possible value: "createPortalUserAccount".
 * @property {string} provideCred - Represents the field name for providing email credentials. Possible value: "portalUserProvideEmail".
 */
export const EDfn = Object.freeze({
  anon: "reportedAnonymously",
  returning: "isReturningPortalUser",
  update: "createPortalUserAccount",
  provideEmail: "portalUserProvideEmail",
  loginUsernameEmail: "portalLoginUsernameEmail",
});

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
});