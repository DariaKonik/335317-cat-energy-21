const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const htmlmin = require("gulp-htmlmin");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const uglify = require("gulp-uglify-es");
const del = require("del");


//Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
   .pipe(imagemin([
     imagemin.optipng({optimizationLevel: 3}),
     imagemin.mozjpeg({progressive: true}),
     imagemin.svgo()
   ]))
  .pipe(gulp.dest("build/img"))
}

exports.images = images;

// Webp

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

//Sprite

const sprite = () => {
  return gulp.src("source/img/*.svg")
  .pipe(svgstore())
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;


//HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
}

exports.html = html;

//Scripts

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

//Copy

const copy = () => {
 gulp.src([
 "source/fonts/*.{woff2,woff}",
 "source/*.ico",
 "source/img/**/*.{jpg,png,svg}",
  ],
  {
    base: "source"
  })
  .pipe(gulp.dest("build"));
}

exports.copy = copy;

//Clean

const clean = () => {
  return del ("build");
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}


//Build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy,
    sprite,
    images,
    createWebp,
));

exports.build = build;

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy,
    sprite,
    createWebp,
  ),
  gulp.series(
    server,
    watcher
  ));
