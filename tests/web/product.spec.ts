import { test, expect } from '../../basetest';
import { demoblazeData } from '../../test-data/demoblazeData';

test.describe('DemoBlaze catalog', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('filter by phones, laptops, and monitors', async ({ homePage }) => {
    await homePage.filterByCategory('Laptops');
    let titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    expect(titles.some(t => t.toLowerCase().includes('sony') || t.toLowerCase().includes('macbook') || t.toLowerCase().includes('dell'))).toBe(true);
    await homePage.filterByCategory('Monitors');
    titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    expect(titles.some(t => t.toLowerCase().includes('monitor') || t.toLowerCase().includes('asus'))).toBe(true);
    await homePage.filterByCategory('Phones');
    titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    expect(titles.some(t => t.toLowerCase().includes('samsung') || t.toLowerCase().includes('nokia') || t.toLowerCase().includes('iphone'))).toBe(true);
  });

  test('product page shows the title and price', async ({ homePage, productPage }) => {
    const expectedProduct = demoblazeData.products.samsungGalaxyS6;
    await homePage.selectProduct(expectedProduct.name);
    const actualTitle = await productPage.getTitle();
    const actualPrice = await productPage.getPrice();
    const actualDescription = await productPage.getDescription();
    expect(actualTitle).toBe(expectedProduct.name);
    expect(actualPrice).toBe(expectedProduct.price);
    expect(actualDescription.length).toBeGreaterThan(10);
  });

  test('add to cart shows Product added', async ({ homePage, productPage }) => {
    const product = demoblazeData.products.samsungGalaxyS6;
    await homePage.selectProduct(product.name);
    const dialogMessage = await productPage.addToCart();
    expect(dialogMessage).toBe('Product added');
  });
});
