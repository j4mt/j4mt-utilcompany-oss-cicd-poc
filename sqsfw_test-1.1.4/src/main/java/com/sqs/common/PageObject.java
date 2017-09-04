package com.sqs.common;

import com.sqs.core.sqslibs.WebLog;
import io.qameta.allure.Step;
import org.hamcrest.Matcher;

import static org.hamcrest.MatcherAssert.assertThat;

/**
 * Base page object.
 */
public abstract class PageObject {

    /**
     * method that instantiates a new page object and verifies the page has loaded.
     *
     * @param aclass the page object class to instantiate
     * @param <D>    the page object class to instantiate
     * @return the page object class
     */
    public <D extends PageObject> D navigatingTo(Class<D> aclass) {
        D newPage = null;
        try {
            WebLog.info("Navigating to page: '" + aclass.getSimpleName() + "'");
            newPage = aclass.newInstance();
            //Ensure we are on the correct page
            newPage.onPage();
        } catch (Exception ex) {
            WebLog.info(
                    "Unable to navigate to page: '"
                            + aclass.getSimpleName()
                            + "' due to exception: "
                            + ex.toString());
        }
        return newPage;
    }

    @Step("Asserting that element: {0}")
    public <T> void assertThatElement(String info, T actual, Matcher<? super T> matcher) {
        assertThat(info, actual, matcher);
    }

    public abstract void onPage();
}
