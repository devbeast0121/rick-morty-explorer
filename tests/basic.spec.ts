import { test, expect } from '@playwright/test';

test.describe('Rick & Morty Explorer', () => {
    test('homepage loads and displays characters', async ({ page }) => {
        await page.goto('/');

        // Check page title
        await expect(page).toHaveTitle(/Rick & Morty Explorer/);

        // Check header is visible
        await expect(page.getByRole('banner')).toBeVisible();
        await expect(page.getByText('🛸 Rick & Morty Explorer')).toBeVisible();

        // Wait for characters to load (or loading skeletons)
        await page.waitForSelector('[data-testid="character-card"], .animate-pulse', { timeout: 10000 });

        // Check search functionality exists
        await expect(page.getByPlaceholder('Search by name...')).toBeVisible();

        // Check filters exist - use more specific selectors to avoid conflicts
        await expect(page.getByLabel('Status')).toBeVisible();
        await expect(page.getByLabel('Species')).toBeVisible();
        await expect(page.getByLabel('Gender')).toBeVisible();
    });

    test('search functionality works', async ({ page }) => {
        await page.goto('/');

        // Wait for initial load
        await page.waitForSelector('[data-testid="character-card"], .animate-pulse', { timeout: 10000 });

        // Search for "Rick"
        await page.getByPlaceholder('Search by name...').fill('Rick');

        // Wait for search results (debounced)
        await page.waitForTimeout(500);

        // Check URL is updated
        await expect(page).toHaveURL(/q=Rick/);

        // Wait for results or error message
        await page.waitForSelector('[data-testid="character-card"], .text-center', { timeout: 10000 });
    });

    test('character detail page works', async ({ page }) => {
        await page.goto('/');

        // Wait for characters to load
        await page.waitForSelector('[data-testid="character-card"]', { timeout: 10000 });

        // Click on first character
        const firstCharacter = page.locator('[data-testid="character-card"]').first();
        await firstCharacter.click();

        // Wait for navigation
        await page.waitForURL(/\/character\/\d+/);

        // Check character details are shown
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.getByText('Species')).toBeVisible();
        await expect(page.getByText('Gender')).toBeVisible();
        await expect(page.getByText('Episodes')).toBeVisible();

        // Check back button works
        await page.getByText('Back to Characters').click();
        await expect(page).toHaveURL('/');
    });

    test('pagination works', async ({ page }) => {
        await page.goto('/');

        // Wait for initial load
        await page.waitForSelector('[data-testid="character-card"]', { timeout: 10000 });

        // Check if pagination exists (depends on API response)
        const pagination = page.getByRole('navigation', { name: 'Pagination' });

        if (await pagination.isVisible()) {
            // Click next page if available
            const nextButton = page.getByLabel('Go to next page');
            if (await nextButton.isEnabled()) {
                await nextButton.click();

                // Check URL is updated
                await expect(page).toHaveURL(/page=2/);

                // Wait for new content
                await page.waitForSelector('[data-testid="character-card"]', { timeout: 10000 });
            }
        }
    });

    test('error handling works', async ({ page }) => {
        // Test with invalid search that returns no results
        await page.goto('/?q=nonexistentcharacter123456789');

        // Should show no results message
        await expect(page.getByText('No characters found')).toBeVisible({ timeout: 10000 });

        // Should have clear filters button - use the actual button text
        await expect(page.getByText('Clear All')).toBeVisible();
    });

    test('sort functionality works', async ({ page }) => {
        await page.goto('/');

        // Wait for characters to load
        await page.waitForSelector('[data-testid="character-card"]', { timeout: 10000 });

        // Find and use the sort dropdown
        const sortSelect = page.getByLabel('Sort by');
        await sortSelect.selectOption('name-asc');

        // Check URL is updated with sort parameter
        await expect(page).toHaveURL(/sort=name-asc/);

        // Wait for sorted results
        await page.waitForSelector('[data-testid="character-card"]', { timeout: 10000 });

        // Check sort indicator in results summary
        await expect(page.getByText('Sorted by Name A-Z')).toBeVisible();
    });

    test('responsive design works', async ({ page }) => {
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Check mobile layout
        await expect(page.getByRole('banner')).toBeVisible();
        await page.waitForSelector('[data-testid="character-card"], .animate-pulse', { timeout: 10000 });

        // Test tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.reload();
        await page.waitForSelector('[data-testid="character-card"], .animate-pulse', { timeout: 10000 });

        // Test desktop viewport
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.reload();
        await page.waitForSelector('[data-testid="character-card"], .animate-pulse', { timeout: 10000 });
    });
});