from selenium import webdriver
from selenium.webdriver.common.by import By


def sample():
  driver = webdriver.Chrome()
  driver.get("https://transunionuscms2.i-sightuat.com/portal/reportonline")

  title = driver.title

  print(title)

  driver.implicitly_wait(0.5)

  text_box = driver.find_element(by=By.NAME, value="my-text")
  submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")

  text_box.send_keys("Selenium")
  submit_button.click()

  message = driver.find_element(by=By.ID, value="message")
  text = message.text

  driver.quit()

def main():
  sample()

if (__name__ == "__main__"):
  main()