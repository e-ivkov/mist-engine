const path = require('path');

module.exports = {
    entry: "./sample-game/src/index.ts",
    output: {
        path: path.resolve(__dirname, 'sample-game/dist'),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ }
        ]
    }
}