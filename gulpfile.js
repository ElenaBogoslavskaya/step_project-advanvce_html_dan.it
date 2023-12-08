import gulp from "gulp";
const { src, dest, watch, series, parallel } = gulp;

import imagemin from "gulp-imagemin";
import autoprefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import clean from "gulp-clean";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);

import bsc from "browser-sync";
const browserSync = bsc.create();

const cssTaskHandler = () => {
  return src("./src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(dest("./styles/css"))
    .pipe(browserSync.stream());
};

const imagesTaskHandler = () => {
  return src("./src/images/*")
    .pipe(imagemin())
    .pipe(dest("./images/"))
    .pipe(browserSync.stream());
};

const fontTaskHandler = () => {
  return src("./src/fonts/**/*.*").pipe(dest("./styles/fonts"));
};

const browserSyncTaskHandler = () => {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });

  watch("./src/scss/**/*.scss").on(
    "all",
    series(cssTaskHandler, browserSync.reload)
  );
  watch("./src/images/").on(
    "all",
    series(imagesTaskHandler, browserSync.reload)
  );
};

export const css = cssTaskHandler;
export const font = fontTaskHandler;
export const images = imagesTaskHandler;

export const build = series(
  parallel(cssTaskHandler, fontTaskHandler, imagesTaskHandler)
);
export const dev = series(build, browserSyncTaskHandler);
