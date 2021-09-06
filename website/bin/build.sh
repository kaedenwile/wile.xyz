#!/bin/zsh

mkdir -p public

# Copy over HTML and pdf
cp src/*.html public
cp src/*.pdf public

# Copy over fonts
cp -r src/font public

# copy over images
cp -r src/img public

# Compile/Copy CSS
sass src/style:public/style

# Compile JS
npm run build
cp -r src/js public