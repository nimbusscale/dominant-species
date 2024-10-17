import { Faction } from '../../engine/model/faction.model';
import { Pile, PileAdapter } from '../../engine/model/pile.model';
import { ElementConfig } from '../constant/element-config.constant';
import { Area } from '../../engine/model/area.model';
import { ensureDefined } from '../../engine/util/misc';
import { ActionPawnPiece } from './action-pawn.model';
import { SpeciesPiece } from './species.model';
import { Space } from '../../engine/model/space.model';
import { ElementPiece } from './element.model';
import { isNotNull } from '../../engine/util/predicate';
import { SpaceKindEnum } from '../constant/area.constant';
import { BehaviorSubject } from 'rxjs';

export interface AnimalConfig {
  faction: Faction;
  actionPawnPile: Pile;
  elementArea: Area;
  elementConfig: ElementConfig;
  speciesPile: Pile;
}

export class AnimalElements {
  private elementsSubject = new BehaviorSubject<ElementPiece[]>([]);
  elements$ = this.elementsSubject.asObservable();

  constructor(
    private elementArea: Area,
    private elementConfig: ElementConfig,
  ) {
    this.elementsSubject.next(this.allElements);
  }

  private get addedElementSpaces(): Space[] {
    const elementSpaces = ensureDefined(this.elementArea).spaces;
    const elementConfig = ensureDefined(this.elementConfig);
    if (elementSpaces.length > elementConfig.inherentCount) {
      return elementSpaces.slice(elementConfig.inherentCount);
    } else {
      return [];
    }
  }

  addElement(element: ElementPiece): void {
    const availableSpace = ensureDefined(this.elementArea).nextAvailableSpace(
      SpaceKindEnum.ELEMENT,
    );
    if (availableSpace) {
      availableSpace.addPiece(element);
      this.elementsSubject.next(this.allElements);
    } else {
      throw new Error('No available element spaces');
    }
  }

  removeElement(element: ElementPiece): void {
    const elementSpace = this.addedElementSpaces.find(
      (space) => space.piece && space.piece.kind === element.kind,
    );
    if (elementSpace) {
      elementSpace.removePiece();
      this.elementsSubject.next(this.allElements);
    } else {
      throw new Error(`Animal does not have added element ${JSON.stringify(element)}`);
    }
  }

  get allElements(): ElementPiece[] {
    return ensureDefined(this.elementArea)
      .spaces.filter((space) => space.piece)
      .map((space) => space.piece) as ElementPiece[];
  }

  get addedElements(): ElementPiece[] {
    return this.addedElementSpaces.map((space) => space.piece as ElementPiece).filter(isNotNull);
  }
}

export class Animal {
  private readonly faction: Faction;
  private readonly actionPawnPile: PileAdapter<ActionPawnPiece>;
  private readonly speciesPile: PileAdapter<SpeciesPiece>;
  private readonly animalElements: AnimalElements;

  constructor(config: AnimalConfig) {
    this.faction = config.faction;
    this.actionPawnPile = new PileAdapter<ActionPawnPiece>(config.actionPawnPile);
    this.speciesPile = new PileAdapter<SpeciesPiece>(config.speciesPile);
    this.animalElements = new AnimalElements(config.elementArea, config.elementConfig);
  }

  get id(): string {
    return this.faction.id;
  }

  get name(): string {
    return this.faction.name;
  }

  get actionPawn(): PileAdapter<ActionPawnPiece> {
    return this.actionPawnPile;
  }

  get elements(): AnimalElements {
    return this.animalElements;
  }

  get species(): PileAdapter<SpeciesPiece> {
    return this.speciesPile;
  }
}
