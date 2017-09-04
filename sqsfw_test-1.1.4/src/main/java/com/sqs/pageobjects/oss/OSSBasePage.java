package com.sqs.pageobjects.oss;

import com.sqs.common.PageObject;

/**
 * Will be used as a base page to page objects allowing extension of head and footer elements to
 * page objects.
 */
public abstract class OSSBasePage extends PageObject {
    public final OSSHeader header = new OSSHeader();
    public final OSSFooter footer = new OSSFooter();
}
