#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WebsiteBucketStack } from './lib/website-bucket-stack';
import { UserPoolStack } from './lib/user-pool-stack';
import { VpaGamesTableStack } from './lib/vpa-game-table';
import { GameMgmtStack } from './lib/game-mgmt-stack';

const stackProps = {
  env: { account: '011528296709', region: 'us-east-2' },
};

const app = new cdk.App();
new WebsiteBucketStack(app, 'vpaWebsiteBucket', stackProps);
const vpaGameTable = new VpaGamesTableStack(app, 'vpaGameTable', stackProps);
const vpaGameMgmt = new GameMgmtStack(app, 'vpaGameMgmt', stackProps, vpaGameTable.table);
new UserPoolStack(
  app,
  'vpaUserPool',
  stackProps,
  vpaGameMgmt.addUserToTableFromSignUpFunction,
);
