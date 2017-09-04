package com.sqs.oss;

import com.sqs.core.sqslibs.WebLog;
import org.testng.ITestContext;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;

/**
 * The Presta base test.
 */
public abstract class OSSBaseTest {
    @Parameters("browser")
    @BeforeTest
    protected void setupTest(@Optional("firefox") String browser, ITestContext context) {
        WebLog.startTestCase(context.getName());
    }

    /**
     * Tear down.
     *
     * @param context the context for the test case
     */
    @AfterTest
    protected void tearDownTest(ITestContext context) {
        WebLog.endTestCase(context.getName());
    }
}
