import { TestBed } from '@angular/core/testing';
import {ActionDisplayManagerService} from "../../../app/game/service/action-display/action-display-manager.service";
import {ActionService} from "../../../app/game/service/action.service";
import {ActionContext} from "../../../app/engine/model/action.model";


describe('ActionService', () => {
  let actionService: ActionService;
  let mockActionDisplayManagerService: jasmine.SpyObj<ActionDisplayManagerService>;

  beforeEach(() => {
    mockActionDisplayManagerService = jasmine.createSpyObj('ActionDisplayManagerService', [
      'buildActions',
      'clearActions',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ActionService,
        { provide: ActionDisplayManagerService, useValue: mockActionDisplayManagerService },
      ],
    });

    actionService = TestBed.inject(ActionService);
  });

  describe('buildActions', () => {
    it('should call buildActions on ActionDisplayManagerService with the correct arguments', () => {
      const mockActionContext = { id: 'test-action' } as unknown as ActionContext;

      actionService.buildActions(mockActionContext);

      expect(mockActionDisplayManagerService.buildActions).toHaveBeenCalledWith(
        mockActionContext,
        jasmine.any(Function)
      );
    });
  });

  describe('clearActions', () => {
    it('should call clearActions on ActionDisplayManagerService', () => {
      actionService.clearActions();
      expect(mockActionDisplayManagerService.clearActions).toHaveBeenCalled();
    });
  });

  describe('actionCompleteCallback', () => {
    it('should clear actions when no nextActionContext', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      (actionService as any).actionCompleteCallback(null);
      expect(mockActionDisplayManagerService.clearActions).toHaveBeenCalled();
    });

    it('should clear actions and build new actions when nextActionContext is provided', () => {
      const mockNextActionContext = { id: 'next-action' } as unknown as ActionContext;
      spyOn(actionService, 'buildActions');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      (actionService as any).actionCompleteCallback(mockNextActionContext);
      expect(mockActionDisplayManagerService.clearActions).toHaveBeenCalled();
      expect(actionService.buildActions).toHaveBeenCalledWith(mockNextActionContext);
    });
  });
});
