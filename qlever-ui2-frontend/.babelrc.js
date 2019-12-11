module.exports = function(api) {
    const isProd = api.cache(() => process.env.NODE_ENV === "production");
    const config = {
        "presets": [
            ["@babel/preset-env", {
                useBuiltIns: "usage",
                corejs: 3,
                loose: true
            }],
            "@babel/preset-react",
            "@babel/preset-flow"
        ],
        "plugins": [
            "@babel/plugin-proposal-class-properties",
        ]
    }

    if (!isProd) {
	    config.plugins.push("react-hot-loader/babel")
    } else {
        config.plugins.push('transform-remove-console')
    }

    return config
}
