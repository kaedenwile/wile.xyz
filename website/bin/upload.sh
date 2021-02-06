#!/bin/zsh

STACK_NAME=InfraStack

# shellcheck disable=SC2016
BUCKET_NAME=$(
  aws cloudformation describe-stack-resources --stack-name "$STACK_NAME" \
  --query 'StackResources[?starts_with(LogicalResourceId, `websiteBucket`)].PhysicalResourceId' \
  --output text
)

aws s3 sync public "s3://$BUCKET_NAME" --acl bucket-owner-full-control --acl public-read
