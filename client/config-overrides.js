const { override, addWebpackPlugin } = require('customize-cra');

module.exports = override(
  (config) => {
    // Disable CSS minification
    if (config.optimization && config.optimization.minimizer) {
      config.optimization.minimizer = config.optimization.minimizer.filter(
        (minimizer) => minimizer.constructor.name !== 'CssMinimizerPlugin'
      );
    }
    
    return config;
  }
);