package com.sqs.pageobjects.oss;

import com.sqs.web.elements.Label;
import com.sqs.web.webdriver.DriverProvider;
import org.openqa.selenium.By;

/**
 * The Presta home page.
 */
public class OSSHome extends OSSBasePage {

    private static final String URL = "http://localhost:8082//";
    private Label signupLabel = new Label(By.linkText("Please signup"));

    /**
     * Instantiates a new Presta home.
     */
    public OSSHome() {
        DriverProvider.getDriver().get(URL);
        //Ensure we are on the correct page
        onPage();
    }

    public Label getSignupLabel() {
        return signupLabel;
    }

    @Override
    public void onPage() {
        signupLabel.isDisplayed();
    }
}
