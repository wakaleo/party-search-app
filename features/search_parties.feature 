Feature: Party Search Functionality

  As a user, I want to search for parties by name or ID so that I can find and select the correct party.

  Background:
    Given the following parties exist:
      | partyId  | partyName         |
      | 12345678 | Sarah-Jane Smith  |
      | 87654321 | John Doe          |
      | 11223344 | Sarah Connor      |

  Scenario: Search by party name
    When Maddie searches for "Sarah"
    Then the following parties should be displayed:
      | partyName        |
      | Sarah-Jane Smith |
      | Sarah Connor     |

  Scenario: Search by party ID
    When Maddie searches for "12345678"
    Then the following parties should be displayed:
      | partyName        |
      | Sarah-Jane Smith |

  Scenario: No results found
    When Maddie searches for "Nonexistent"
    Then no parties should be displayed
