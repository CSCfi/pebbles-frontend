import { browser } from 'protractor';

export class DashboardPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl + '/dashboard/catalog') as Promise<unknown>;
  }
}
