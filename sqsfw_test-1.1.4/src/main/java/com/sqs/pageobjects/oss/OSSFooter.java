package com.sqs.pageobjects.oss;

import com.sqs.common.PageObject;
import com.sqs.web.elements.Button;
import com.sqs.web.elements.TextInput;
import io.qameta.allure.Step;
import org.openqa.selenium.By;

/**
 * The Presta footer.
 */
public class OSSFooter extends PageObject {

    private final TextInput subscribeTextBox = new TextInput(By.name("email"));
    private final Button subscribeButtonSubmit = new Button(By.xpath("//*[@value='Subscribe']"));

    /**
     * Instantiates a new Presta footer.
     */
    public OSSFooter() {
        onPage();
    }

    @Override
    public void onPage() {
        // Add code here to ensure we're on the right page
    }

    /**
     * Presta Footer fill email presta footer.
     *
     * @param email the email
     * @return the presta footer
     */
    @Step("filling in subscribe email address: {0}")
    public OSSFooter prestaFooterFillEmail(String email) {
        subscribeTextBox.clearText();
        subscribeTextBox.setText(email);
        return this;
    }

    /**
     * Presta Footer click send presta footer.
     *
     * @return the presta footer
     */
    @Step("Clicking the send button")
    public OSSFooter prestaFooterClickSend() {
        subscribeButtonSubmit.click();
        return this;
    }

    /**
     * Presta Footer send email presta footer.
     *
     * @param email the email
     * @return the presta footer
     */
    @Step("Sending subscribe email address: {0}")
    public OSSFooter prestaFooterSendEmail(String email) {
        prestaFooterFillEmail(email);
        prestaFooterClickSend();
        return this;
    }
}
