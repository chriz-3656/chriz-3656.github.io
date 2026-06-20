// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Portfolio Walkthrough', () => {
  test('record full site walkthrough', async ({ page }) => {
    // Increase timeout for long walkthrough
    test.setTimeout(120000);
    
    // Set viewport for consistent recording
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // ========== HOME PAGE ==========
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Scroll through hero section
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(1500);
    
    // Scroll to about section
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1500);
    
    // Scroll to projects section
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1500);
    
    // Scroll to timeline
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1500);
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    
    // ========== ABOUT PAGE ==========
    await page.goto('/about.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1500);
    
    // ========== PORTFOLIO PAGE ==========
    await page.goto('/portfolio.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Test filter buttons
    const securityFilter = page.locator('[data-filter="security"]');
    if (await securityFilter.isVisible()) {
      await securityFilter.click();
      await page.waitForTimeout(1000);
    }
    
    const allFilter = page.locator('[data-filter="all"]');
    if (await allFilter.isVisible()) {
      await allFilter.click();
      await page.waitForTimeout(1000);
    }
    
    // Scroll through projects
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1500);
    
    // ========== TERMINAL PAGE ==========
    await page.goto('/terminal.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Type commands in terminal
    const terminalInput = page.locator('[data-terminal-form] input');
    if (await terminalInput.isVisible()) {
      await terminalInput.fill('help');
      await terminalInput.press('Enter');
      await page.waitForTimeout(1000);
      
      await terminalInput.fill('whoami');
      await terminalInput.press('Enter');
      await page.waitForTimeout(1000);
      
      await terminalInput.fill('neofetch');
      await terminalInput.press('Enter');
      await page.waitForTimeout(1500);
    }
    
    // ========== RESUME PAGE ==========
    await page.goto('/resume.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1500);
    
    // ========== CONTACT PAGE ==========
    await page.goto('/contact.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // ========== TEST THEME TOGGLE ==========
    const themeToggle = page.locator('#themeToggle');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(1000);
      await themeToggle.click();
      await page.waitForTimeout(1000);
    }
    
    // ========== TEST MOBILE MENU ==========
    const menuToggle = page.locator('#menuToggle');
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      await page.waitForTimeout(1500);
      
      const closeMenu = page.locator('#navMenuClose');
      if (await closeMenu.isVisible()) {
        await closeMenu.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // ========== BACK TO HOME ==========
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Test back-to-top button
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    const backToTop = page.locator('#backToTop');
    if (await backToTop.isVisible()) {
      await backToTop.click();
      await page.waitForTimeout(1500);
    }
    
    // Final pause
    await page.waitForTimeout(2000);
  });
});
