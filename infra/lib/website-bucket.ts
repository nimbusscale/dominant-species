import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib'


export class WebsiteBucket extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }

  websiteBucket = new s3.Bucket(this, 'vpaWebsiteBucket', {
    bucketName: 'www.vpa-games.com',
    websiteIndexDocument: 'index.html',
    publicReadAccess: true,
    blockPublicAccess: {
      blockPublicPolicy: false,
      blockPublicAcls: false,
      ignorePublicAcls: false,
      restrictPublicBuckets: false,
    },
  })
}


