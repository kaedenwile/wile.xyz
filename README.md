# XYZ Website

Welcome to the personal website for Kaeden Wile! This repository contains all the code for my
[personal website](https://wile.xyz). The website is written using HTML5, [SCSS](https://sass-lang.com), and
[TypeScript](https://www.typescriptlang.org) and is compiled using [Webpack](https://webpack.js.org). Everything is
hosted in [AWS](https://aws.amazon.com), all infrastructure is configured using CDK, and I even configured some cool
automations using [GitHub Actions](https://github.com/features/actions).

## Project Overview

This repo is essentially a mono-repo containing the two separate halves of the project:

-   `infra` contains the CDK code for spinning up hosting infrastructure
-   `website` contains the HTML, CSS, JS, and other assets that make up the website

Each of these folders contains their own README that goes into greater depth for setup.

Additionally, there is a `.github` folder that defines workflows.

## Infra

_For help to get started with CDK setup, see `infra/README.md`_

All the following infrastructure is defined using CDK, which itself relies on CloudFormation. The code is TypeScript.

This website is hosted using static website hosting in Amazon S3, fronted by AWS CloudFront. A Route53 hosted zone for
my domain contains an ARecord that points to the CloudFront distribution. My account also contains a valid ACM
certificate for serving HTTPS. Additionally, there's an S3 bucket called `devBucket` that is used for testing and is not
fronted by CloudFront.

To facilitate the GitHub Actions Deployment, a IAM user is created with minimal permissions: describe cloudformation
resources and S3 list, put, and delete. The `accessKeyId` and `secretAccessKey` are available as CloudFormation outputs.

## Workflows

Today, the repo contains only 1 automation: when there is a push on the `main` branch, deploy the latest version of the
website.

A few things to highlight:

-   Using `actions/setup-node@v2` to cache the `NPM install` step
-   `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are secrets stored in GitHub and hold creds for `DeploymentUser` based
    on the CloudFormation outputs.
-   Invoking `website/bin/upload.sh` with `BUCKET_NAME=websiteBucket` explicitly uploads to prod environment

## Website

_For help to build the website, see `website/README.md`_

The website code and assets all live in `website/src`. Styling is done with scss and scripting is done with TypeScript,
both of which need to be transpiled to browser-readable css and JavaScript. For that, we use Webpack which additionally
handles versioning and minifying the assets.

I don't want the user to navigate to the URL `wile.xyz/belt.html` or `wile.xyz/belt/`, which is the normal behavior for
keeping the `.html` extension or refactoring to `belt/index.html`. For development purposes that's okay, which is why
`wile.xyz/belt` is actually in `website/src/belt/index.html`. For production, we need a different solution. That's why
`website/bin/upload.sh` runs `sync --exclude '*.html'` and manually copies those files to the bucket, dropping the
extension and giving appropriate metadata.

### Site Map

Right now the website is pretty simple. There are 2 main pages:

-   index
-   belt
    -   belt/whats-new
    -   belt/privacy-policy.pdf
