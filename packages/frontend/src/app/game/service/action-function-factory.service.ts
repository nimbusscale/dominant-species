import { Injectable } from '@angular/core';
import { AnimalProviderService } from './animal-provider.service';
import { Space } from '../../engine/model/space.model';
import { ActionContext, ActionFunction } from '../../engine/model/action.model';
import { ActionIdEnum } from '../constant/action.constant';
import { ElementPiece } from '../model/element.model';

@Injectable({
  providedIn: 'root',
})
export class ActionFunctionFactoryService {
  constructor(private animalProviderService: AnimalProviderService) {}

  buildPlaceActionPawnInSpace(actionContext: ActionContext, space: Space): ActionFunction {
    return (): ActionContext => {
      const animal = this.animalProviderService.get(actionContext.currentPlayerFactionId);
      const actionPawn = animal.actionPawn.pullOne();
      if (actionPawn) {
        space.addPiece(actionPawn);
      } else {
        throw new Error('Animal has not ActionPawns to place.');
      }
      return {
        currentPlayerFactionId: actionContext.currentPlayerFactionId,
        actionId: ActionIdEnum.TAKE_ELEMENT,
      };
    };
  }

  buildTakeElementFromSpace(actionContext: ActionContext, space: Space): ActionFunction {
    return (): null => {
      const animal = this.animalProviderService.get(actionContext.currentPlayerFactionId);
      const element = space.removePiece() as ElementPiece;
      animal.elements.addElement(element);
      return null;
    };
  }
}
