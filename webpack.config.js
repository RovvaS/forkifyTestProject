const path = require('path');

module.exports = {
    entry: './src/js/index.js',
    output: {
        // path:path.resolve(__dirname,'dist/js'),
        path: 'C:\\Users\\Vasil\\Desktop\\Repos\\forkifyTRY\\dist',
        filename: 'js/bundle.js'
    },
    devServer:{
        contentBase:'./dist'
    }
}