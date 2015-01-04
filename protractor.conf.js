exports.config = {

  directConnect: true,

  capabilities: {
    'browserName': 'chrome'
  },

  specs: ['test/e2e/**/*_spec.js'],

  seleniumAddress: 'http://localhost:4444/wd/hub',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
