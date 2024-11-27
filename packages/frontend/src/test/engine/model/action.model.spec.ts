import {Action, ActionCompleteCallback, ActionContext, ActionFunction} from "../../../app/engine/model/action.model";

describe('Action', () => {
  let actionContext: ActionContext;
  let mockActionFunction: jasmine.Spy<ActionFunction>;
  let mockActionCompleteCallback: jasmine.Spy<ActionCompleteCallback>;
  let action: Action;

  beforeEach(() => {
    actionContext = {
      actionId: 'test-action-1',
      currentPlayerFactionId: 'faction-1'
    };

    mockActionFunction = jasmine.createSpy('mockActionFunction');
    mockActionCompleteCallback = jasmine.createSpy('mockActionCompleteCallback');

    action = new Action(actionContext, mockActionFunction, mockActionCompleteCallback);
  });

  describe('constructor', () => {
    it('actionContext should be readable', () => {
      expect(action.actionContext).toEqual(actionContext);
    });
  });

  describe('execute', () => {
    it('should call actionFunction and pass its result to actionCompleteCallback', () => {
      const mockNextContext: ActionContext = {
        actionId: 'next-action',
        currentPlayerFactionId: 'faction-2'
      };
      mockActionFunction.and.returnValue(mockNextContext);

      action.execute();

      expect(mockActionFunction).toHaveBeenCalled();
      expect(mockActionCompleteCallback).toHaveBeenCalledWith(mockNextContext);
    });

    it('should handle null result from actionFunction', () => {
      mockActionFunction.and.returnValue(null);

      action.execute();

      expect(mockActionFunction).toHaveBeenCalled();
      expect(mockActionCompleteCallback).toHaveBeenCalledWith(null);
    });
  });

  describe('id getter', () => {
    it('should return the actionContext actionId', () => {
      expect(action.id).toBe(actionContext.actionId);
    });
  });
});
