import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://plab08.i-sightlab.com/portal');
  await page.getByRole('link', { name: 'Report Online' }).click();
  await page.getByRole('button', { name: ' Accept' }).click();
  await page.getByRole('radio', { name: 'Yes' }).check();
  await page.getByLabel('Are you a returning user?').getByText('No').click();
  await page.getByLabel('Would you like to receive').getByText('No').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: ' Yes, Submit Case' }).click();
  await page.getByRole('button', { name: ' Return to homepage' }).click();
  await page.close();

  
});