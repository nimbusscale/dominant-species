import { TestBed } from '@angular/core/testing';

import { ElementDrawPoolService } from '../../../app/game/service/element-draw-pool.service';
import { GameStateService } from '../../../app/engine/service/game-state.service';
import { of } from 'rxjs';
import { DrawPileKindEnum } from '../../../app/game/dominant-species.constants';

describe('ElementDrawPoolService', () => {
  let drawPoolService: ElementDrawPoolService;
  let gameStateServiceMock: jasmine.SpyObj<GameStateService>;

  beforeEach(() => {
    gameStateServiceMock = jasmine.createSpyObj(
      'GameStateService',
      ['setPile', 'requireTransaction'],
      {
        pile$: of([
          {
            kind: DrawPileKindEnum.ELEMENT,
            inventory: {
              grassElement: 10,
            },
          },
        ]),
      },
    );

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
