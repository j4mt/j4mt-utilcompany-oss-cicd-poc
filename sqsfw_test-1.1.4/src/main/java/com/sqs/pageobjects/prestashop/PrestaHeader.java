package com.sqs.pageobjects.prestashop;

import com.sqs.common.PageObject;
import com.sqs.web.elements.Button;
import com.sqs.web.elements.Hyperlink;
import com.sqs.web.elements.TextArea;
import io.qameta.allure.Step;
import org.openqa.selenium.By;

/** The Presta header. */
public class PrestaHeader extends PageObject {

  /** The View customer account link. */
  public final Hyperlink viewCustomerAccount = new Hyperlink(By.className("account"));
  /** The Sign in button. */
  private final Button signIn = new Button(By.xpath("//*[@id='_desktop_user_info']/div/a/span"));

  private final Button viewCart = new Button(By.xpath("//*[@id='_desktop_cart']/div"));
  private final Hyperlink contactUs = new Hyperlink(By.xpath("//*[@id='contact-link']/a"));
  private final TextArea searchTextBox = new TextArea(By.name("s"));
  private final Button searchButtonSubmit = new Button(By.xpath("//button[@type='submit']"));

  /** Instantiates a new Presta header. */
  public PrestaHeader() {
    onPage();
  }

  @Override
  public void onPage() {
    // Add code in here to determine whether we're on the right page
  }

  /**
   * Navigate to presta sign in presta sign in.
   *
   * @return the presta sign in
   */
  @Step("Navigation to the sign in presta page")
  public PrestaSignIn navigateToPrestaSignIn() {
    signIn.click();
    return navigatingTo(PrestaSignIn.class);
  }

  /**
   * Navigate to presta contact us presta contact us.
   *
   * @return the presta contact us
   */
  @Step("Navigation to the contact us presta page")
  public PrestaContactUs navigateToPrestaContactUs() {
    contactUs.click();
    return navigatingTo(PrestaContactUs.class);
  }

  /**
   * Presta header fill email presta header.
   *
   * @param search the search
   * @return the presta header
   */
  @Step("Filling in search criteria: {0}")
  public PrestaHeader prestaHeaderFillEmail(String search) {
    searchTextBox.clearText();
    searchTextBox.setText(search);
    return this;
  }

  /**
   * Presta header click send presta header.
   *
   * @return the presta header
   */
  @Step("Clicking of search button}")
  public PrestaHeader prestaHeaderClickSend() {
    searchButtonSubmit.click();
    return this;
  }

  /**
   * Presta header send email presta header.
   *
   * @param search the search
   * @return the presta header
   */
  @Step("Sending of search criteria: {0}")
  public PrestaHeader prestaHeaderSendEmail(String search) {
    prestaHeaderFillEmail(search);
    prestaHeaderClickSend();
    return this;
  }
}
