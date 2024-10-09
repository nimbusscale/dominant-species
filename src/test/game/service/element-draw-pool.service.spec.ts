import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ElementDrawPoolService } from '../../../app/game/service/element-draw-pool.service';
import {PileRegistryService} from "../../../app/engine/service/pile-registry.service";
import {BehaviorSubject, of, skip} from "rxjs";
import {dsPieceKind} from "../../../app/game/dominant-species.constants";
import {deepClone} from "fast-json-patch";
import {Pile, PileState} from "../../../app/engine/model/pile.model";
import {testPileState1} from "../../engine/service/game-state-test.constant";

describe('ElementDrawPoolService', () => {
  let elementDrawPoolSvc: ElementDrawPoolService;
  let pileRegistrySvcSpy: jasmine.SpyObj<PileRegistryService>;
  let testPile1: Pile;
  let registeredPilesSubject: BehaviorSubject<Set<string>>

  beforeEach(() => {
    registeredPilesSubject = new BehaviorSubject<Set<string>>(new Set())

    const pileRegistrySvcSpyObj = jasmine.createSpyObj('pileRegistrySvc', ['get'], {
      registeredPiles$: registeredPilesSubject.asObservable()
    })

    // These probably should be mocks /
    testPile1 = new Pile(deepClone(testPileState1) as PileState);

    TestBed.configureTestingModule({
      providers: [ElementDrawPoolService, { provide: PileRegistryService, useValue: pileRegistrySvcSpyObj }],
    });
    elementDrawPoolSvc = TestBed.inject(ElementDrawPoolService);
    pileRegistrySvcSpy = TestBed.inject(PileRegistryService) as jasmine.SpyObj<PileRegistryService>
  });

  describe('initialize', () => {
      it('gets pile from registry and can be retrieved', (() => {
        pileRegistrySvcSpy.get.and.returnValue(testPile1);
        registeredPilesSubject.next(new Set([dsPieceKind.ELEMENT as string]))
        expect(elementDrawPoolSvc.drawPool).toEqual(testPile1);
      }));
      it('gets pile from registry and emits drawPool', (done) => {
        elementDrawPoolSvc.drawPool$.pipe(skip(1)).subscribe((drawPool) => {
          expect(drawPool).toEqual(testPile1)
          done()
        })
        pileRegistrySvcSpy.get.and.returnValue(testPile1);
        registeredPilesSubject.next(new Set([dsPieceKind.ELEMENT as string]))
      })
      it('drawPool returns null when not initialized', () => {
        expect(elementDrawPoolSvc.drawPool).toBeNull()
      })
    });
});
