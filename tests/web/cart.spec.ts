import { test, expect } from '../../basetest';
import { demoblazeData } from '../../test-data/demoblazeData';

test.describe('DemoBlaze cart', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('place an order', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    const product = demoblazeData.products.samsungGalaxyS6;
    await homePage.selectProduct(product.name);
    const alert = await productPage.addToCart();
    expect(alert).toBe('Product added');
    await homePage.goToCart();
    const items = await cartPage.getItemTitles();
    expect(items).toContain(product.name);
    const total = await cartPage.getTotalPrice();
    expect(total).toBe(product.price);
    await cartPage.openPlaceOrderModal();
    await cartPage.fillOrderForm(demoblazeData.order);
    const confirmation = await cartPage.submitOrder();
    expect(confirmation.header).toBe('Thank you for your purchase!');
    expect(confirmation.id).not.toBe('');
    expect(confirmation.amount).toContain(product.price.toString());
    await cartPage.confirmPurchaseSuccess();
  });

  test('delete a cart item', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    const product = demoblazeData.products.samsungGalaxyS6;
    await homePage.selectProduct(product.name);
    await productPage.addToCart();
    await homePage.goToCart();
    const countBefore = await cartPage.getItemCount();
    expect(countBefore).toBeGreaterThan(0);
    await cartPage.deleteItem(0);
    const countAfter = await cartPage.getItemCount();
    expect(countAfter).toBe(countBefore - 1);
  });

  test('checkout with name and card left empty', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    const product = demoblazeData.products.samsungGalaxyS6;
    await homePage.selectProduct(product.name);
    await productPage.addToCart();
    await homePage.goToCart();
    await cartPage.openPlaceOrderModal();
    const alertMessage = await cartPage.submitOrderExpectingAlert();
    expect(alertMessage).toBe('Please fill out Name and Creditcard.');
  });
});
