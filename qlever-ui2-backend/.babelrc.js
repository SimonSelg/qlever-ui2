module.exports = function(api) {
    const isProd = api.cache(() => process.env.NODE_ENV === 'production')
    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        node: true
                    }
                }
            ],
            '@babel/preset-flow'
        ],
        plugins: isProd
            ? [
                  [
                      'module-resolver',
                      {
                          alias: {
                              'qlever-ui2-shared/src': 'qlever-ui2-shared/dist'
                          }
                      }
                  ]
              ]
            : []
    }
}
