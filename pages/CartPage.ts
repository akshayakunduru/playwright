import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface OrderDetails {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}

export interface PurchaseConfirmation {
  header: string;
  id: string;
  amount: string;
  rawDetails: string;
}

export class CartPage extends BasePage {
  readonly cartRows: Locator;
  readonly totalPriceText: Locator;
  readonly placeOrderButton: Locator;
  readonly orderModal: Locator;
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly cardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseButton: Locator;
  readonly closeOrderModalButton: Locator;
  readonly sweetAlertModal: Locator;
  readonly sweetAlertHeader: Locator;
  readonly sweetAlertDetails: Locator;
  readonly sweetAlertConfirmButton: Locator;
  constructor(page: Page) {
    super(page);
    this.cartRows = page.locator('#tbodyid tr');
    this.totalPriceText = page.locator('#totalp');
    this.placeOrderButton = page.locator('button:has-text("Place Order")');
    this.orderModal = page.locator('#orderModal');
    this.nameInput = page.locator('#name');
    this.countryInput = page.locator('#country');
    this.cityInput = page.locator('#city');
    this.cardInput = page.locator('#card');
    this.monthInput = page.locator('#month');
    this.yearInput = page.locator('#year');
    this.purchaseButton = page.locator('button[onclick="purchaseOrder()"]');
    this.closeOrderModalButton = page.locator('#orderModal button.btn-secondary:has-text("Close")');
    this.sweetAlertModal = page.locator('.sweet-alert');
    this.sweetAlertHeader = page.locator('.sweet-alert h2');
    this.sweetAlertDetails = page.locator('.sweet-alert p.lead');
    this.sweetAlertConfirmButton = page.locator('.sweet-alert button.confirm');
  }
  async goto() {
    await this.navigate('/cart.html');
    await this.waitForCartToLoad();
  }
  async waitForCartToLoad(timeout: number = 10000) {
    await this.page.waitForLoadState('domcontentloaded');
    try {
      await this.cartRows.first().waitFor({ state: 'visible', timeout });
    } catch {
    }
  }
  async getItemCount(): Promise<number> {
    await this.waitForCartToLoad();
    return await this.cartRows.count();
  }
  async getItemTitles(): Promise<string[]> {
    await this.cartRows.first().waitFor({ state: 'visible', timeout: 15000 });
    const count = await this.cartRows.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const title = await this.cartRows.nth(i).locator('td:nth-child(2)').innerText();
      titles.push(title.trim());
    }
    return titles;
  }
  async getTotalPrice(): Promise<number> {
    await expect(this.totalPriceText).toBeVisible();
    await expect(this.totalPriceText).not.toHaveText('');
    const text = await this.totalPriceText.innerText();
    return parseInt(text.trim(), 10) || 0;
  }
  async deleteItem(index: number = 0) {
    const row = this.cartRows.nth(index);
    await expect(row).toBeVisible({ timeout: 10000 });
    const deleteLink = row.locator('td:nth-child(4) a');

    const deletePromise = this.page.waitForResponse(
      response => response.url().includes('/deleteitem') && response.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);

    await deleteLink.click();
    await deletePromise;
    // row count lags the delete response
    await this.page.waitForTimeout(1500);
  }
  async openPlaceOrderModal() {
    await expect(this.placeOrderButton).toBeVisible();
    await this.placeOrderButton.click();
    await expect(this.orderModal).toBeVisible({ timeout: 5000 });
  }
  async fillOrderForm(details: Partial<OrderDetails>) {
    if (details.name !== undefined) await this.nameInput.fill(details.name);
    if (details.country !== undefined) await this.countryInput.fill(details.country);
    if (details.city !== undefined) await this.cityInput.fill(details.city);
    if (details.creditCard !== undefined) await this.cardInput.fill(details.creditCard);
    if (details.month !== undefined) await this.monthInput.fill(details.month);
    if (details.year !== undefined) await this.yearInput.fill(details.year);
  }
  async submitOrder(): Promise<PurchaseConfirmation> {
    await this.purchaseButton.click();
    await expect(this.sweetAlertModal).toBeVisible({ timeout: 10000 });

    const header = (await this.sweetAlertHeader.innerText()).trim();
    const rawDetails = (await this.sweetAlertDetails.innerText()).trim();
    // confirmation text looks like "Id: 123456" and "Amount: 360 USD"
    const idMatch = rawDetails.match(/Id:\s*(\d+)/);
    const amountMatch = rawDetails.match(/Amount:\s*(\d+\s*[A-Z]*)/);

    return {
      header,
      id: idMatch ? idMatch[1] : '',
      amount: amountMatch ? amountMatch[1] : '',
      rawDetails,
    };
  }
  async submitOrderExpectingAlert(): Promise<string> {
    return await this.executeWithDialog(async () => {
      await this.purchaseButton.click();
    });
  }
  async confirmPurchaseSuccess() {
    await this.sweetAlertConfirmButton.click();
    await expect(this.sweetAlertModal).not.toBeVisible();
  }
}
