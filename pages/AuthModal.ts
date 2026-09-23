import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthModal extends BasePage {
  readonly signupNavButton: Locator;
  readonly loginNavButton: Locator;
  readonly logoutNavButton: Locator;
  readonly welcomeUserText: Locator;

  readonly signupModal: Locator;
  readonly signupUsernameInput: Locator;
  readonly signupPasswordInput: Locator;
  readonly signupSubmitButton: Locator;
  readonly signupCloseButton: Locator;

  readonly loginModal: Locator;
  readonly loginUsernameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly loginCloseButton: Locator;

  constructor(page: Page) {
    super(page);

    this.signupNavButton = page.locator('#signin2');
    this.loginNavButton = page.locator('#login2');
    this.logoutNavButton = page.locator('#logout2');
    this.welcomeUserText = page.locator('#nameofuser');

    this.signupModal = page.locator('#signInModal');
    this.signupUsernameInput = page.locator('#sign-username');
    this.signupPasswordInput = page.locator('#sign-password');
    this.signupSubmitButton = page.locator('#signInModal button[onclick="register()"]');
    this.signupCloseButton = page.locator('#signInModal button.btn-secondary:has-text("Close")');

    this.loginModal = page.locator('#logInModal');
    this.loginUsernameInput = page.locator('#loginusername');
    this.loginPasswordInput = page.locator('#loginpassword');
    this.loginSubmitButton = page.locator('#logInModal button[onclick="logIn()"]');
    this.loginCloseButton = page.locator('#logInModal button.btn-secondary:has-text("Close")');
  }
  async openSignupModal() {
    await this.signupNavButton.click();
    await expect(this.signupModal).toBeVisible({ timeout: 5000 });
  }
  async signup(username: string, password: string): Promise<string> {
    await this.openSignupModal();
    await this.signupUsernameInput.fill(username);
    await this.signupPasswordInput.fill(password);

    return await this.executeWithDialog(async () => {
      await this.signupSubmitButton.click();
    });
  }
  async openLoginModal() {
    await this.loginNavButton.click();
    await expect(this.loginModal).toBeVisible({ timeout: 5000 });
  }
  async login(username: string, password: string) {
    await this.openLoginModal();
    await this.loginUsernameInput.fill(username);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
    await expect(this.welcomeUserText).toBeVisible({ timeout: 10000 });
    await expect(this.welcomeUserText).toContainText(username);
  }
  async loginExpectingFailure(username: string, password: string): Promise<string> {
    await this.openLoginModal();
    await this.loginUsernameInput.fill(username);
    await this.loginPasswordInput.fill(password);

    return await this.executeWithDialog(async () => {
      await this.loginSubmitButton.click();
    });
  }
  async logout() {
    await this.logoutNavButton.click();
    await expect(this.loginNavButton).toBeVisible();
    await expect(this.welcomeUserText).not.toBeVisible();
  }
}
