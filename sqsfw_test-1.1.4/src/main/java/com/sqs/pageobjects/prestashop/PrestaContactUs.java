package com.sqs.pageobjects.prestashop;

import com.sqs.web.elements.Button;
import com.sqs.web.elements.Select;
import com.sqs.web.elements.TextArea;
import com.sqs.web.elements.TextInput;
import io.qameta.allure.Step;
import org.openqa.selenium.By;

/** The Presta contact us page. */
public class PrestaContactUs extends PrestaBasePage {

  private final Select subjectDropDown = new Select(By.xpath("//*[@name='id_contact']"));
  private final TextInput emailAddress = new TextInput(By.xpath("//*[@name='from']"));
  private final TextArea message = new TextArea(By.xpath("//*[@name='message']"));
  private final Button send = new Button(By.xpath("//*[@name='submitMessage']"));

  //Instantiates a new Presta contact us page.
  public PrestaContactUs() {
    onPage();
  }

  @Override
  public void onPage() {
    // Add code here to determine if we're on the right page.
  }

  /**
   * Fill in contact us form.
   *
   * @param subject the subject
   * @param email the email
   * @param messageToSend the message to send
   * @return the presta contact us page
   */
  @Step("filling in the contact form with subject: {0} , email: {1} and message: {2}")
  public PrestaContactUs fillInContactForm(String subject, String email, String messageToSend) {
    subjectDropDown.selectByText(subject);
    emailAddress.setText(email);
    message.setText(messageToSend);
    return this;
  }

  /**
   * Send contact us form.
   *
   * @return the presta contact us page
   */
  @Step("Click the contact button")
  public PrestaContactUs sendContactForm() {
    send.click();
    return this;
  }

  /**
   * Fill in and send contact us form.
   *
   * @param subject the subject
   * @param email the email
   * @param messageToSend the message to send
   * @return the presta contact us page
   */
  @Step("Sending form with subject: {0} , email: {1} and message: {2}")
  public PrestaContactUs fillInAndSendContactForm(
      String subject, String email, String messageToSend) {
    fillInContactForm(subject, email, messageToSend);
    return sendContactForm();
  }
}
