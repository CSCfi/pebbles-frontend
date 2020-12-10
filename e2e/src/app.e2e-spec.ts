import { browser, by, element, ExpectedConditions, logging } from 'protractor';

import { WelcomePage } from './welcome.po';
import { DashboardPage } from './dashboard.po';

describe('Pebbles SPA', () => {
  let welcomePage: WelcomePage;
  let dashboardPage: DashboardPage;

  beforeEach(() => {
    welcomePage = new WelcomePage();
    dashboardPage = new DashboardPage();
  });

  it('should display Notebooks as title', () => {
    welcomePage.navigateTo();
    expect(welcomePage.getTitleText()).toEqual('Notebooks');
  });

  // TODO: change this when local login functionality is implemented
  // it('should get us to login page', () => {
  //   welcomePage.navigateTo();
  //   const loginBtn = element(by.id('haka-login-btn'));
  //   loginBtn.click();
  //   expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'welcome');
  //   expect(element(by.xpath('//h1')).getText()).toEqual('Notebooks');
  // });

  // it('should discard wrong credentials', () => {
  //   welcomePage.navigateTo();
  //   welcomePage.login('admin@example.org', 'wrong');
  //   browser.sleep(1000);
  //   expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'welcome');
  // });

  // it('should accept test credentials', () => {
  //   welcomePage.navigateTo();
  //   welcomePage.login('admin@example.org', 'admin');
  //   browser.sleep(3000);
  //   browser.wait(ExpectedConditions.urlContains('dashboard/catalog'), 5000).then(() => {
  //     console.log('on dashboard');
  //   });
  // });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
