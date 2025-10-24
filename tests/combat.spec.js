// filename: tests/combat.spec.js

import { test, expect } from '@playwright/test';

test.describe('Combat System', () => {
  test.beforeEach(async ({ page }) => {
    // Start the game and get to exploration
    await page.goto('http://localhost:5173/p-o-h/');

    // Wait for localization to load
    await page.waitForTimeout(1000);

    // Select character (Omar - Warrior)
    await page.click('button:has-text("Omar")');

    // Wait for save slot screen
    await page.waitForSelector('text=/New Game|جديدة لعبة/');

    // Start new game in slot 1
    await page.click('button:has-text("⚔️")'); // First slot's New Game button

    // Wait for dungeon grid to appear
    await page.waitForSelector('.grid', { timeout: 5000 });
  });

  test('should start battle and allow basic attack', async ({ page }) => {
    // Find and click on a battle room (⚔️)
    // The player starts at a path room, we need to move to adjacent battle room
    const battleRoom = page.locator('text=⚔️').first();
    await battleRoom.click();

    // Wait for battle screen to load
    await page.waitForSelector('text=/Battle|معركة/', { timeout: 5000 });

    // Click attack button
    const attackButton = page.locator('button:has-text("⚔️")').first();
    await attackButton.click();

    // Wait a moment for combat to process
    await page.waitForTimeout(1000);

    // Verify we're still in battle (not immediately ended)
    const battleIndicator = page.locator('text=/Battle|معركة/');
    await expect(battleIndicator).toBeVisible();
  });

  test('should handle god mode for instant victory', async ({ page }) => {
    // Find battle room
    const battleRoom = page.locator('text=⚔️').first();
    await battleRoom.click();

    // Wait for battle screen
    await page.waitForSelector('text=/Battle|معركة/', { timeout: 5000 });

    // Enable god mode (key 0)
    await page.keyboard.press('0');

    // Wait a moment for god mode to activate
    await page.waitForTimeout(500);

    // Click attack button
    const attackButton = page.locator('button:has-text("⚔️")').first();
    await attackButton.click();

    // Wait for outcome screen (should be quick with god mode)
    await page.waitForSelector('text=/Victory|نصر/', { timeout: 5000 });

    // Verify victory screen appears
    const victoryText = page.locator('text=/Victory|نصر/');
    await expect(victoryText).toBeVisible();
  });

  test('should show performance HUD when pressing P', async ({ page }) => {
    // Find battle room
    const battleRoom = page.locator('text=⚔️').first();
    await battleRoom.click();

    // Wait for battle screen
    await page.waitForSelector('text=/Battle|معركة/', { timeout: 5000 });

    // Press 'P' to show performance HUD
    await page.keyboard.press('p');

    // Wait a moment for HUD to appear
    await page.waitForTimeout(500);

    // Verify performance HUD is visible
    const perfHUD = page.locator('text=FPS');
    await expect(perfHUD).toBeVisible();
  });

  test('should use potion during battle', async ({ page }) => {
    // Find battle room
    const battleRoom = page.locator('text=⚔️').first();
    await battleRoom.click();

    // Wait for battle screen
    await page.waitForSelector('text=/Battle|معركة/', { timeout: 5000 });

    // Take some damage first by waiting for enemy turn
    await page.waitForTimeout(2000);

    // Click health potion button (❤️‍🩹)
    const potionButton = page.locator('button:has-text("❤️")').first();
    await potionButton.click();

    // Wait for potion effect
    await page.waitForTimeout(500);

    // Verify we're still in battle
    const battleIndicator = page.locator('text=/Battle|معركة/');
    await expect(battleIndicator).toBeVisible();
  });
});

test.describe('Boss Battles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/p-o-h/');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Omar")');
    await page.waitForSelector('text=/New Game|جديدة لعبة/');
    await page.click('button:has-text("⚔️")');
    await page.waitForSelector('.grid', { timeout: 5000 });
  });

  test('should show boss intro flavor text', async ({ page }) => {
    // Navigate to boss room (👹)
    const bossRoom = page.locator('text=👹').first();
    await bossRoom.click();

    // Wait for battle screen
    await page.waitForSelector('text=/Battle|معركة/', { timeout: 5000 });

    // Check for battle intro flavor text (should be visible with italic styling)
    const flavorText = page.locator('p.italic.text-\\[\\#d4a656\\]');
    await expect(flavorText).toBeVisible();
  });

  test('should show buff selection for boss battles', async ({ page }) => {
    // Navigate to boss room
    const bossRoom = page.locator('text=👹').first();
    await bossRoom.click();

    // Wait for buff selection screen
    await page.waitForSelector('text=/Choose.*Buff|اختر.*تعزيز/', { timeout: 5000 });

    // Verify buff selection is visible
    const buffSelection = page.locator('text=/Choose.*Buff|اختر.*تعزيز/');
    await expect(buffSelection).toBeVisible();

    // Select a buff (first one)
    const buffButton = page.locator('button').filter({ hasText: /🔥|🛡️|⚡/ }).first();
    await buffButton.click();

    // Wait for battle to start after buff selection
    await page.waitForSelector('text=/Battle|معركة/', { timeout: 5000 });
  });
});

test.describe('Navigation', () => {
  test('should navigate dungeon grid', async ({ page }) => {
    await page.goto('http://localhost:5173/p-o-h/');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Omar")');
    await page.waitForSelector('text=/New Game|جديدة لعبة/');
    await page.click('button:has-text("⚔️")');

    // Wait for grid
    await page.waitForSelector('.grid', { timeout: 5000 });

    // Verify grid is visible
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();

    // Verify player position marker exists
    const playerMarker = page.locator('text=🧍');
    await expect(playerMarker).toBeVisible();
  });

  test('should show analytics dashboard from main menu', async ({ page }) => {
    await page.goto('http://localhost:5173/p-o-h/');
    await page.waitForTimeout(1000);

    // Click analytics button (📊)
    const analyticsButton = page.locator('button:has-text("📊")').first();
    await analyticsButton.click();

    // Wait for analytics dashboard
    await page.waitForSelector('text=/Analytics|إحصائيات/', { timeout: 5000 });

    // Verify dashboard is visible
    const dashboard = page.locator('text=/Analytics|إحصائيات/');
    await expect(dashboard).toBeVisible();
  });
});
