package co.loyyee.utils;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

import co.loyyee.entity.Dfn;

public class CoreFn {
  private static final Logger log = LoggerFactory.getLogger(CoreFn.class);
  private final Page page;

  public CoreFn(Page page) {
    this.page = page;
  }

  public void handleTC(String url) {

    page.navigate(url);
    page.locator("button#confirm").click();
  }

  public String urlProcess(String inputUrl) {
    try {
      URL url = new URI(inputUrl).toURL();
      return url.getProtocol() + "://" + url.getHost();

    } catch (MalformedURLException | URISyntaxException ex) {
      log.error(ex.getLocalizedMessage());
    }
    return inputUrl;
  }

  public void fillInput(String cssSelector, String value) {
    page.locator("input[%s]".formatted(cssSelector)).click();
    page.keyboard().type(value);
    page.keyboard().press("Tab");
  }

  public void fillInput(Page page, Locator locator, String value) {
    locator.click();
    page.keyboard().type(value);
    page.keyboard().press("Tab");
  }

  public void checkRadioByDnf(Dfn dfn, boolean yesOrNo) {
    page.locator("[data-field-name='%s'] input[value='%s']".formatted(dfn.value(), yesOrNo ? "yes" : "no")).check();
  }

  /**
   * Get all the text input back and linear fill with value.
   * Calendar is not ready.
   * 
   * @param page
   */
  public void fillAllTextInputs() {
    String text = "input[type='text']";
    List<Locator> locs = page.locator(text).all();
    for (Locator locator : locs) {
      fillInput(page, locator, "hello world");
    }
  }
}
