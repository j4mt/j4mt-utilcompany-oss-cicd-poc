package com.sqs.steps;

import static org.hamcrest.MatcherAssert.assertThat;
import static ru.yandex.qatools.matchers.webdriver.TextMatcher.text;

import com.sqs.pageobjects.prestashop.PrestaHome;
import com.sqs.pageobjects.prestashop.PrestaSignIn;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import cucumber.runtime.java.guice.ScenarioScoped;

@ScenarioScoped
public class LoginSteps {

  private PrestaSignIn prestaSignIn;

  @Given("^I am on the login page$")
  public void iAmOnTheLoginPage() throws Throwable {
    prestaSignIn = new PrestaHome().header.navigateToPrestaSignIn();
  }

  @When("^I enter (.*) and (.*)$")
  public void iEnterEmailAndPassword(String email, String password) throws Throwable {
    prestaSignIn.signInto(email, password);
  }

  @Then("^the customer name displayed is (.*)$")
  public void theCustomerNameIsDisplayed(String realName) throws Throwable {
    assertThat(prestaSignIn.header.viewCustomerAccount, text(realName));
  }
}
