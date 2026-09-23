import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type Category = 'Phones' | 'Laptops' | 'Monitors';

export class HomePage extends BasePage {
  readonly brandLogo: Locator;
  readonly homeLink: Locator;
  readonly cartLink: Locator;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly logoutLink: Locator;
  readonly welcomeUserText: Locator;
  readonly phonesCategory: Locator;
  readonly laptopsCategory: Locator;
  readonly monitorsCategory: Locator;
  readonly productCards: Locator;
  readonly productTitles: Locator;

  constructor(page: Page) {
    super(page);
    this.brandLogo = page.locator('#nava');
    this.homeLink = page.locator('li.nav-item.active a, a.nav-link:has-text("Home")');
    this.cartLink = page.locator('#cartur');
    this.loginLink = page.locator('#login2');
    this.signupLink = page.locator('#signin2');
    this.logoutLink = page.locator('#logout2');
    this.welcomeUserText = page.locator('#nameofuser');
    this.phonesCategory = page.locator('a.list-group-item:has-text("Phones")');
    this.laptopsCategory = page.locator('a.list-group-item:has-text("Laptops")');
    this.monitorsCategory = page.locator('a.list-group-item:has-text("Monitors")');

    this.productCards = page.locator('#tbodyid .card');
    this.productTitles = page.locator('#tbodyid .card-title a');
  }
  async goto() {
    await this.navigate('/');
    await this.waitForProductsToLoad();
  }
  async waitForProductsToLoad() {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 15000 });
  }
  async filterByCategory(category: Category) {
    const responsePromise = this.page.waitForResponse(
      response => response.url().includes('/bycat') && response.status() === 200,
      { timeout: 10000 }
    ).catch(() => null);

    switch (category) {
      case 'Phones':
        await this.phonesCategory.click();
        break;
      case 'Laptops':
        await this.laptopsCategory.click();
        break;
      case 'Monitors':
        await this.monitorsCategory.click();
        break;
    }

    await responsePromise;
    await this.page.waitForTimeout(500);
    await this.waitForProductsToLoad();
  }
  async getProductTitles(): Promise<string[]> {
    await this.waitForProductsToLoad();
    return await this.productTitles.allInnerTexts();
  }
  async selectProduct(productName: string) {
    await this.waitForProductsToLoad();
    const product = this.page.locator(`#tbodyid .card-title a:has-text("${productName}")`).first();
    await expect(product).toBeVisible();
    await product.click();
    await this.page.waitForURL('**/prod.html**');
  }
  async goToCart() {
    const responsePromise = this.page.waitForResponse(
      response => response.url().includes('/viewcart') && response.status() === 200,
      { timeout: 10000 }
    ).catch(() => null);

    await this.cartLink.click();
    await this.page.waitForURL('**/cart.html');
    await responsePromise;
  }
  async isLoggedIn(): Promise<boolean> {
    try {
      await expect(this.welcomeUserText).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async getWelcomeMessage(): Promise<string> {
    await expect(this.welcomeUserText).toBeVisible({timeout: 5000 });
    return (await this.welcomeUserText.textContent()) || '';
  }
  async logout() {
    await this.logoutLink.click();
    await expect(this.loginLink).toBeVisible();
    await expect(this.welcomeUserText).not.toBeVisible();
  }
}
