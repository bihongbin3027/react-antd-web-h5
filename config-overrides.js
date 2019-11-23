const { override, fixBabelImports, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css'
  }),
  addWebpackAlias({
    // eslint-disable-next-line
    ['@']: path.resolve(__dirname, 'src')
  })
)
