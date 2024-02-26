#!/bin/bash

STACK_NAME=InfraStack
BUCKET_NAME=${BUCKET_NAME:-devBucket} # Use `websiteBucket` instead of `devBucket` for prod

# shellcheck disable=SC2016
BUCKET_ID=$(
  aws cloudformation describe-stack-resources --stack-name "$STACK_NAME" \
  --query "StackResources[?starts_with(LogicalResourceId, \`$BUCKET_NAME\`)].PhysicalResourceId" \
  --output text
)

[ -z "$BUCKET_ID" ] && exit 1

aws s3 sync dist "s3://$BUCKET_ID" --exclude '*.html' --acl bucket-owner-full-control --acl public-read

# UPLOAD WITHOUT .HTML SUFFIX
for html in $(find dist -name '*.html'); do
  aws s3 cp $html "s3://$BUCKET_ID/$(echo $html | sed "s/dist\/\(.*\)\.html$/\1/")" --content-type text/html --acl bucket-owner-full-control --acl public-read --metadata-directive REPLACE
done

# CFN INVALIDATION
if [ $BUCKET_NAME = "websiteBucket" ]; then
  echo "Invalidating CloudFront distribution"

  CF_DISTRO=$(
    aws cloudformation describe-stack-resources --stack-name "$STACK_NAME" \
    --query "StackResources[?ResourceType == \`AWS::CloudFront::Distribution\`].PhysicalResourceId" \
    --output text
  )

  aws cloudfront create-invalidation --distribution-id "$CF_DISTRO" --paths "/*"
fi

echo -e "\n******************\n* UPLOADED TO:\n*\thttp://${BUCKET_ID}.s3-website-us-west-2.amazonaws.com\n******************"