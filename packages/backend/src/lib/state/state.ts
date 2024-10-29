import {S3Client} from "@aws-sdk/client-s3";
import {EnvVarNames} from "../enum";
import {ensureDefined} from "../util";

export class StateObjectManager {
  readonly bucketName: string
  private readonly s3Client: S3Client

  constructor() {
    this.bucketName = ensureDefined(process.env[EnvVarNames.VPA_STATE_BUCKET_NAME])
    this.s3Client = new S3Client({})
  }

  async putGameStateObject(gameStateObject: any): Promise<void> {

  }
}
