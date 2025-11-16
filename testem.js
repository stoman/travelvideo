'use strict';

module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_start_timeout: 180,
  browser_paths: {
    Chrome: '/tmp/chrome/chrome-linux/chrome',
  },
  browser_args: {
    Chrome: [
      '--no-sandbox',
      '--headless',
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--single-process',
      '--mute-audio',
      '--remote-debugging-port=0',
      '--window-size=1440,900',
    ],
  },
};
