'use strict';

var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


var env = process.env.NODE_ENV;
var config = {

    module: {
        rules: [
            {
                test: /\.jsx?$/,

                use: [{
                    loader: 'babel-loader',
                    options:{
                        //         retainLines:true,
                        babelrc:false,
                        presets: [
                            ["es2015", {"modules": false}],
                            "stage-2",
                            "react"
                        ],
                        plugins: [ "transform-decorators-legacy"]
                    }
                }],

                exclude: /node_modules/

            }
        ],
    },


    entry: "./src/index.js",
    output: {
        path:'./dist',
        filename:'mobxTinyRouter.js',
        library: 'mobxTinyRouter',
        libraryTarget: 'umd'
    },

    devtool: 'source-map',
    externals: {
        "mobx": {
            commonjs: "mobx",
            commonjs2: "mobx",
            amd: "mobx",
            root: "mobx"
        },
        "mobx-utils": {
            commonjs: "mobx-utils",
            commonjs2: "mobx-utils",
            amd: "mobx-utils",
            root: "mobx-utils"
        },
        "mobx-react":{
            commonjs: "mobx-react",
            commonjs2: "mobx-react",
            amd: "mobx-react",
            root: "mobx-react"
        },
        "react":{
            root: 'react',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        })
    ]
};

if (env === 'production') {
    config.plugins.push(
        new UglifyJSPlugin({
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false,
                screw_ie8: true
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                screw_ie8: true
            }
        })
    )
}

module.exports = config;