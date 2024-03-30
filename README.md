# wile.xyz website

This repository contains all the code for my
[personal website](https://wile.xyz). The site is written in React + TanStack, built with Vite,
and pulls some copy from Notion. It's hosted on AWS, all infrastructure is configured 
via CDK, and CICD runs on GitHub Actions.

## Project Overview

This repo leverages yarn workspaces to separate logical components into separate packages.

- `pkg/site` is the primary React app that makes up the website
- `pkg/battleground` is the engine and simulation that plays on the home screen
- `pkg/notion-loader` is a helper tool for pulling data from Notion
- `infra` contains the CDK code for spinning up infrastructure

Additionally, there is a `.github` folder that defines workflows.

## Getting Started

After downloading the repo and running `yarn install`, you can launch the website by running:
```shell
yarn dev
```

To spin up the infrastructure, run:
```shell
yarn cdk deploy
```

To deploy the website, run:
```shell
yarn build
yarn deploy
```

## Infra

This website is hosted using static website hosting in Amazon S3, fronted by AWS CloudFront. A Route53 hosted zone for
my domain contains an ARecord that points to the CloudFront distribution. My account also contains a valid ACM
certificate for serving HTTPS. 

To facilitate the GitHub Actions Deployment, a IAM user is created with minimal permissions: describe cloudformation
resources and S3 list, put, and delete. The `accessKeyId` and `secretAccessKey` are available as CloudFormation outputs.

## Website

The primary React application lives in `pkg/site/src`. The app is built with Vite and uses TanStack Router. The battleground
and notion-loader packages are both dependencies used within this package.

A few helpful scripts:
- `yarn dev` to start the Vite dev server
- `yarn sync` calls `bin/loadNotionData.ts` to populate `src/home/data.json` and `src/belt/data.json` with the latest
  data from notion.
- `yarn deploy` calls `bin/deploy.ts` to upload the site to S3 and create a cloudfront invalidation.

### Site Map

Right now the website is pretty simple.

- index
- belt
- belt/whats-new
- colony
