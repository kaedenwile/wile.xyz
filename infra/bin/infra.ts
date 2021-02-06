#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraStack } from '../lib/infra-stack';

const env = {region: 'us-west-2'};
const app = new cdk.App();
new InfraStack(app, 'InfraStack', {env});
