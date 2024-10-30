import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_iam, aws_s3 } from 'aws-cdk-lib';

export class StateBucketStack extends cdk.Stack {
  readonly bucket: aws_s3.Bucket;

  constructor(scope: Construct, id: string, props: cdk.StackProps, gameMgmtRole: aws_iam.Role) {
    super(scope, id, props);

    this.bucket = new aws_s3.Bucket(this, 'vpaStateBucket', {
      bucketName: 'state.vpa-games.com',
    });
    this.bucket.grantReadWrite(gameMgmtRole);
  }
}
