import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly titleHeading: Locator;
  readonly priceContainer: Locator;
  readonly descriptionBlock: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.titleHeading = page.locator('.name');
    this.priceContainer = page.locator('.price-container');
    this.descriptionBlock = page.locator('#more-information');
    this.addToCartButton = page.locator('a.btn-success:has-text("Add to cart"), a[onclick*="addToCart"]');
  }
  async waitForProductDetails() {
    await this.titleHeading.waitFor({ state: 'visible', timeout: 15000 });
  }
  async getTitle(): Promise<string> {
    await this.waitForProductDetails();
    return (await this.titleHeading.innerText()).trim();
  }
  async getPrice(): Promise<number> {
    await this.waitForProductDetails();
    const text = await this.priceContainer.innerText();
    const match = text.match(/\$(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  async getDescription(): Promise<string> {
    await this.waitForProductDetails();
    return (await this.descriptionBlock.innerText()).trim();
  }
  async addToCart(): Promise<string> {
    await expect(this.addToCartButton).toBeVisible();

    const responsePromise = this.page.waitForResponse(
      response => response.url().includes('/addtocart') && response.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);

    const dialogMessage = await this.executeWithDialog(async () => {
      await this.addToCartButton.click();
    });

    await responsePromise;
    // cart cookie isn't updated when the alert closes
    await this.page.waitForTimeout(500);
    return dialogMessage;
  }
}
