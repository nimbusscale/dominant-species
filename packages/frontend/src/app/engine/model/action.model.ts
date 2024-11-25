import {Space} from "./space.model";

export interface ActionContext {
  actionId: string,
  currentPlayerFactionId: string
}


export type ActionFunction = () => ActionContext | null

/**
 * Type for a factory function that create ActionFunctions that are added to Spaces.
 */
export type SpaceActionFunctionFactory = (
  space: Space,
  actionContext: ActionContext,
  ...args: object[]
) => ActionFunction

export type ActionCompleteCallback = (nextActionContext: ActionContext | null) => void

export class Action {
  constructor(
    public readonly actionContext: ActionContext,
    private readonly actionFunction: ActionFunction,
    private readonly actionCompleteCallBack: ActionCompleteCallback
  ) {}
  execute(): void {
    const nextActionContext = this.actionFunction()
    this.actionCompleteCallBack(nextActionContext)
  }

  get id(): string {
    return this.actionContext.actionId
  }
}


