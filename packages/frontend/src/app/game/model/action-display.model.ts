import { Observable } from 'rxjs';
import { ActionCompleteCallback, ActionContext } from '../../engine/model/action.model';

export interface ActionDisplayService {
  ready$: Observable<boolean>;
  buildActions: (actionContext: ActionContext, callback: ActionCompleteCallback) => void;
  clearActions: () => void;
}
