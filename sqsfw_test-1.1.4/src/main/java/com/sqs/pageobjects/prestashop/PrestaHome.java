package com.sqs.pageobjects.prestashop;

import com.sqs.web.elements.Hyperlink;
import com.sqs.web.webdriver.DriverProvider;
import org.openqa.selenium.By;

/** The Presta home page. */
public class PrestaHome extends PrestaBasePage {

  private static final String URL = "http://msdn-dev-build2.pd.group.intl:8080/prestashop/";
  private final Hyperlink prestaLogo = new Hyperlink(By.xpath("//*[@id='_desktop_logo']/a/img"));

  /** Instantiates a new Presta home. */
  public PrestaHome() {
    DriverProvider.getDriver().get(URL);
    //Ensure we are on the correct page
    onPage();
  }

  @Override
  public void onPage() {
    prestaLogo.isDisplayed();
  }
}
