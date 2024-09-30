import { Animal } from './animal';
import { Player } from './player.model';

const testPlayer: Player = {
  id: 'test',
  name: 'NimbusScale',
};

describe('Animal', () => {
  it('should create an instance', () => {
    expect(new Animal(testPlayer, 'mammalAnimal')).toBeTruthy();
  });
  it('should set a name based on kind', () => {
    const animal = new Animal(testPlayer, 'mammalAnimal');
    expect(animal.name).toEqual('Mammal');
  });
  it('non-amphibian should have two inherent elements', () => {
    const animal = new Animal(testPlayer, 'mammalAnimal');
    expect(animal.elements.length).toEqual(2);
    expect(animal.elements[0].kind).toEqual('meatElement');
  });
  it('amphibian should have three inherent elements', () => {
    const animal = new Animal(testPlayer, 'amphibianAnimal');
    expect(animal.elements.length).toEqual(3);
    expect(animal.elements[0].kind).toEqual('waterElement');
  });
  describe('addElement', () => {
    it('add an element if animal has 6 or less elements', () => {
      const animal = new Animal(testPlayer, 'amphibianAnimal');
      const currentElementCount = animal.elements.length;
      animal.addElement({ kind: 'waterElement' });
      expect(animal.elements.length).toEqual(currentElementCount + 1);
    });
    it('Errors if animal has more than 6 elements', () => {
      const animal = new Animal(testPlayer, 'amphibianAnimal');
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
      const animal = new Animal(testPlayer, 'amphibianAnimal');
      const currentElements = animal.elements.map((element) => element.kind);
      animal.addElement({ kind: 'meatElement' });
      animal.removeElement({ kind: 'meatElement' });
      expect(animal.elements.map((element) => element.kind)).toEqual(currentElements);
    });
    it('Errors if try to remove an element that is not an addedElements', () => {
      const animal = new Animal(testPlayer, 'amphibianAnimal');
      expect(() => {
        animal.removeElement({ kind: 'waterElement' });
      }).toThrowError();
    });
  });
});
