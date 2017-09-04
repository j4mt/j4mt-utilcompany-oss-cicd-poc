package com.sqs.pageobjects.oss;

import com.sqs.common.PageObject;
import com.sqs.web.elements.Button;
import com.sqs.web.elements.Hyperlink;
import com.sqs.web.elements.TextArea;
import io.qameta.allure.Step;
import org.openqa.selenium.By;

/**
 * The Presta header.
 */
public class OSSHeader extends PageObject {

    /**
     * The View customer account link.
     */
    public final Hyperlink viewCustomerAccount = new Hyperlink(By.className("account"));
    /**
     * The Sign in button.
     */
    private final Button signIn = new Button(By.xpath("//*[@id='_desktop_user_info']/div/a/span"));
    private final TextArea searchTextBox = new TextArea(By.name("s"));
    private final Button searchButtonSubmit = new Button(By.xpath("//button[@type='submit']"));

    /**
     * Instantiates a new Presta header.
     */
    public OSSHeader() {
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
    public OSSSignIn navigateToOSSSignIn() {
        signIn.click();
        return navigatingTo(OSSSignIn.class);
    }


    /**
     * Presta header fill email presta header.
     *
     * @param search the search
     * @return the presta header
     */
    @Step("Filling in search criteria: {0}")
    public OSSHeader ossHeaderFillEmail(String search) {
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
    public OSSHeader ossHeaderClickSend() {
        searchButtonSubmit.click();
        return this;
    }
}
