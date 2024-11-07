import { Injectable } from '@angular/core';
import { ElementDrawPoolService } from './element-draw-pool.service';
import { AnimalProviderService } from './animal-provider.service';
import { ActionDisplayManagerService } from './action-display/action-display-manager.service';
import { BehaviorSubject, combineLatest, filter, first, map, Observable, Subscription } from 'rxjs';
import { GameStateService } from '../../engine/service/game-state/game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameReadyService {
  private subscriptions: Subscription[] = [];
  private readySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ready$: Observable<boolean> = this.readySubject.asObservable();

  constructor(
    private gameStateService: GameStateService,
    private elementDrawPoolService: ElementDrawPoolService,
    private animalProviderService: AnimalProviderService,
    private actionDisplayManagerService: ActionDisplayManagerService,
  ) {
    this.signalReady();
  }

  private animalsReady(): Observable<boolean> {
    const animalReadySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    const animalSubscription = this.animalProviderService.animals$.subscribe((animals) => {
      if (animals.length === this.gameStateService.playerIds.length) {
        animalReadySubject.next(true);
      }
    });
    this.subscriptions.push(animalSubscription);
    return animalReadySubject.asObservable();
  }

  private signalReady(): void {
    const readyObs = [
      this.animalsReady(),
      this.elementDrawPoolService.ready$,
      this.actionDisplayManagerService.ready$,
    ];
    combineLatest(readyObs)
      .pipe(
        map((serviceReady: boolean[]) => serviceReady.every((ready) => ready)),
        filter((serviceReady) => serviceReady),
        first(),
      )
      .subscribe((allReady) => {
        this.readySubject.next(allReady);
        this.subscriptions.forEach((sub) => {
          sub.unsubscribe();
        });
      });
  }
}
