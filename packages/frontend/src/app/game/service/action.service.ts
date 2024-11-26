import { Injectable } from '@angular/core';
import {ActionDisplayManagerService} from "./action-display/action-display-manager.service";
import {ActionContext} from "../../engine/model/action.model";

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(
    private actionDisplayManagerService: ActionDisplayManagerService,
  ) { }

  private actionCompleteCallback(nextActionContext: ActionContext | null): void {
    this.clearActions()
    if (nextActionContext) {
      this.buildActions(nextActionContext)
    } else {
      console.log("Actions Complete")
    }
  }

  buildActions(actionContext: ActionContext): void {
    this.actionDisplayManagerService.buildActions(actionContext, this.actionCompleteCallback)
  }

  clearActions(): void {
    this.actionDisplayManagerService.clearActions()
  }
}
