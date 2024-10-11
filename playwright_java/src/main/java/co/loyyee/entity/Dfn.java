package co.loyyee.entity;

/**
 * Dfn( html attribute data-field-name="xxxxx"
 */
public enum Dfn {
  anon("reportedAnonymously"),
  returning("isReturningPortalUser"),
  update("createPortalUserAccount"),
  provideEmail("portalUserProvideEmail"),
  loginUsernameEmail("portalLoginUsernameEmail");

  private final String value;

  Dfn(String attributeValue) {
    this.value = attributeValue;
  }

  public String value() {
    return this.value;
  }
}
