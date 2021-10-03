#!/bin/zsh

mkdir -p public

# Copy over HTML and pdf
cp src/*.html public
cp src/*.pdf public
cp -r src/belt public

# Copy over fonts
cp -r src/font public

# copy over images & favicons
cp -r src/img public
cp -r src/icons public

# Compile/Copy CSS
sass src/style:public/style

# Compile JS
npm run build
cp -r src/js public