/** 
 *@author Rolf bansbach
 */

module.exports = config();

function config() {
    var paths = {
        app: './app/',
        styles: './css/',
        dist: './dist/'
    };
    
    var mainAppFile = 'game1.js';
    var mainStylesFile = 'game1.css';
    
    var config =  {
        source: {
            scripts: [
                paths.app + '**/*.js',
                paths.app + mainAppFile,
            ],
            styles: [
                paths.styles + 'game1.scss',
                paths.app + '**/*.scss'
            ]
        },
        build: {
            scriptsDest: paths.dist,
            appFile: mainAppFile,
            stylesDest: paths.dist,
            stylesFile: mainStylesFile
        }
    };
    
    return config;
};
