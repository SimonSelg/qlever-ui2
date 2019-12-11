module.exports = function(api) {
    const isProd = api.cache(() => process.env.NODE_ENV === "production");
    const config = {
        "presets": [
            ["@babel/preset-env", {
                "targets": {
                    "browsers": ["last 2 Chrome versions", "last 2 Firefox versions"]
                }
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
