import { Injectable } from '@angular/core';
import { Pile } from '../../engine/model/pile.model';
import { BehaviorSubject, filter, first, Observable, of } from 'rxjs';

import { PileRegistryService } from '../../engine/service/game-element/pile-registry.service';
import { PileIdEnum } from '../constant/pile.constant';
import { ElementPiece } from '../model/element.model';

import {Piece} from "api-types/src/game-state";

@Injectable({
  providedIn: 'root',
})
export class ElementDrawPoolService {
  private _drawPool: Pile | undefined = undefined;
  private ready = false;
  private readySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.ready);
  ready$: Observable<boolean> = this.readySubject.asObservable();

  constructor(private pileRegistrySvc: PileRegistryService) {
    this.initialize();
  }

  private initialize(): void {
    this.pileRegistrySvc.registeredIds$
      .pipe(
        filter((registeredIds) => registeredIds.has(PileIdEnum.ELEMENT)),
        first(),
      )
      .subscribe(() => {
        this._drawPool = this.pileRegistrySvc.get(PileIdEnum.ELEMENT);
        this.ready = true;
        this.readySubject.next(this.ready);
      });
  }

  private get drawPool(): Pile {
    if (this._drawPool) {
      return this._drawPool;
    } else {
      throw new Error('Pile not ready');
    }
  }

  get length$(): Observable<number> {
    if (this._drawPool) {
      return this.drawPool.length$;
    } else {
      return of(0);
    }
  }

  pull(count = 1): (ElementPiece | null)[] {
    return this.drawPool.pullMany(count) as ElementPiece[];
  }

  put(pieces: ElementPiece[]): void {
    this.drawPool.put(pieces as Piece[]);
  }
}
