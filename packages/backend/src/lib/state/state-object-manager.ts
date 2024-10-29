import {GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {EnvVarNames} from "../enum";
import {ensureDefined} from "../util";
import {GameState} from "api-types/src/game-state";

export class StateObjectManager {
  readonly bucketName: string
  private readonly s3Client: S3Client

  constructor() {
    this.bucketName = ensureDefined(process.env[EnvVarNames.VPA_STATE_BUCKET_NAME])
    this.s3Client = new S3Client({})
  }

  private buildKey(gameId: string, patch: number): string {
    return `${gameId}/${gameId}.${String(patch)}.json`
  }

  private async getObject(key: string): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    })

    try {
      return await this.s3Client.send(command)
    } catch (error) {
      console.error(`Failed Get: ${key}`)
      throw error
    }
  }

  private async GameStateFromCmdOutput(getObjectCmdOutput: GetObjectCommandOutput): Promise<GameState> {
    if (getObjectCmdOutput.Body) {
      const body = await getObjectCmdOutput.Body.transformToString()
      try {
        return JSON.parse(body) as GameState
      } catch (error) {
        throw new Error('Failed to parse body')
      }
    } else {
      throw new Error(`Object had no body`)
    }
  }

  async getGameState(gameId: string, patch: number): Promise<GameState> {
    const key = this.buildKey(gameId, patch)
    const response = await this.getObject(key)
    try {
      return await this.GameStateFromCmdOutput(response)
    } catch (error) {
      console.error(`Failed to GameState object: ${key}`)
      throw error
    }
  }

  async putGameState(gameState: GameState): Promise<void> {
    const key = this.buildKey(gameState.id, gameState.patch)
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: 'application/json',
      Body: JSON.stringify(gameState)
    })

    try {
      await this.s3Client.send(command)
      console.log(`Put: ${key}`)
    } catch (error) {
      console.error(`Failed Put: ${key}`)
      throw error
    }
  }
}
