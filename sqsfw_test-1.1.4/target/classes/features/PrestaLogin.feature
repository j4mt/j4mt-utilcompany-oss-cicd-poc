Feature: Check the login page on Presta Shop works correctly

  Scenario: Valid login
    Given I am on the login page
    When I enter dm@dm.com and dermot
    Then the customer name displayed is Dermot Murray
