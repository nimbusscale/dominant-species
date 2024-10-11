import { Injectable } from '@angular/core';
import { Pile } from '../../engine/model/pile.model';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { dsPieceKind } from '../dominant-species.constants';

import { PileRegistryService } from '../../engine/service/game-element/pile-registry.service';

@Injectable({
  providedIn: 'root',
})
export class ElementDrawPoolService {
  private _drawPool: Pile | null = null;
  private drawPoolSubject: BehaviorSubject<Pile | null> = new BehaviorSubject<Pile | null>(
    this._drawPool,
  );
  drawPool$: Observable<Pile | null> = this.drawPoolSubject.asObservable();

  constructor(private pileRegistrySvc: PileRegistryService) {
    this.initialize();
  }

  private initialize(): void {
    const registeredPilesSubscription = this.pileRegistrySvc.registeredIds$
      .pipe(filter((registeredIds) => registeredIds.has(dsPieceKind.ELEMENT)))
      .subscribe(() => {
        this._drawPool = this.pileRegistrySvc.get(dsPieceKind.ELEMENT);
        this.drawPoolSubject.next(this._drawPool);
        registeredPilesSubscription.unsubscribe();
      });
  }

  get drawPool(): Pile | null {
    return this._drawPool;
  }
}
