import { Animal, AnimalState } from './animal';
import { Player } from './player.model';

const testPlayer: Player = {
  id: 'test',
  name: 'NimbusScale',
};

describe('Animal', () => {
  let animalState: AnimalState;

  beforeEach(() => {
    animalState = {
      owner: testPlayer,
      kind: 'birdAnimal',
      inherentElements: [{ kind: 'seedElement' }, { kind: 'seedElement' }],
      addedElements: [],
    };
  });
  it('should create an instance', () => {
    expect(new Animal(animalState)).toBeTruthy();
  });
  describe('state', () => {
    it('should be retrievable', () => {
      const animal = new Animal(animalState);
      expect(animal.state).toBe(animalState);
    });
    it('should be updatable', () => {
      const animal = new Animal(animalState);
      const newAnimalState: AnimalState = {
        ...animalState,
        addedElements: [{ kind: 'waterElement' }],
      };
      animal.state = newAnimalState;
      expect(animal.state).toBe(newAnimalState);
    });
    it('should set a name based on kind', () => {
      const animal = new Animal(animalState);
      expect(animal.name).toEqual('Bird');
    });
    it('should have two inherent elements', () => {
      const animal = new Animal(animalState);
      expect(animal.elements.length).toEqual(2);
      expect(animal.elements[0].kind).toEqual('seedElement');
    });
  });
  describe('addElement', () => {
    it('add an element if animal has 6 or less elements', () => {
      const animal = new Animal(animalState);
      const currentElementCount = animal.elements.length;
      animal.addElement({ kind: 'waterElement' });
      expect(animal.elements.length).toEqual(currentElementCount + 1);
      expect(animal.elements[2]).toEqual({ kind: 'waterElement' });
    });
    it('Errors if animal has more than 6 elements', () => {
      const animal = new Animal(animalState);
      const currentElementCount = animal.elements.length;
      for (let i = currentElementCount; i <= 6; i++) {
        animal.addElement({ kind: 'waterElement' });
      }
      expect(() => {
        animal.addElement({ kind: 'waterElement' });
      }).toThrowError();
    });
  });
  describe('removeElement', () => {
    it('removes an element if that kind of element is an addedElements', () => {
      const animal = new Animal(animalState);
      const currentElements = animal.elements.map((element) => element.kind);
      animal.addElement({ kind: 'meatElement' });
      animal.removeElement({ kind: 'meatElement' });
      expect(animal.elements.map((element) => element.kind)).toEqual(currentElements);
    });
    it('Errors if try to remove an element that is not an addedElements', () => {
      const animal = new Animal(animalState);
      expect(() => {
        animal.removeElement({ kind: 'waterElement' });
      }).toThrowError();
    });
  });
});
