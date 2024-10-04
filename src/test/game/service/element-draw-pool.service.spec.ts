import { TestBed } from '@angular/core/testing';

import { ElementDrawPoolService } from '../../../app/game/service/element-draw-pool.service';
import { GameStateService } from '../../../app/engine/service/game-state.service';
import { of } from 'rxjs';
import { DrawPileKind } from '../../../app/game/dominant-species.constants';

describe('ElementDrawPoolService', () => {
  let drawPoolService: ElementDrawPoolService;
  let gameStateServiceMock: jasmine.SpyObj<GameStateService>;

  beforeEach(() => {
    gameStateServiceMock = jasmine.createSpyObj('GameStateService', [], {
      pile$: of([
        {
          kind: DrawPileKind.ELEMENT,
          inventory: {
            grassElement: 10,
          },
        },
      ]),
    });

    TestBed.configureTestingModule({
      providers: [
        ElementDrawPoolService,
        { provide: GameStateService, useValue: gameStateServiceMock },
      ],
    });
    drawPoolService = TestBed.inject(ElementDrawPoolService);
  });

  describe('initialize', () => {
    it('should get initial state from GameStateService', (done) => {
      expect(drawPoolService.length).toEqual(10);
      expect(drawPoolService.pull()[0]?.kind).toEqual('grassElement');
      done();
    });
  });
});
