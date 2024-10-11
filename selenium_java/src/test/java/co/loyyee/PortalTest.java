package co.loyyee;

import java.time.Duration;
import java.util.Scanner;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.Test;

public class PortalTest {
  private final WebDriver driver = new ChromeDriver();
  private String url;

  // @BeforeMethod
  void setup() {

    try (Scanner sc = new Scanner(System.in)) {
      String client = sc.nextLine();
      url = "https://%s.i-sightuat.com/".formatted(client.isEmpty() ? "test" : client);
      driver.get(url);

    } catch (Exception e) {
    }
  }

  @Test
  void sanity() {
    driver.get("https://test.i-sightuat.com/portal/reportonline");
    By confirmLoc = By.cssSelector("button#confirm");
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    // wait.until(ExpectedConditions.visibilityOfElementLocated(confirmLoc));
    wait.until(ExpectedConditions.visibilityOf(driver.findElement(confirmLoc)));
    driver.findElement(confirmLoc).click();
    System.out.println(driver.getTitle());
  }


}
