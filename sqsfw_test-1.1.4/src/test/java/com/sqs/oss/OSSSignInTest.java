package com.sqs.oss;

import com.sqs.pageobjects.oss.OSSHome;
import com.sqs.pageobjects.oss.OSSSignIn;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static ru.yandex.qatools.matchers.webdriver.DisplayedMatcher.displayed;
import static ru.yandex.qatools.matchers.webdriver.TextMatcher.text;

/**
 * As a user I want to be able to log into the Presta shop.
 */
public class OSSSignInTest extends OSSBaseTest {

    // Sign in with valid details
    @Parameters("browser")
    @Test
    public void ossSignInValidTest() {
        OSSHome ossHome = new OSSHome();
        OSSSignIn ossSignIn =
                ossHome.header.navigateToOSSSignIn().signInto("john.orourke@sqs.com", "123456");
        assertThat(ossSignIn.header.viewCustomerAccount, text("Please signup"));
    }

    // Sign in with valid username and invalid password
    @Test
    public void ossSignInInvalidPassTest() {
        OSSHome ossHome = new OSSHome();
        OSSSignIn ossSignIn =
                ossHome.header.navigateToOSSSignIn().signInto("john.orourke@sqs.com", "nosuchpassword");
        assertThat(ossSignIn.errorMessage, displayed());
    }

}
