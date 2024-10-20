#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WebsiteBucket } from '../lib/website-bucket';
import {UserPool} from "../lib/user-pool";

const stackProps = {
  env: {account: '011528296709', region: 'us-east-2'}
}

const app = new cdk.App();
new WebsiteBucket(app, 'WebsiteBucket', stackProps);
new UserPool(app, 'UserPool', stackProps);
