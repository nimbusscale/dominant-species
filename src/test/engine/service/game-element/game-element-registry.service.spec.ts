import { TestBed } from '@angular/core/testing';

import { Pile, PileState } from '../../../../app/engine/model/pile.model';
import { deepClone } from 'fast-json-patch';
import { testPileState1, testPileState2 } from '../../game-state-test.constant';
import { skip } from 'rxjs';
import { PileStateService } from '../../../../app/engine/service/game-element/pile-state.service';
import { PileRegistryService } from '../../../../app/engine/service/game-element/pile-registry.service';

/**
 * PileRegistryService is an implementation of GameElementRegistryService and provides sufficient testing of GameElementRegistryService
 */
describe('PileRegistryService', () => {
  let pileRegistrySvc: PileRegistryService;
  let pileStateSvcSpy: jasmine.SpyObj<PileStateService>;
  let testPile1: Pile;
  let testPile2: Pile;

  beforeEach(() => {
    const pileStateSvcSpyObj = jasmine.createSpyObj('PileStateService', ['register']);

    // These probably should be mocks /
    testPile1 = new Pile(deepClone(testPileState1) as PileState);
    testPile2 = new Pile(deepClone(testPileState2) as PileState);

    TestBed.configureTestingModule({
      providers: [PileRegistryService, { provide: PileStateService, useValue: pileStateSvcSpyObj }],
    });

    pileRegistrySvc = TestBed.inject(PileRegistryService);
    pileStateSvcSpy = TestBed.inject(PileStateService) as jasmine.SpyObj<PileStateService>;
  });

  describe('register', () => {
    it('should allow registration of new piles and register them with state svc', () => {
      const piles: Pile[] = [testPile1, testPile2];
      pileRegistrySvc.register(piles);
      expect(pileStateSvcSpy.register).toHaveBeenCalledWith(piles);
    });
    it('updates and emits registeredPiles$', (done) => {
      pileRegistrySvc.registeredIds$.pipe(skip(1)).subscribe((pileIds) => {
        expect(pileIds.has(testPile1.id)).toBeTrue();
        done();
      });
      pileRegistrySvc.register([testPile1]);
    });
    it('show throw error if registering already registered pile', () => {
      pileRegistrySvc.register([testPile1, testPile2]);
      expect(() => {
        pileRegistrySvc.register([testPile1]);
      }).toThrowError();
    });
  });
  describe('get', () => {
    it('should return registered piles', () => {
      pileRegistrySvc.register([testPile1, testPile2]);
      expect(pileRegistrySvc.get(testPile1.id)).toEqual(testPile1);
      expect(pileRegistrySvc.get(testPile2.id)).toEqual(testPile2);
    });
    it('should throw error if getting unregistered pile', () => {
      expect(() => {
        pileRegistrySvc.get(testPile1.id);
      }).toThrowError();
    });
  });
});
