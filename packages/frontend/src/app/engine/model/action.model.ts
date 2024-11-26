import {Space} from "./space.model";

export interface ActionContext {
  actionId: string,
  currentPlayerFactionId: string
}


export type ActionFunction = () => ActionContext | null
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


