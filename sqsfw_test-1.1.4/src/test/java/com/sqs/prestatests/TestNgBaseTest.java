package com.sqs.prestatests;

import cucumber.api.CucumberOptions;
import cucumber.api.testng.AbstractTestNGCucumberTests;

@CucumberOptions(
  features = "resources/features",
  glue = {"com.sqs.steps"},
  plugin = {
    "io.qameta.allure.cucumberjvm.AllureCucumberJvm",
    "pretty",
    "html:target/cucumber-html-report",
    "json:target/cucumber1.json"
  },
  strict = true
)
public class TestNgBaseTest extends AbstractTestNGCucumberTests {}
