#!/bin/zsh

mkdir -p public

# Copy over HTML
cp ./*.html public

# Compile/Copy CSS
sass style:public/style

# Compile JS
npm run build
cp -r dist public/dist