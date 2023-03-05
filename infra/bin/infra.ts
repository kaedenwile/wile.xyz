#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraStack } from '../lib/infra-stack';

const { ACCOUNT, REGION, CERT_ID } = process.env;

if (!ACCOUNT || !REGION || !CERT_ID) {
    throw new Error('Missing environment variables.');
}

const app = new cdk.App();
new InfraStack(app, 'InfraStack', {
    env: {
        account: ACCOUNT,
        region: REGION,
    },
    certificate_id: CERT_ID,
});
