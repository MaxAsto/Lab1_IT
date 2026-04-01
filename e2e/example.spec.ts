import { test, expect } from '@playwright/test';

test('додає нове завдання через форму', async ({ page }) => {
  await page.goto('http://localhost:3000/index.html'); 
  await page.fill('#task-input', 'Test task');
  await page.click('#add-button');
  await expect(page.locator('#task-list')).toContainText('Test task');
});

test('відображає список завдань після додавання', async ({ page }) => {
  await page.goto('http://localhost:3000/index.html');
  await page.fill('#task-input', 'Task 1');
  await page.click('#add-button');
  await page.fill('#task-input', 'Task 2');
  await page.click('#add-button');
  await expect(page.locator('#task-list')).toContainText('Task 1');
  await expect(page.locator('#task-list')).toContainText('Task 2');
});