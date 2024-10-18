import { Injectable } from '@angular/core';
import { Faction } from '../../engine/model/faction.model';
import { pileIdsByAnimal } from '../constant/pile-config';
import { elementConfigByAnimal } from '../constant/element-config.constant';
import { BehaviorSubject, combineLatestWith, filter, first } from 'rxjs';
import { AreaRegistryService } from '../../engine/service/game-element/area-registry.service';
import { FactionRegistryService } from '../../engine/service/game-element/faction-registry.service';
import { PileRegistryService } from '../../engine/service/game-element/pile-registry.service';
import {ensureDefined, getOrThrow, setDifference} from '../../engine/util/misc';
import { Animal, AnimalConfig } from '../model/animal.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalProviderService {
  private processedFactionIds: Set<string> = new Set<string>();
  private readonly animalById = new Map<string, Animal>();
  private animalsSubject = new BehaviorSubject<Animal[]>([]);
  animals$ = this.animalsSubject.asObservable();

  constructor(
    private areaRegistrySvc: AreaRegistryService,
    private factionRegistryService: FactionRegistryService,
    private pileRegistryService: PileRegistryService,
  ) {
    this.buildAnimals();
  }
  private buildAnimals(): void {
    this.factionRegistryService.factionAssignment$.subscribe((factionAssignments) => {
      // To minimize any building an animal several times, we add the animal id to processedFactionIds as quickly as possible /
      const factionIds = new Set<string>(
        factionAssignments.map((factionAssignment) => factionAssignment.id),
      );
      const factionIdsToProcess = setDifference(factionIds, this.processedFactionIds);
      this.processedFactionIds = new Set<string>([
        ...factionIdsToProcess,
        ...this.processedFactionIds,
      ]);
      factionIdsToProcess.forEach((factionId) => {
        const faction = this.factionRegistryService.get(factionId);
        this.buildAnimal(faction);
      });
    });
  }

  private animalFactory(animalConfig: AnimalConfig): Animal {
    return new Animal(animalConfig);
  }

  private buildAnimal(faction: Faction): void {
    const elementAreaId = getOrThrow(elementConfigByAnimal, faction.id).areaId;
    const actionPawnPileId = getOrThrow(pileIdsByAnimal, faction.id).actionPawn;
    const speciesPileId = getOrThrow(pileIdsByAnimal, faction.id).species;
    this.areaRegistrySvc.registeredIds$
      .pipe(
        combineLatestWith(this.pileRegistryService.registeredIds$),
        filter(
          ([areaIds, pileIds]) =>
            areaIds.has(elementAreaId) &&
            pileIds.has(actionPawnPileId) &&
            pileIds.has(speciesPileId),
        ),
        first(),
      )
      .subscribe(() => {
        const animalConfig: AnimalConfig = {
          faction: faction,
          actionPawnPile: this.pileRegistryService.get(actionPawnPileId),
          elementArea: this.areaRegistrySvc.get(elementAreaId),
          elementConfig: getOrThrow(elementConfigByAnimal, faction.id),
          speciesPile: this.pileRegistryService.get(speciesPileId),
        };
        this.animalById.set(faction.id, this.animalFactory(animalConfig));
        this.animalsSubject.next(Array.from(this.animalById.values()));
      });
  }

  get(id: string): Animal {
    return getOrThrow(this.animalById, id)
  }

}
