// const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');


const port = process.env.PORT || 3000;

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    
    output: {
        filename: 'bundle.[hash].js'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.s?css$/,  // scss & css files
                use: [ 'style-loader', 'css-loader' ]
                
            },
         
            {test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg|ico)$/,
            use: ['file-loader?name=[name].[ext]']},
            

            
        ] 
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html',
            favicon: './public/favicon.ico'
        })
    ],
    devServer: {
        // host: 'localhost',
        disableHostCheck: true,
        port: port,
        historyApiFallback: true,
        open: true
    }
}; 