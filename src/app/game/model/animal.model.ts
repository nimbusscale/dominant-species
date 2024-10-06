import { Player } from '../../engine/model/player.model';
import { FactionState } from '../../engine/model/faction.model';
import {Piece} from "../../engine/model/piece.model";

export type AnimalKind =
  | 'amphibianAnimal'
  | 'arachnidAnimal'
  | 'birdAnimal'
  | 'insectAnimal'
  | 'mammalAnimal'
  | 'reptileAnimal';

export const inherentElementKindByAnimalKind = new Map<AnimalKind, string>([
  ['amphibianAnimal', 'waterElement'],
  ['arachnidAnimal', 'grubElement'],
  ['birdAnimal', 'seedElement'],
  ['insectAnimal', 'grassElement'],
  ['mammalAnimal', 'meatElement'],
  ['reptileAnimal', 'sunElement'],
] as const);

export type AnimalState = FactionState & {
  kind: AnimalKind;
  inherentElements: Piece[];
  addedElements: Piece[];
};

/**
 * Represents an animal owned by a player with inherent (printed on the card) and added elements.
 */
export class Animal {
  public state: AnimalState;

  constructor(state: AnimalState) {
    this.state = state;
  }

  /**
   * Gets all elements of the animal, including both inherent and added ones.
   * @returns A list of all elements.
   */
  get elements(): Piece[] {
    return [...this.state.inherentElements, ...this.state.addedElements];
  }

  get kind(): AnimalKind {
    return this.state.kind;
  }

  /**
   * Gets the name of the animal, based on its kind.
   * @returns The capitalized name of the animal without the "AnimalModel" suffix.
   */
  get name(): string {
    const animalName = this.kind.replace('Animal', '');
    return animalName.charAt(0).toUpperCase() + animalName.slice(1);
  }

  get owner(): Player {
    return this.state.owner;
  }

  /**
   * Adds a new element to the animal, ensuring it does not exceed the limit of 6 elements.
   * @param element The element to add.
   * @throws Will throw an error if the animal already has 6 elements.
   */
  addElement(element: Piece): void {
    if (this.elements.length <= 6) {
      this.state.addedElements.push(element);
    } else {
      throw new Error(`${this.name} already has 6 Elements.`);
    }
  }

  /**
   * Removes an added element from the animal.
   * @param element The element to remove.
   * @throws Will throw an error if the specified element is not found in the added elements.
   */
  removeElement(element: Piece): void {
    const elementIndex = this.state.addedElements.findIndex(
      (addedElement) => addedElement.kind === element.kind,
    );
    if (elementIndex !== -1) {
      this.state.addedElements.splice(elementIndex, 1);
    } else {
      throw new Error(
        `${this.name} does not have element kind ${element.kind} as an added element.`,
      );
    }
  }
}
