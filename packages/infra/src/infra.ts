#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WebsiteBucketStack } from './lib/website-bucket-stack';
import { UserPoolStack } from './lib/user-pool-stack';
import { VpaGamesTableStack } from './lib/vpa-game-table-stack';
import { GameMgmtStack } from './lib/game-mgmt-stack';
import { IamStack } from './lib/iam-stack';
import { StateBucketStack } from './lib/state-bucket-stack';

const stackProps = {
  env: { account: '011528296709', region: 'us-east-2' },
};

const app = new cdk.App();
new WebsiteBucketStack(app, 'vpaWebsiteBucket', stackProps);
const stateBucketStack = new StateBucketStack(app, 'vpaStateBucket', stackProps);
const iamStack = new IamStack(app, 'vpaIam', stackProps, stateBucketStack.bucket);
const vpaGameTable = new VpaGamesTableStack(app, 'vpaGameTable', stackProps, iamStack.gameMgmtRole);
const vpaUserPool = new UserPoolStack(
  app,
  'vpaUserPool',
  stackProps,
  iamStack.gameMgmtRole,
  vpaGameTable.table,
);
new GameMgmtStack(
  app,
  'vpaGameMgmt',
  stackProps,
  iamStack.gameMgmtRole,
  vpaGameTable.table,
  vpaUserPool.userPool,
  stateBucketStack.bucket,
);
