import { browser } from 'protractor';

export class MainPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl + '/main/catalog') as Promise<unknown>;
  }
}
