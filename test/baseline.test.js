require('should');
const path = require('path');
const wd = require('macaca-wd');

describe('Macaca UI Test', function() {
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
      .setWindowSize(800, 600);
  });

  it('#1 it should works', function() {
    const initialURL = 'http://localhost:3456';
    return driver
      .get(initialURL)
      .sleep(3000)
      .title()
      .then(title => {
        title.should.containEql('Monitor');
      })
      .source()
      .then(html => {
        html.should.containEql('Monitor');
      })
      .saveScreenshot('temp.png');
  });
  after(() => {
    return driver
      .quit();
  });
});

