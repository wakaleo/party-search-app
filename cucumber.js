export default {
  import: ['features/**/*.js'],
  default: {
    requireModule: ['@playwright/test'], // Ensures Playwright is loaded
    require: ['features/step_definitions/*.js'], // Load ES module step definitions
    format: ['json:reports/report.json', 'html:reports/report.html'],
    paths: ['features/**/*.feature']
  }
};
