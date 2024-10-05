#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WebsiteBucket } from '../lib/website-bucket';

const app = new cdk.App();
new WebsiteBucket(app, 'WebsiteBucket', {
  env: { account: '011528296709', region: 'us-east-2' },
});
