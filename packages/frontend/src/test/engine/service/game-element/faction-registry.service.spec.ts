import { TestBed } from '@angular/core/testing';
import { FactionRegistryService } from '../../../../app/engine/service/game-element/faction-registry.service';
import { Faction } from '../../../../app/engine/model/faction.model';
import { FactionStateService } from '../../../../app/engine/service/game-element/faction-state.service';
import { deepClone } from 'fast-json-patch';
import { skip } from 'rxjs';
import { FactionState } from 'api-types/src/game-state';
import { testFactionState1 } from '../../../game-state-test.constant';

describe('FactionRegistryService', () => {
  let factionRegistrySvc: FactionRegistryService;
  let testFaction: Faction;

  beforeEach(() => {
    const factionStateSvcSpyObj = jasmine.createSpyObj('FactionStateService', ['register']);

    //should be mock /
    testFaction = new Faction(deepClone(testFactionState1) as FactionState);

    TestBed.configureTestingModule({
      providers: [
        FactionRegistryService,
        { provide: FactionStateService, useValue: factionStateSvcSpyObj },
      ],
    });

    factionRegistrySvc = TestBed.inject(FactionRegistryService);
  });

  describe('factionAssignment$', () => {
    it('emits FactionAssignment when registered', (done) => {
      factionRegistrySvc.factionAssignment$.pipe(skip(1)).subscribe((factionAssignments) => {
        expect(factionAssignments[0]).toEqual({ id: 'redTester', ownerId: 'tester1' });
        done();
      });
      factionRegistrySvc.register([testFaction]);
    });
  });
});
