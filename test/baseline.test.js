require('should');
const path = require('path');
const wd = require('macaca-wd');

describe('Macaca UI Test', function () {
  this.timeout(5 * 60 * 1000);

  var driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 3457
  });

  before(() => {
    return driver
      .init({
        platformName: 'desktop',
        browserName: 'electron'
      })
      .setWindowSize(1275, 795);
  });

  it('#1 it Login', function () {
    const initialURL = 'http://monitor.showjoy.net';
    return driver
      .get(initialURL)
      .sleep(3000)
      .elementById('userName')
      .sendKeys('肉猪')
      .elementById('password')
      .sendKeys('19951112')
      .sleep(3000)
      .elementById('loginBtn')
      .click()
      .sleep(3000)
      .title()
      .then(title => {
        title.should.containEql('Monitor');
      })
      .sleep(5000);
  });

  it('#2 it Homepage Works', function () {
    return driver
      .waitForElementByClassName('ant-calendar-picker-input')
      .click()
      .sleep(3000)
      .waitForElementByClassName('ant-calendar-today-btn')
      .click()
      .sleep(5000)
      .saveScreenshot('pics/homepage.png');
  });

  it('#3 it Infrastructure Works', function () {
    return driver
      .elementByXPath('//*[@id="app"]/div/div[2]/div[1]/ul/li[2]/a')
      .click()
      .sleep(5000)
      .waitForElementByClassName('ant-select')
      .click()
      .sleep(2000)
      .elementByXPath('/html/body/div/div/div/div/ul/li[2]')
      .click()
      .sleep(3000)
      .elementByXPath('//*[@id="app"]/div/div[2]/div[2]/div/div/div/div[2]/div[2]/input')
      .clear()
      .sendKeys('1000')
      .sleep(3000)
      .elementByClassName('ant-btn')
      .click()
      .sleep(3000)
      .saveScreenshot('pics/infrastruct.png')
      .execute(`document.getElementsByClassName('ant-layout-content')[0].scrollTop = 350`)
      .sleep(2000)
      .execute(`document.getElementsByClassName('ant-layout-content')[0].scrollTop = 700`)
      .sleep(3000);
  });

  it('#4 it Tomcat Works', function () {
    return driver
      .elementsByClassName('ant-menu-submenu-title')
      .then((eles) => eles[0])
      .click()
      .sleep(2000)
      .elementByXPath('//*[@id="sub1$Menu"]/li[1]/a')
      .click()
      .sleep(5000)
      .elementByXPath('//*[@id="app"]/div/div[2]/div[2]/div/div/div/div[2]/div[1]/span[1]')
      .click().click().click()
      .sleep(3000)
      .elementByClassName('ant-btn')
      .click()
      .sleep(3000)
      .saveScreenshot('pics/tomcat.png');
  });

  it('#5 it Nginx Works', function () {
    return driver
      .elementByXPath('//*[@id="sub1$Menu"]/li[2]/a')
      .click()
      .sleep(3000)
      .waitForElementByClassName('ant-select')
      .click()
      .sleep(2000)
      .elementByXPath('/html/body/div/div/div/div/ul/li[2]')
      .click()
      .sleep(3000)
      .execute(`document.getElementsByClassName('ant-layout-content')[0].scrollTop = 80`)
      .sleep(2000)
      .elementByClassName('ant-pagination-next')
      .click()
      .sleep(2000)
      .execute(`document.getElementsByClassName('ant-layout-content')[0].scrollTop = 0`)
      .elementByClassName('search-box')
      .sendKeys('/api/shop')
      .sleep(2000)
      .elementByClassName('anticon-search')
      .click()
      .sleep(7000)
      .saveScreenshot('pics/nginx.png');
  });

  it('#6 it MySQL Works', function () {
    return driver
      .elementByXPath('//*[@id="sub1$Menu"]/li[3]/a')
      .click()
      .sleep(3000)
      .elementByXPath('//*[@id="app"]/div/div[2]/div[2]/div/div/div/div[1]/div[2]/div[2]/input')
      .clear()
      .sendKeys('3000')
      .sleep(3000)
      .elementByClassName('ant-btn')
      .click()
      .sleep(3000)
      .elementByClassName('ant-switch')
      .click()
      .sleep(3000)
      .saveScreenshot('pics/mysql.png');
  });

  it('#7 Server Config Works', function () {
    return driver
      .elementsByClassName('ant-menu-submenu-title')
      .then((eles) => eles[0])
      .click()
      .elementsByClassName('ant-menu-submenu-title')
      .then((eles) => eles[1])
      .click()
      .sleep(2000)
      .elementByXPath('//*[@id="sub2$Menu"]/li[1]/a')
      .click()
      .sleep(3000)
      .elementsByClassName('setting-input')
      .then((eles) => eles[0])
      .sendKeys('192.168.0.127')
      .elementsByClassName('plus-button')
      .then(eles => eles[0])
      .click()
      .elementsByClassName('setting-input')
      .then((eles) => eles[1])
      .sendKeys('192.168.0.221')
      .elementsByClassName('setting-input')
      .then((eles) => eles[2])
      .clear()
      .elementsByClassName('plus-button')
      .then(eles => eles[3])
      .click()
      .sleep(2000)
      .elementsByClassName('dynamic-delete-button')
      .then((eles) => eles[1])
      .click()
      .elementsByClassName('setting-submit')
      .then(eles => eles[0])
      .click()
      .sleep(2000)
      .saveScreenshot('pics/config.png')
      .execute(`document.location.reload()`)
      .sleep(7000);
  });

  it('#8 Threshold Config Works', function () {
    return driver
      .elementsByClassName('ant-menu-submenu-title')
      .then((eles) => eles[1])
      .click()
      .sleep(2000)
      .elementByXPath('//*[@id="sub2$Menu"]/li[2]/a')
      .click()
      .sleep(3000)
      .elementsByClassName('ant-tabs-tab')
      .then(eles => eles[1])
      .click()
      .elementsByClassName('ant-input-number-input')
      .then(eles => eles[6])
      .sendKeys(4000)
      .elementByXPath('//*[@id="app"]/div/div[2]/div[2]/div/div[2]/div[2]/form/div[2]/div[2]/div/div/div[1]/span[1]')
      .click().click().click()
      .sleep(2000)
      .elementsByClassName('plus-button')
      .then(eles => eles[1])
      .click()
      .sleep(2000)
      .elementsByClassName('ant-checkbox-input')
      .then(eles => eles[0])
      .click()
      .elementsByClassName('anticon-right')
      .then(eles => eles[0])
      .click()
      .sleep(2000)
      .elementsByClassName('ant-btn-lg')
      .then(eles => eles[1])
      .click()
      .sleep(2000)
      .saveScreenshot('pics/threshold.png')
      .elementsByClassName('setting-submit')
      .then(eles => eles[1])
      .click()
      .sleep(5000);
  });

  after(() => {
    return driver
      .quit();
  });
});