package com.sqs.prestatests;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;
import static ru.yandex.qatools.matchers.webdriver.DisplayedMatcher.displayed;
import static ru.yandex.qatools.matchers.webdriver.TextMatcher.text;

import com.sqs.pageobjects.prestashop.PrestaHome;
import com.sqs.pageobjects.prestashop.PrestaSignIn;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

/** As a user I want to be able to log into the Presta shop. */
public class PrestaSignInTest extends PrestaBaseTest {

  // Sign in with valid details
  @Parameters("browser")
  @Test
  public void prestaSignInValidTest() {
    PrestaHome prestaHome = new PrestaHome();
    PrestaSignIn prestaSignIn =
        prestaHome.header.navigateToPrestaSignIn().signInto("dm@dm.com", "dermot");
    assertThat(prestaSignIn.header.viewCustomerAccount, text("Dermot Murray"));
  }

  // Sign in with invalid username and invalid password
  @Test
  public void prestaSignInInvalidBothTest() {
    PrestaHome prestaHome = new PrestaHome();
    PrestaSignIn prestaSignIn =
        prestaHome.header.navigateToPrestaSignIn().signInto("noaccount@no.com", "nosuchpassword");
    assertThat(prestaSignIn.errorMessage, displayed());
  }

  // Sign in with valid username and invalid password
  @Test
  public void prestaSignInInvalidPassTest() {
    PrestaHome prestaHome = new PrestaHome();
    PrestaSignIn prestaSignIn =
        prestaHome.header.navigateToPrestaSignIn().signInto("dm@dm.com", "nosuchpassword");
    assertThat(prestaSignIn.errorMessage, displayed());
  }

  // Sign in with invalid username and valid password
  @Test
  public void prestaSignInInvalidUserTest() {
    PrestaHome prestaHome = new PrestaHome();
    PrestaSignIn prestaSignIn =
        prestaHome.header.navigateToPrestaSignIn().signInto("noaccount@no.com", "dermot");
    assertThat(prestaSignIn.errorMessage, displayed());
  }

  // Sign in with blank and valid password
  @Test
  public void prestaSignInBlankUserTest() {
    PrestaHome prestaHome = new PrestaHome();
    PrestaSignIn prestaSignIn = prestaHome.header.navigateToPrestaSignIn().signInto("", "dermot");
    prestaSignIn.passwordBox.click();
    // Firefox
    assertThat(prestaSignIn.emailBox.getCssValue("box-shadow"), containsString("255, 0, 0"));
    // Edge
    // assertThat(prestaSignIn.emailBox.getCssValue("outline-color"), containsString("255, 0, 0"));
  }

  // Sign in with valid username and blank password
  @Test
  public void prestaSignInBlankPassTest() {
    PrestaHome prestaHome = new PrestaHome();
    PrestaSignIn prestaSignIn =
        prestaHome.header.navigateToPrestaSignIn().signInto("dm@dm.com", "");
    prestaSignIn.emailBox.click();
    // Firefox
    assertThat(prestaSignIn.passwordBox.getCssValue("box-shadow"), containsString("255, 0, 0"));
    // Edge
    // assertThat(prestaSignIn.emailBox.getCssValue("outline-color"), containsString("255, 0, 0"));
  }

  // Sign in with blank username and blank password
  @Test
  public void prestaSignInBlankBothTest() {
    PrestaHome prestaHome = new PrestaHome();
    PrestaSignIn prestaSignIn = prestaHome.header.navigateToPrestaSignIn().signInto("", "");
    prestaSignIn.passwordBox.click();
    // Firefox
    assertThat(prestaSignIn.emailBox.getCssValue("box-shadow"), containsString("255, 0, 0"));
    // Edge
    // assertThat(prestaSignIn.emailBox.getCssValue("outline-color"), containsString("255, 0, 0"));
  }
}
