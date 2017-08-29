/*
 * Copyright (c) SQS Limited 2017.
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

package com.sqs.common;

import com.sqs.core.sqslibs.WebLog;
import com.sqs.web.webdriver.DriverProvider;
import org.testng.IInvokedMethod;
import org.testng.IInvokedMethodListener;
import org.testng.ITestResult;

/**
 * WebDriverListener class to allow setting of browser and platform on a thread. Without the
 * listener here the browser gets set at the wrong part of the TestNG lifecycle and therefore cannot
 * run. This listener ensures it is set at the correct point in the lifecycle to be associated with
 * the correct thread.
 */
public class DriverListener implements IInvokedMethodListener {

  /** {@inheritDoc}. */
  @Override
  public void beforeInvocation(IInvokedMethod method, ITestResult testResult) {
    if (method.isTestMethod()) {
      WebLog.startTestCase(method.getTestMethod().getMethodName());
      WebLog.info("Setting browser");
      String browserName = System.getProperty("browser");
      DriverProvider.setBrowser(browserName);
      //      WebLog.info("Setting proxy");
      //      String proxy = method.getTestMethod().getXmlTest().getAllParameters().get("proxy");
      //      DriverProvider.setProxy(proxy);
      //      WebLog.info("Setting platform");
      //      String platform = method.getTestMethod().getXmlTest().getAllParameters().get("platform");
      //      DriverProvider.setPlatform(platform);
      WebLog.info("Starting browser");
      DriverProvider.initialize();
    }
  }

  /** {@inheritDoc}. */
  @Override
  public void afterInvocation(IInvokedMethod method, ITestResult testResult) {
    if (method.isTestMethod()) {
      WebLog.info("Stopping browser");
      DriverProvider.end();
      WebLog.endTestCase(method.getTestMethod().getMethodName());
    }
  }
}
