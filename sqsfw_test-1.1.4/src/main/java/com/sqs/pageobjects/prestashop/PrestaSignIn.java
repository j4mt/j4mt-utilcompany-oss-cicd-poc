package com.sqs.pageobjects.prestashop;

import com.sqs.core.sqslibs.WebLog;
import com.sqs.web.elements.Button;
import com.sqs.web.elements.Label;
import com.sqs.web.elements.TextInput;
import io.qameta.allure.Step;
import org.openqa.selenium.By;

/** The Presta sign in page. */
public class PrestaSignIn extends PrestaBasePage {

  /** The Error message. */
  public final Label errorMessage = new Label(By.xpath("//*[text()='Authentication failed.']"));
  /** The Email box. */
  public final TextInput emailBox =
      new TextInput(By.xpath("//*[@id='login-form']//*[@name='email']"));
  /** The Password box. */
  public final TextInput passwordBox = new TextInput(By.name("password"));

  private final Button signInButton = new Button(By.xpath("//*[@id='login-form']/footer/button"));

  /** Instantiates a new Presta sign in page. */
  public PrestaSignIn() {
    onPage();
  }

  @Override
  public void onPage() {
    // Add code here to determine if we're on the right page
  }

  /**
   * Input sign in details.
   *
   * @param email the email
   * @param password the password
   * @return the presta sign in page
   */
  @Step("Inputting username: {0} and password {1}")
  public PrestaSignIn inputSignInDetails(String email, String password) {
    WebLog.info("Inputting " + email + " and " + password);
    emailBox.clearText();
    passwordBox.clearText();
    emailBox.setText(email);
    passwordBox.setText(password);
    return this;
  }

  /**
   * Click sign in button.
   *
   * @return the presta sign in page
   */
  @Step("Clicking sign in button")
  public PrestaSignIn clickSignInButton() {
    WebLog.info("Clicking sign in button");
    signInButton.click();
    return this;
  }

  /**
   * Sign in to presta.
   *
   * @param email the email
   * @param password the password
   * @return the presta sign in page
   */
  @Step("Signing in with username: {0} and password {1}")
  public PrestaSignIn signInto(String email, String password) {
    WebLog.info("Logging in with " + email + " and " + password);
    inputSignInDetails(email, password);
    clickSignInButton();
    return this;
  }
}
