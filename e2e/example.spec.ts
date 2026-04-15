import { test, expect } from '@playwright/test';

test('додає нове завдання через форму', async ({ page }) => {
  await page.goto('http://localhost:3000/index.html'); 
  await page.fill('#task-desc', 'Test task');          // поле вводу
  await page.click('#add-task');                       // кнопка додати
  await expect(page.locator('#output')).toContainText('Test task'); // перевірка у виводі
});

test('відображає список завдань після додавання', async ({ page }) => {
  await page.goto('http://localhost:3000/index.html');
  await page.fill('#task-desc', 'Task 1');
  await page.click('#add-task');
  await page.fill('#task-desc', 'Task 2');
  await page.click('#add-task');
  await expect(page.locator('#output')).toContainText('Task 1');
  await expect(page.locator('#output')).toContainText('Task 2');
});
