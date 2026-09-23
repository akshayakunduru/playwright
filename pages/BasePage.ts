import { Page, Dialog } from '@playwright/test';
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
  async handleNextDialog(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.page.once('dialog', async (dialog: Dialog) => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
  }
  async executeWithDialog(action: () => Promise<void>): Promise<string> {
    const dialogPromise = this.handleNextDialog();
    await action();
    return await dialogPromise;
  }
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
