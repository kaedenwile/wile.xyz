#!/bin/zsh

STACK_NAME=InfraStack

# shellcheck disable=SC2016
BUCKET_NAME=$(
  aws cloudformation describe-stack-resources --stack-name "$STACK_NAME" \
  --query 'StackResources[?starts_with(LogicalResourceId, `websiteBucket`)].PhysicalResourceId' \
  --output text
)

# Use `devBucket` instead of `websiteBucket` for testing

aws s3 sync public "s3://$BUCKET_NAME" --delete --exclude '*.html' --acl bucket-owner-full-control --acl public-read

# UPLOAD WITHOUT .HTML SUFFIX
for html in $(find public -name '*.html'); do
  aws s3 cp $html "s3://$BUCKET_NAME/$(echo $html | sed "s/public\/\(.*\)\.html$/\1/")" --content-type text/html --acl bucket-owner-full-control --acl public-read --metadata-directive REPLACE
done 