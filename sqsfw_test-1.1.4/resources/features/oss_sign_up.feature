Feature: Check the signup page on OSS works correctly

  Scenario: Valid login
    Given I am on the login page
    When I enter john.orourke.1985@j4mtutil.com and 123456
    Then the customer sign message is displayed