import { test as baseTest, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { AuthModal } from './pages/AuthModal';

export type WebFixtures = {
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  authModal: AuthModal;
};

export const test = baseTest.extend<WebFixtures>({
  page: async ({ page }, use) => {
    // ads cover the nav links on this site
    await page.route(/(googlesyndication|google-analytics|doubleclick|adservice|amazon-adsystem)/, route => {
      route.abort();
    });
    await use(page);
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  authModal: async ({ page }, use) => {
    await use(new AuthModal(page));
  },
});
export { expect };
