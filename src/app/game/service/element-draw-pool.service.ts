import { Injectable } from '@angular/core';
import { Pile } from '../../engine/model/pile.model';
import { BehaviorSubject, filter, first, Observable } from 'rxjs';

import { PileRegistryService } from '../../engine/service/game-element/pile-registry.service';
import { PieceKindEnum } from '../constant/piece.constant';

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
    this.pileRegistrySvc.registeredIds$
      .pipe(
        filter((registeredIds) => registeredIds.has(PieceKindEnum.ELEMENT)),
        first(),
      )
      .subscribe(() => {
        this._drawPool = this.pileRegistrySvc.get(PieceKindEnum.ELEMENT);
        this.drawPoolSubject.next(this._drawPool);
      });
  }

  get drawPool(): Pile | null {
    return this._drawPool;
  }
}
