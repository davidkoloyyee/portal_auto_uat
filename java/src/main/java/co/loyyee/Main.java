package co.loyyee;

import java.nio.file.Paths;
import java.util.Scanner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.Tracing;

import co.loyyee.utils.CoreFn;

public class Main {

	private static final Logger log = LoggerFactory.getLogger(CoreFn.class);

	public static void main(String[] args) {

		Main main = new Main();
		try (Scanner sc = new Scanner(System.in)) {
			System.out.print("Which url?: ");
			String url = sc.nextLine();
			System.out.print("Headless T or F?: ");
			boolean headed = sc.nextLine().toLowerCase().charAt(0) == 't';

			short site;
			if (url.contains("login")) {
				site = 1;
			} else if (url.contains("portal")) {
				site = 2;
			} else {
				System.out.println("Enter 1: /login\nEnter 2: /portal");
				site = Short.parseShort(sc.nextLine());
			}
			main.run(url, headed, site);
		}
	}
	/***
	 * 
	class Pretest {
		static String url;
		static boolean headed;
		static short site;

		private Pretest(String url, boolean headed, short site) {
		}

		public static void ask() {
			try (Scanner sc = new Scanner(System.in)) {
				System.out.print("Which url?: ");
				url = sc.nextLine();
				System.out.print("Headless T or F?: ");
				headed = sc.nextLine().toLowerCase().charAt(0) == 't';

				if (url.contains("login")) {
					site = 1;
				} else if (url.contains("portal")) {
					site = 2;
				} else {
					System.out.println("Enter 1: /login\nEnter 2: /portal");
					site = Short.parseShort(sc.nextLine());
				}
			}
		}

	} 
	**/

	void run(String inputUrl, boolean headed, short site) {
		String url = inputUrl.isEmpty() ? "https://plab08.i-sightlab.com/portal" : fn.urlProcess(inputUrl);
		url += switch (site) {
			case 1 -> "/login";
			default -> "/portal/reportonline";
		};

		System.out.println(url);

		try (Playwright playwright = Playwright.create()) {
			Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(headed));
			BrowserContext context = ctxStart(browser);

			Page page = context.newPage();
			CoreFn fn = new CoreFn(page);
			fn.handleTC(url);
			fn.fillAllTextInputs();

			ctxStop(context);
		}
	}

	BrowserContext ctxStart(Browser browser) {
		BrowserContext context = browser.newContext();
		context.tracing().start(new Tracing.StartOptions()
				.setScreenshots(true)
				.setSnapshots(true)
				.setSources(true));
		return context;
	}

	void ctxStop(BrowserContext context) {
		context.tracing().stop(new Tracing.StopOptions()
				.setPath(Paths.get("trace.zip")));
	}

}