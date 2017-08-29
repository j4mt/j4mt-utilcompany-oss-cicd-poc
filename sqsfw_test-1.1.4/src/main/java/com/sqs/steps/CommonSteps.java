package com.sqs.steps;

import com.sqs.core.sqslibs.WebLog;
import cucumber.api.Scenario;
import cucumber.api.java.After;
import cucumber.api.java.Before;

public class CommonSteps {

  /** Pre test setup. Starting driver, logging etc... */
  @Before
  public void startUp() {
    WebLog.startTestCase("Start");
  }

  /** clean up after tests. */
  @After
  public void cleanUp(Scenario scenario) {
    //    if (scenario.isFailed()) {
    //      byte[] screenshotScenario = Screenshot.getScreenshot(scenario.getName(),
    //          new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss-SSS")
    //              .format(new GregorianCalendar().getTime()));
    //
    //      scenario.embed(screenshotScenario, "image/png");
    //    }
    WebLog.endTestCase("End");
  }
}
