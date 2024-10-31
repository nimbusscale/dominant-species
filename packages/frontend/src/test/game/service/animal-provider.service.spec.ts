import { TestBed } from '@angular/core/testing';

import { AnimalProviderService } from '../../../app/game/service/animal-provider.service';
import { Faction } from '../../../app/engine/model/faction.model';
import { BehaviorSubject, of, skip } from 'rxjs';
import { AnimalEnum } from '../../../app/game/constant/animal.constant';
import { FactionRegistryService } from '../../../app/engine/service/game-element/faction-registry.service';
import { PileRegistryService } from '../../../app/engine/service/game-element/pile-registry.service';
import { Pile } from '../../../app/engine/model/pile.model';
import { AreaRegistryService } from '../../../app/engine/service/game-element/area-registry.service';
import { Area } from '../../../app/engine/model/area.model';
import { Animal } from '../../../app/game/model/animal.model';
import { AreaIdEnum } from '../../../app/game/constant/area.constant';
import { PileIdEnum } from '../../../app/game/constant/pile.constant';

describe('AnimalProviderService', () => {
  let animalProviderService: AnimalProviderService;
  let birdFaction: Faction;
  let insectFaction: Faction;
  let areaRegistrySvcRegisteredIdsSubject: BehaviorSubject<Set<string>>;
  let pileRegistrySvcRegisteredIdsSubject: BehaviorSubject<Set<string>>;
  let mockAnimal: jasmine.SpyObj<Animal>;
  let animalFactorySpy: jasmine.Spy;

  beforeEach(() => {
    birdFaction = new Faction({
      id: AnimalEnum.BIRD,
      name: AnimalEnum.BIRD,
      ownerId: 'tester1',
      score: 0,
    });
    insectFaction = new Faction({
      id: AnimalEnum.INSECT,
      name: AnimalEnum.INSECT,
      ownerId: 'tester2',
      score: 0,
    });

    const factionRegistrySvcSpyObj = jasmine.createSpyObj<FactionRegistryService>(
      'FactionRegistryService',
      ['get'],
      {
        factionAssignment$: of([
          { id: AnimalEnum.BIRD, ownerId: 'tester1' },
          { id: AnimalEnum.INSECT, ownerId: 'tester2' },
        ]),
      },
    );
    factionRegistrySvcSpyObj.get.and.callFake((animalId): Faction => {
      if ((animalId as AnimalEnum) === AnimalEnum.BIRD) {
        return birdFaction;
      } else if ((animalId as AnimalEnum) === AnimalEnum.INSECT) {
        return insectFaction;
      } else {
        throw new Error();
      }
    });

    areaRegistrySvcRegisteredIdsSubject = new BehaviorSubject<Set<string>>(new Set());
    const areaRegistrySvcSpyObj = jasmine.createSpyObj<AreaRegistryService>(
      'AreaRegistryService',
      ['get'],
      {
        registeredIds$: areaRegistrySvcRegisteredIdsSubject.asObservable(),
      },
    );
    areaRegistrySvcSpyObj.get.and.returnValue(jasmine.createSpyObj<Area>(['id']));

    pileRegistrySvcRegisteredIdsSubject = new BehaviorSubject<Set<string>>(new Set());
    const pileRegistrySvcSpyObj = jasmine.createSpyObj<PileRegistryService>(
      'PileRegistryService',
      ['get'],
      {
        registeredIds$: pileRegistrySvcRegisteredIdsSubject.asObservable(),
      },
    );
    pileRegistrySvcSpyObj.get.and.returnValue(jasmine.createSpyObj<Pile>(['id']));

    TestBed.configureTestingModule({
      providers: [
        AnimalProviderService,
        { provide: AreaRegistryService, useValue: areaRegistrySvcSpyObj },
        { provide: FactionRegistryService, useValue: factionRegistrySvcSpyObj },
        { provide: PileRegistryService, useValue: pileRegistrySvcSpyObj },
      ],
    });
    animalProviderService = TestBed.inject(AnimalProviderService);
    mockAnimal = jasmine.createSpyObj<Animal>(['id']);
    animalFactorySpy = spyOn<any>(animalProviderService, 'animalFactory').and.returnValue(
      mockAnimal,
    );
  });

  it('should build one animal when single faction assignment', (done) => {
    animalProviderService.animals$.pipe(skip(1)).subscribe((animals) => {
      expect(animals.length).toEqual(1);
      expect(animalFactorySpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          faction: jasmine.objectContaining({ id: AnimalEnum.BIRD }),
        }),
      );
      done();
    });
    areaRegistrySvcRegisteredIdsSubject.next(new Set([AreaIdEnum.BIRD_ELEMENT]));
    pileRegistrySvcRegisteredIdsSubject.next(
      new Set([PileIdEnum.ACTION_PAWN_BIRD, PileIdEnum.SPECIES_BIRD]),
    );
  });
  it('should build multiple animal when multiple faction assignment', (done) => {
    // skip the initial empty value and then value with just one animal.
    animalProviderService.animals$.pipe(skip(2)).subscribe((animals) => {
      expect(animals.length).toEqual(2);
      expect(animalFactorySpy).toHaveBeenCalledTimes(2);
      done();
    });
    areaRegistrySvcRegisteredIdsSubject.next(
      new Set([AreaIdEnum.BIRD_ELEMENT, AreaIdEnum.INSECT_ELEMENT]),
    );
    pileRegistrySvcRegisteredIdsSubject.next(
      new Set([
        PileIdEnum.ACTION_PAWN_BIRD,
        PileIdEnum.SPECIES_BIRD,
        PileIdEnum.ACTION_PAWN_INSECT,
        PileIdEnum.SPECIES_INSECT,
      ]),
    );
  });
});
