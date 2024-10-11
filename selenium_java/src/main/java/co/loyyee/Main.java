package co.loyyee;

import java.time.Duration;
import java.util.Scanner;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Main {

    private static final WebDriver driver = new ChromeDriver();

    private String url = "";
    private String username = "";
    private String pw = "";

    public static void main(String[] args) {

        Main main = new Main();
        try (Scanner sc = new Scanner(System.in)) {
            main.run(sc);
        } catch (Exception e) {
            System.err.println(e.getLocalizedMessage());
        } finally {
            // driver.quit();
        }
    }

    public void run(Scanner sc) {

        System.out.print("Client route: ");
        String client = sc.nextLine();
        url = "https://%s.i-sightuat.com".formatted(client.isEmpty() ? "test" : client);

        System.out.print("username(email): ");
        username = sc.nextLine();

        System.out.print("password: ");
        pw = sc.nextLine();

        System.out.println("Enter 1: /login\nEnter 2: /portal/reportonline");
        short choice = Short.parseShort(sc.nextLine());

        switch (choice) {
            case 1:
                url += "/login";
                login();
                break;
            case 2:
            default:
                url += "/portal/reportonline";
                portal();
                break;
        }
    }

    public void portal() {
        driver.get(url);
        var confirmLoc = By.cssSelector("button#confirm");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(ExpectedConditions.visibilityOfElementLocated(confirmLoc));
        driver.findElement(confirmLoc).click();
    }

    public void login() {
        driver.get(url);
        driver.findElement(By.cssSelector("input[name='username']")).sendKeys("isight");
        driver.findElement(By.cssSelector("input[name='password']")).sendKeys("123456");
        driver.findElement(By.id("login")).click();
    }
}
