import { browser, by, element } from 'protractor';

export class WelcomePage {
  navigateTo(): Promise<unknown> {
    browser.waitForAngularEnabled(false);
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return browser.getTitle() as Promise<string>;
  }

  login(eppn: string, password: string) {
    element(by.id('special-login-button')).click().then(() => console.log('clicked alternative login btn'));
    element(by.id('email')).sendKeys(eppn).then(() => console.log('sent eppn'));
    element(by.id('password')).sendKeys(password).then(() => console.log('sent password'));
    element(by.id('special-login-submit-button')).click().then(() => console.log('clicked login submit'));
  }
}
