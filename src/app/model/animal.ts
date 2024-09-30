import {Player} from "./player.model";
import {Element, ElementKind} from "./element.model";

export type AnimalKind =
  | 'amphibianAnimal'
  | 'arachnidAnimal'
  | 'birdAnimal'
  | 'insectAnimal'
  | 'mammalAnimal'
  | 'reptileAnimal';

export const inherentElementKindByAnimalKind = new Map<AnimalKind, ElementKind>([
  ['amphibianAnimal', 'waterElement'],
  ['arachnidAnimal', 'grubElement'],
  ['birdAnimal', 'seedElement'],
  ['insectAnimal', 'grassElement'],
  ['mammalAnimal', 'meatElement'],
  ['reptileAnimal', 'sunElement']
] as const)

export class Animal {
  readonly owner: Player
  readonly kind: AnimalKind
  private readonly inherentElements: Element[] = []
  private readonly addedElements: Element[] = []

  constructor(owner: Player, kind: AnimalKind) {
    this.owner = owner
    this.kind = kind
    this.initialize()
  }

  private initialize() {
    const inherentElementKind = inherentElementKindByAnimalKind.get(this.kind)
    if (inherentElementKind) {
      const inherentElementCount = this.kind === 'amphibianAnimal' ? 3 : 2
      for (let i = 0; i < inherentElementCount; i++) {
        this.inherentElements.push({kind: inherentElementKind})
      }
    } else {
      throw new Error(`Unable to find inherentElementKind for Animal type ${this.kind}`)
    }
  }

  get name(): string {
    const animalName = this.kind.replace('Animal', '');
    return animalName.charAt(0).toUpperCase() + animalName.slice(1);
  }

  get elements(): Element[] {
    return [...this.inherentElements, ...this.addedElements]
  }

  addElement(element: Element): void {
    if (this.elements.length <= 6) {
      this.addedElements.push(element)
    } else {
      throw new Error(`${this.name} already has 6 Elements.`)
    }
  }

  removeElement(element: Element): void {
    const elementIndex = this.addedElements.findIndex(addedElement => addedElement.kind === element.kind)
    if (elementIndex !== -1) {
      this.addedElements.splice(elementIndex, 1)
    } else {
      throw new Error(`${this.name} does not have element kind ${element.kind} as an added element.`)
    }
  }

}
