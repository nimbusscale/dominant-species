import { TestBed } from '@angular/core/testing';

import { ElementDrawPoolService } from '../../../app/game/service/element-draw-pool.service';
import { BehaviorSubject, skip } from 'rxjs';
import { deepClone } from 'fast-json-patch';
import { Pile, PileState } from '../../../app/engine/model/pile.model';
import { testPileState1 } from '../../engine/game-state-test.constant';
import { PileRegistryService } from '../../../app/engine/service/game-element/pile-registry.service';
import { PileIdEnum } from '../../../app/game/constant/pile.constant';

describe('ElementDrawPoolService', () => {
  let elementDrawPoolSvc: ElementDrawPoolService;
  let pileRegistrySvcSpy: jasmine.SpyObj<PileRegistryService>;
  let testPile1: Pile;
  let registeredPilesSubject: BehaviorSubject<Set<string>>;

  beforeEach(() => {
    registeredPilesSubject = new BehaviorSubject<Set<string>>(new Set());

    const pileRegistrySvcSpyObj = jasmine.createSpyObj<PileRegistryService>(
      'PileRegistryService',
      ['get'],
      {
        registeredIds$: registeredPilesSubject.asObservable(),
      },
    );

    // These probably should be mocks /
    testPile1 = new Pile(deepClone(testPileState1) as PileState);

    TestBed.configureTestingModule({
      providers: [
        ElementDrawPoolService,
        { provide: PileRegistryService, useValue: pileRegistrySvcSpyObj },
      ],
    });
    elementDrawPoolSvc = TestBed.inject(ElementDrawPoolService);
    pileRegistrySvcSpy = TestBed.inject(PileRegistryService) as jasmine.SpyObj<PileRegistryService>;
  });

  describe('ready$', () => {
    it('emits false when pile not ready yet', () => {
        elementDrawPoolSvc.ready$.subscribe((isReady) => {
        expect(isReady).toBeFalse()
      })
    })

    it('emits true when pile is ready', () => {
      pileRegistrySvcSpy.get.and.returnValue(testPile1);
      elementDrawPoolSvc.ready$.pipe(skip(1)).subscribe((isReady) => {
        expect(isReady).toBeTrue()
      })

      registeredPilesSubject.next(new Set([PileIdEnum.ELEMENT as string]));
    });
  });
});
