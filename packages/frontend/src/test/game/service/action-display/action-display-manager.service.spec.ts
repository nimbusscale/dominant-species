import { BehaviorSubject } from 'rxjs';
import { ActionDisplaySetupManager } from '../../../../app/game/service/action-display/action-display-manager.service';
import { ActionDisplayServiceWithSetup } from '../../../../app/game/model/action-display.model';

describe('ActionDisplaySetupManager', () => {
  let actionDisplaySetupManager: ActionDisplaySetupManager;
  let mockService1: jasmine.SpyObj<ActionDisplayServiceWithSetup>;
  let mockService2: jasmine.SpyObj<ActionDisplayServiceWithSetup>;
  let mockReadySubject1: BehaviorSubject<boolean>;
  let mockReadySubject2: BehaviorSubject<boolean>;

  beforeEach(() => {
    mockReadySubject1 = new BehaviorSubject<boolean>(false);
    mockService1 = jasmine.createSpyObj('ActionDisplayServiceWithSetup', ['setup'], {
      ready$: mockReadySubject1.asObservable(),
    });

    mockReadySubject2 = new BehaviorSubject<boolean>(false);
    mockService2 = jasmine.createSpyObj('ActionDisplayServiceWithSetup', ['setup'], {
      ready$: mockReadySubject2.asObservable(),
    });

    actionDisplaySetupManager = new ActionDisplaySetupManager([mockService1, mockService2]);
  });
  describe('ready$', () => {
    it('should emit false when no service is ready', (done) => {
      actionDisplaySetupManager.ready$.subscribe((isReady) => {
        expect(isReady).toBeFalse();
        done();
      });
    });
    it('should emit false when not all services ready', (done) => {
      mockReadySubject1.next(true);

      actionDisplaySetupManager.ready$.subscribe((isReady) => {
        expect(isReady).toBeFalse();
        done();
      });
    });
    it('should emit true when all services ready', (done) => {
      mockReadySubject1.next(true);
      mockReadySubject2.next(true);

      actionDisplaySetupManager.ready$.subscribe((isReady) => {
        expect(isReady).toBeTrue();
        done();
      });
    });
  });
});
