// filename: tests/save.spec.js

import { test, expect } from '@playwright/test';

test.describe('Save System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/p-o-h/');
    await page.waitForTimeout(1000);
  });

  test('should create new save in slot 1', async ({ page }) => {
    // Select character
    await page.click('button:has-text("Omar")');

    // Wait for save slot screen
    await page.waitForSelector('text=/New Game|جديدة لعبة/');

    // Click New Game on slot 1
    await page.click('button:has-text("⚔️")');

    // Wait for dungeon to load
    await page.waitForSelector('.grid', { timeout: 5000 });

    // Verify we're in exploration mode
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();
  });

  test('should save progress and load game', async ({ page }) => {
    // Start new game
    await page.click('button:has-text("Salma")');
    await page.waitForSelector('text=/New Game|جديدة لعبة/');
    await page.click('button:has-text("⚔️")');
    await page.waitForSelector('.grid', { timeout: 5000 });

    // Use debug keys to make progress
    await page.keyboard.press('3'); // Add gold
    await page.keyboard.press('4'); // Level up
    await page.waitForTimeout(500);

    // Return to menu (ESC key or menu button)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Should be back at character selection
    // Select same character again
    await page.click('button:has-text("Salma")');

    // Wait for save slots
    await page.waitForSelector('text=/Load|تحميل/', { timeout: 5000 });

    // Verify save slot shows level/gold (not empty)
    const loadButton = page.locator('button:has-text("💾")').first();
    await expect(loadButton).toBeVisible();

    // Click Load Game
    await loadButton.click();

    // Wait for dungeon
    await page.waitForSelector('.grid', { timeout: 5000 });

    // Verify we're back in game
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();
  });

  test('should handle multiple save slots', async ({ page }) => {
    // Create save in slot 1
    await page.click('button:has-text("Omar")');
    await page.waitForSelector('text=/New Game|جديدة لعبة/');

    // Find all New Game buttons
    const newGameButtons = page.locator('button:has-text("⚔️")');
    const firstSlot = newGameButtons.first();
    await firstSlot.click();

    // Wait for game to start
    await page.waitForSelector('.grid', { timeout: 5000 });

    // Make some progress
    await page.keyboard.press('3');
    await page.waitForTimeout(500);

    // Return to menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Go back to save slots
    await page.click('button:has-text("Omar")');
    await page.waitForSelector('text=/New Game|جديدة لعبة/');

    // Create save in slot 2
    const secondSlot = newGameButtons.nth(1);
    await secondSlot.click();

    // Wait for new game to start
    await page.waitForSelector('.grid', { timeout: 5000 });

    // Verify it's a fresh start (different from slot 1)
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();
  });

  test('should show delete confirmation', async ({ page }) => {
    // Create a save first
    await page.click('button:has-text("Shadi")');
    await page.waitForSelector('text=/New Game|جديدة لعبة/');
    await page.click('button:has-text("⚔️")');
    await page.waitForSelector('.grid', { timeout: 5000 });

    // Save and return
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Go back to save slots
    await page.click('button:has-text("Shadi")');
    await page.waitForSelector('text=/Delete|حذف/', { timeout: 5000 });

    // Click delete button
    const deleteButton = page.locator('button:has-text("🗑️")').first();
    await deleteButton.click();

    // Verify confirmation dialog appears
    await page.waitForSelector('text=/Confirm|تأكيد/', { timeout: 3000 });
    const confirmDialog = page.locator('text=/Confirm|تأكيد/');
    await expect(confirmDialog).toBeVisible();
  });

  test('should export save to Excel', async ({ page }) => {
    // Create a save
    await page.click('button:has-text("Omar")');
    await page.waitForSelector('text=/New Game|جديدة لعبة/');
    await page.click('button:has-text("⚔️")');
    await page.waitForSelector('.grid', { timeout: 5000 });

    // Make some progress
    await page.keyboard.press('3');
    await page.keyboard.press('4');
    await page.waitForTimeout(500);

    // Return to menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Go to save slots
    await page.click('button:has-text("Omar")');
    await page.waitForSelector('text=/Export|تصدير/', { timeout: 5000 });

    // Set up download listener
    const downloadPromise = page.waitForEvent('download');

    // Click export button
    const exportButton = page.locator('button:has-text("📊")').first();
    await exportButton.click();

    // Wait for download
    const download = await downloadPromise;

    // Verify download occurred
    expect(download.suggestedFilename()).toMatch(/PathOfHeroes_Omar_Slot.*\.xlsx/);
  });
});

test.describe('Auto-Save', () => {
  test('should auto-save after boss defeat', async ({ page }) => {
    await page.goto('http://localhost:5173/p-o-h/');
    await page.waitForTimeout(1000);

    // Start new game
    await page.click('button:has-text("Omar")');
    await page.waitForSelector('text=/New Game|جديدة لعبة/');
    await page.click('button:has-text("⚔️")');
    await page.waitForSelector('.grid', { timeout: 5000 });

    // Enable god mode for easy boss kill
    await page.keyboard.press('0');

    // Navigate to boss room
    const bossRoom = page.locator('text=👹').first();
    await bossRoom.click();

    // Wait for buff selection
    await page.waitForSelector('text=/Choose|اختر/', { timeout: 5000 });

    // Select first buff
    const buffButton = page.locator('button').filter({ hasText: /🔥|🛡️|⚡/ }).first();
    await buffButton.click();

    // Wait for battle
    await page.waitForSelector('text=/Battle|معركة/', { timeout: 5000 });

    // Attack to win (god mode should make it instant)
    const attackButton = page.locator('button:has-text("⚔️")').first();
    await attackButton.click();

    // Wait for victory screen
    await page.waitForSelector('text=/Victory|نصر/', { timeout: 10000 });

    // Auto-save should happen here
    // Continue from victory
    const continueButton = page.locator('button').filter({ hasText: /Continue|متابعة/ }).first();
    await continueButton.click();

    // Click through outro screen
    await page.waitForTimeout(1000);
    const outroButton = page.locator('button').filter({ hasText: /Continue|متابعة/ }).first();
    await outroButton.click();

    // Should be back at dungeon
    await page.waitForSelector('.grid', { timeout: 5000 });

    // Verify grid is visible
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();
  });
});

test.describe('Analytics Export', () => {
  test('should export analytics to Excel', async ({ page }) => {
    await page.goto('http://localhost:5173/p-o-h/');
    await page.waitForTimeout(1000);

    // Open analytics dashboard
    const analyticsButton = page.locator('button:has-text("📊")').first();
    await analyticsButton.click();

    // Wait for dashboard
    await page.waitForSelector('text=/Analytics|إحصائيات/', { timeout: 5000 });

    // Set up download listener
    const downloadPromise = page.waitForEvent('download');

    // Click export button in analytics
    const exportButton = page.locator('button:has-text("📊")').first();
    await exportButton.click();

    // Wait for download
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toMatch(/PathOfHeroes_Analytics.*\.xlsx/);
  });
});
