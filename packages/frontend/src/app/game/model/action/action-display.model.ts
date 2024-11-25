import {Space} from "../../../engine/model/space.model";
import {ActionContext, ActionFunction} from "../../../engine/model/action.model";
import {AnimalProviderService} from "../../service/animal-provider.service";
import {ActionIdEnum} from "../../constant/action.constant";
import {ElementPiece} from "../element.model";

export function placeActionPawnActionFunctionFactory(space: Space, actionContext: ActionContext, animalProviderService: AnimalProviderService): ActionFunction {
  return (): ActionContext => {
    const animal = animalProviderService.get(actionContext.currentPlayerFactionId);
    const actionPawn = animal.actionPawn.pullOne();
    if (actionPawn) {
      space.addPiece(actionPawn)
    } else {
      throw new Error("Animal has not ActionPawns to place.")
    }
    return {
      currentPlayerFactionId: actionContext.currentPlayerFactionId,
      actionId: ActionIdEnum.TAKE_ELEMENT
    }
  }
}

export function takeElementActionFunctionFactory(space: Space, actionContext: ActionContext, animalProviderService: AnimalProviderService): ActionFunction {
  return (): null => {
    const animal = animalProviderService.get(actionContext.currentPlayerFactionId);
    const element = space.removePiece() as ElementPiece
    animal.elements.addElement(element)
    return null
  }
}
