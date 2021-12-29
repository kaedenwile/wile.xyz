#!/bin/zsh

STACK_NAME=InfraStack

# shellcheck disable=SC2016
BUCKET_NAME=$(
  aws cloudformation describe-stack-resources --stack-name "$STACK_NAME" \
  --query 'StackResources[?starts_with(LogicalResourceId, `devBucket`)].PhysicalResourceId' \
  --output text
)
# Use `devBucket` instead of `websiteBucket` for testing

[ -z "$BUCKET_NAME" ] && exit 1

aws s3 sync dist "s3://$BUCKET_NAME" --exclude '*.html' --acl bucket-owner-full-control --acl public-read

# UPLOAD WITHOUT .HTML SUFFIX
for html in $(find dist -name '*.html'); do
  aws s3 cp $html "s3://$BUCKET_NAME/$(echo $html | sed "s/dist\/\(.*\)\.html$/\1/")" --content-type text/html --acl bucket-owner-full-control --acl public-read --metadata-directive REPLACE
done

echo "\n******************\n* UPLOADED TO:\n*\thttp://${BUCKET_NAME}.s3-website-us-west-2.amazonaws.com\n******************"
