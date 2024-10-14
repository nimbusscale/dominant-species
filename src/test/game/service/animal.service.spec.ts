import { TestBed } from '@angular/core/testing';

import { AnimalService } from '../../../app/game/service/animal.service';
import { AreaRegistryService } from '../../../app/engine/service/game-element/area-registry.service';
import { FactionRegistryService } from '../../../app/engine/service/game-element/faction-registry.service';
import { PlayerService } from '../../../app/engine/service/player.service';
import { Faction } from '../../../app/engine/model/faction.model';
import { of, skip } from 'rxjs';
import { Area } from '../../../app/engine/model/area.model';
import { Space } from '../../../app/engine/model/space.model';
import { elementPieceFactory } from '../../../app/game/model/element.model';
import { Player } from '../../../app/engine/model/player.model';
import { testPlayerState1 } from '../../engine/service/game-state-test.constant';
import {AnimalEnum} from "../../../app/game/constant/animal.constant";
import {AreaIdEnum, SpaceKindEnum} from "../../../app/game/constant/area.constant";
import {ElementEnum} from "../../../app/game/constant/element.constant";

describe('AnimalService', () => {
  let animalService: AnimalService;
  let testFaction: Faction;
  let testSpaces: Space[];
  let testArea: Area;

  beforeEach(() => {
    testFaction = new Faction({
      id: AnimalEnum.BIRD,
      ownerId: 'tester1',
      score: 0,
    });
    testSpaces = Array.from({ length: 6 }, () => new Space(SpaceKindEnum.ELEMENT));

    testSpaces[0].addPiece(elementPieceFactory(ElementEnum.SEED));
    testSpaces[1].addPiece(elementPieceFactory(ElementEnum.SEED));
    testArea = new Area(AreaIdEnum.BIRD_ELEMENT, testSpaces);

    const areaRegistrySvcSpyObj = jasmine.createSpyObj<AreaRegistryService>(
      'AreaRegistryService',
      ['get'],
      {
        registeredIds$: of(new Set([AreaIdEnum.BIRD_ELEMENT])),
      },
    );
    areaRegistrySvcSpyObj.get.and.returnValue(testArea);

    const factionRegistrySvcSpyObj = jasmine.createSpyObj<FactionRegistryService>(
      'FactionRegistryService',
      ['get'],
      {
        factionAssignment$: of([{ id: AnimalEnum.BIRD, ownerId: 'tester1' }]),
      },
    );
    factionRegistrySvcSpyObj.get.and.returnValue(testFaction);

    const playerSvcSpyObj = jasmine.createSpyObj<PlayerService>('PlayerService', [], {
      currentPlayer: new Player(testPlayerState1),
    });

    TestBed.configureTestingModule({
      providers: [
        AnimalService,
        { provide: AreaRegistryService, useValue: areaRegistrySvcSpyObj },
        { provide: FactionRegistryService, useValue: factionRegistrySvcSpyObj },
        { provide: PlayerService, useValue: playerSvcSpyObj },
      ],
    });
    animalService = TestBed.inject(AnimalService);
  });

  describe('initialize', () => {
    it('emits elements', (done) => {
      animalService.elementSpaces$.subscribe((elementSpaces) => {
        expect(elementSpaces).toBeTruthy();
        if (elementSpaces) {
          expect(elementSpaces.length).toEqual(6);
          expect(elementSpaces[0].piece).not.toBeNull();
        }
        done();
      });
    });
    it('sets id', (done) => {
      animalService.elementSpaces$.subscribe(() => {
        expect(animalService.id).toEqual(AnimalEnum.BIRD);
        done();
      });
    });
  });
  it('sets elements', (done) => {
    animalService.elementSpaces$.subscribe(() => {
      expect(animalService.elements).toBeTruthy();
      if (animalService.elements) {
        expect(animalService.elements.length).toEqual(2);
        expect(animalService.elements[0].kind).toEqual(ElementEnum.SEED);
      }
      done();
    });
  });
  describe('added elements', () => {
    it('has not added elements by default', (done) => {
      animalService.elementSpaces$.subscribe(() => {
        expect(animalService.addedElements.length).toEqual(0);
        done();
      });
    });
    it('can add elements and emit', (done) => {
      animalService.elementSpaces$.pipe(skip(1)).subscribe((elementSpaces) => {
        expect(elementSpaces).toBeTruthy();
        if (elementSpaces) {
          expect(elementSpaces[2].piece).not.toBeNull();
          if (elementSpaces[2].piece) {
            expect(elementSpaces[2].piece.kind).toEqual(ElementEnum.SUN);
          }
        }
        expect(animalService.addedElements.length).toEqual(1);
        expect(animalService.addedElements[0].kind).toEqual(ElementEnum.SUN);
        done();
      });
      animalService.addElement(elementPieceFactory(ElementEnum.SUN));
    });
    it('can add remove and emit', (done) => {
      // skip emitted value for initialization and adding element
      animalService.elementSpaces$.pipe(skip(2)).subscribe((elementSpaces) => {
        expect(elementSpaces).toBeTruthy();
        if (elementSpaces) {
          expect(elementSpaces[2].piece).toBeNull();
        }
        expect(animalService.addedElements.length).toEqual(0);
        done();
      });
      animalService.addElement(elementPieceFactory(ElementEnum.SUN));
      animalService.removeElement(elementPieceFactory(ElementEnum.SUN));
    });
    it('throws error if adding too many elements', () => {
      animalService.addElement(elementPieceFactory(ElementEnum.SUN));
      animalService.addElement(elementPieceFactory(ElementEnum.SUN));
      animalService.addElement(elementPieceFactory(ElementEnum.SUN));
      animalService.addElement(elementPieceFactory(ElementEnum.SUN));
      expect(() => {
        animalService.addElement(elementPieceFactory(ElementEnum.SUN));
      }).toThrowError();
    });
    it('throws error if removing an element not added', () => {
      // Bird has seed as inherent, so this validates we can't remove inherent elements /
      expect(() => {
        animalService.removeElement(elementPieceFactory(ElementEnum.SEED));
      }).toThrowError();
    });
  });
});
