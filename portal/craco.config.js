const HtmlWebpackPlugin = require('html-webpack-plugin')
const cspHtmlWebpackPlugin = require('csp-html-webpack-plugin')
const config = require('./config.json')
const projectEslintConfig = require('./.eslintrc.js')

const templateParametersGenerator = existingGenerator => (
  compilation,
  assets,
  assetTags,
  options
) => {
  return {
    ...existingGenerator(compilation, assets, assetTags, options),
    favicon: config.favicon || '%PUBLIC_URL%/favicon.png',
  }
}

const cspConfigPolicy = {
  'default-src': "'none'",
  'base-uri': "'self'",
  'object-src': "'none'",
  'script-src': ["'self'"],
  'style-src': ["'self'"],
}

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        assets: `${paths.appSrc}/assets/`,
        components: `${paths.appSrc}/components/`,
        HoCs: `${paths.appSrc}/utils/HoCs/`,
        hooks: `${paths.appSrc}/hooks/`,
        utils: `${paths.appSrc}/utils/`,
        services: `${paths.appSrc}/services/`,
        pages: `${paths.appSrc}/pages/`,
        appredux: `${paths.appSrc}/redux/`,
        styles: `${paths.appSrc}/styles/`,
      }

      webpackConfig.plugins = webpackConfig.plugins.map(plugin => {
        if (plugin.constructor.name === 'HtmlWebpackPlugin') {
          if (env === 'development') {
            plugin = new HtmlWebpackPlugin({
              inject: true,
              template: paths.appHtml,
              title: config.title,
              templateParameters: templateParametersGenerator(
                plugin.options.templateParameters
              ),
            })
          } else {
            plugin = new HtmlWebpackPlugin({
              inject: true,
              template: paths.appHtml,
              templateParameters: templateParametersGenerator(
                plugin.options.templateParameters
              ),
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            })
          }
        }

        return plugin
      })

      if (env === 'production') {
        webpackConfig.plugins.push(new cspHtmlWebpackPlugin(cspConfigPolicy))
      }

      return webpackConfig
    },
  },
  eslint: {
    configure: projectEslintConfig,
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^assets(.*)$': '<rootDir>/src/assets$1',
        '^components(.*)$': '<rootDir>/src/components$1',
        '^HoCs(.*)$': '<rootDir>/src/utils/HoCs$1',
        '^hooks(.*)$': '<rootDir>/src/hooks$1',
        '^utils(.*)$': '<rootDir>/src/utils$1',
        '^testUtils(.*)$': '<rootDir>/src/testUtils$1',
        '^services(.*)$': '<rootDir>/src/services$1',
        '^pages(.*)$': '<rootDir>/src/pages$1',
        '^appredux(.*)$': '<rootDir>/src/redux$1',
        '^styles(.*)$': '<rootDir>/src/styles$1',
        '^content.json$': '<rootDir>/src/content.json',
        '\\.css$': 'identity-obj-proxy',
      },
      testPathIgnorePatterns: [
        '/node_modules/',
        '/testUtils/',
        'setupTests.ts',
        'serviceWorker.ts',
        '/styles/themes/',
        '/src/index.tsx',
        'redux/store.ts',
      ],
      coveragePathIgnorePatterns: [
        '/node_modules/',
        '/testUtils/',
        'setupTests.ts',
        'serviceWorker.ts',
        '/styles/themes/',
        '/src/index.tsx',
        'redux/store.ts',
      ],
    },
  },
}
