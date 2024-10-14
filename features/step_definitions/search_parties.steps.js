import { BeforeAll, AfterAll, Before, After, Given, When, Then } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';

let browser;
let context;
let page;
let partiesData = [];

BeforeAll(async () => {
  browser = await chromium.launch();
});

AfterAll(async () => {
  await browser.close();
});

Before(async () => {
  context = await browser.newContext();
  page = await context.newPage();
});

After(async () => {
  await context.close();
});

Given('the following parties exist:', async function (dataTable) {
  partiesData = dataTable.hashes();

  // Mock API response
  await page.route('**/party/search**', (route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams.get('q') || '';

    const filteredParties = partiesData.filter(
      (party) =>
        party.partyName.includes(query) || party.partyId.includes(query)
    );

    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(filteredParties),
    });
  });
});

When('Maddie searches for {string}', async function (searchTerm) {
  // Navigate to the application
  await page.goto('http://localhost:5173');

  // Perform the search action
  await page.getByPlaceholder('Search by name or ID').fill(searchTerm);

  // Optionally, wait for network requests to complete
  await page.waitForLoadState('networkidle');
});

Then('the following parties should be displayed:', async function (dataTable) {
  const expectedParties = dataTable.hashes();

  // Get the locator for the list items
  const listItems = page.getByRole('listitem');

  // Assert that at least one item is displayed
  await expect(listItems).toHaveCount(expectedParties.length);

  // Get displayed party names
  const displayedParties = await listItems.allInnerTexts();

  // Assert that the displayed parties match the expected parties
  expectedParties.forEach((party) => {
    expect(displayedParties).toContain(party.partyName);
  });
});

Then('no parties should be displayed', async function () {
  // Get the locator for the list items
  const listItems = page.getByRole('listitem');

  // Assert that no list items are displayed
  await expect(listItems).toHaveCount(0);
});
