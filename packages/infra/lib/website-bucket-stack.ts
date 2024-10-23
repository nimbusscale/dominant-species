import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {aws_s3} from 'aws-cdk-lib'


export class WebsiteBucketStack extends cdk.Stack {
  readonly bucket: aws_s3.Bucket

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new aws_s3.Bucket(this, 'vpaWebsiteBucket', {
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
}


