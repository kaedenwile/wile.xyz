# XYZ Website Code

## Getting Started
Make sure you have the `aws` cli and `sass` installed. 
* To install `aws`, on Mac run `brew install awscli` and `aws configure`.
* To install `sass`, on Mac run `brew install sass/sass/sass`

Now just run `npm install` and you're good to go!

## Deploying to Beta
After making your changes, run the following script to test your changes in S3:
```shell
npm run clean && npm run build && bin/upload.sh
```

If everything runs successfully, at the end of the output there will be a link similar to
`http://infrastack-devbucketabcdefgh-1234567890xyz.s3-website-us-west-2.amazonaws.com`. Follow that link and see what
the website should look like in production!

## Deploy to Prod
The code is automatically pushed to the production bucket whenever a commit is made to the `main` branch.

## Adding a new page

Every time you add a new page, you need to update the webpack configuration. Remember to add a `HtmlWebpackPlugin`
entry to plugins at the bottom.