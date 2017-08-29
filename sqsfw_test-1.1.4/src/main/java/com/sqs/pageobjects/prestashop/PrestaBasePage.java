package com.sqs.pageobjects.prestashop;

import com.sqs.common.PageObject;

/**
 * Will be used as a base page to page objects allowing extension of head and footer elements to
 * page objects.
 */
public abstract class PrestaBasePage extends PageObject {
  public final PrestaHeader header = new PrestaHeader();
  public final PrestaFooter footer = new PrestaFooter();
}
