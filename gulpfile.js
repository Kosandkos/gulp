const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const sourceMaps = require('gulp-sourcemaps');
const del = require('del');
const less = require('gulp-less');
const browserSync=require('browser-sync').create();

const clean = () => {
    return del('del')
}

const styles = () => {
 return src('src/style/**/*.css')
  .pipe(sourceMaps.init())
  .pipe(concat('main.css'))
  .pipe(autoprefixer('last 2 versions'))
  .pipe(cleanCSS({ level:2 }))
  .pipe(sourceMaps.write())
  .pipe(dest('dist'))
  .pipe(browserSync.stream())
}

const styleLess = () => {
    return src('src/less/**/*.less')
      .pipe(less())
      .pipe(concat('less.css'))
      .pipe(dest('dist'));
};

const htmlMinify = () => {
    return src('src/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace:true
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

const svgSprites = () => {
	return src('src/images/svg/**/*.svg')
		.pipe(svgSprite({
            mode:{
                stack:{
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/images'))
        .pipe(browserSync.stream());

        }

const images = () => {
    return src([
        'src/images/**/*.jpg',
        'src/images/**/*.jpeg',
        'src/images/**/*.png',
        'src/images/*.svg'
    ])
    .pipe(image())
    .pipe(dest('dist/images'))
    .pipe(browserSync.stream())
}
const scripts = () => {
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js'
    ])
    .pipe(sourceMaps.init())
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify({
        toplevel:true
    }).on('error',notify.onError()))
    .pipe(sourceMaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const resources = () =>{
    return src('src/resources/**')
        .pipe(dest('dist'))
}

const watchFile = () => {
    browserSync.init({
        server:{
            baseDir:'dist' //директория index
        }
    })
}

watch('src/resources/**',resources);
watch('src/**/*.html',htmlMinify);
watch('src/style/**/*.css',styles);
watch('src/images/svg/**/*.svg',svgSprites);
watch([
    'src/images/**/*.jpg',
    'src/images/**/*.jpeg',
    'src/images/**/*.png',
    'src/images/*.svg'
],images)
watch('src/scripts/**/*.js',scripts);

exports.styles = styles;
exports.htmlMinify = htmlMinify;
exports.scripts= scripts;
exports.clean = clean;
exports.default = series(clean, styles, styleLess, htmlMinify, svgSprites, images, scripts, resources, watchFile);