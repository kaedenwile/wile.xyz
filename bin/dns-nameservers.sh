#!/bin/zsh
# shellcheck disable=SC2016 disable=SC2046

STACK_NAME=InfraStack
DOMAIN=wile.xyz

HOSTED_ZONE_ID=$(
  aws cloudformation describe-stack-resources --stack-name "$STACK_NAME" \
  --query 'StackResources[?starts_with(LogicalResourceId, `websiteHostedZone`)].PhysicalResourceId' \
  --output text
)

NAME_SERVERS=$(
  aws route53 get-hosted-zone --id "$HOSTED_ZONE_ID" \
  --query 'DelegationSet.NameServers'
)

aws route53domains update-domain-nameservers \
  --region us-east-1 \
  --domain-name "$DOMAIN" \
  --nameservers $(jq -r '. | "Name="+join(" Name=")' <<< "$NAME_SERVERS")
