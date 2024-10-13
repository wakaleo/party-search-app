export default {
  import: ['features/**/*.js'],
  default: {
    require: ['features/**/*.steps.js'], // Load ES module step definitions
    format: ['json:reports/report.json', 'html:reports/report.html'],
    paths: ['features/**/*.feature']
  }
};
