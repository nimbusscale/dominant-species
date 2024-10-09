import { Injectable } from '@angular/core';
import {PileRegistryService} from "../../engine/service/pile-registry.service";
import {Pile} from "../../engine/model/pile.model";
import {BehaviorSubject, filter, Observable} from "rxjs";
import {dsPieceKind} from "../dominant-species.constants";

@Injectable({
  providedIn: 'root'
})
export class ElementDrawPoolService {
  private _drawPool: Pile | null = null
  private drawPoolSubject: BehaviorSubject<Pile | null> = new BehaviorSubject<Pile | null>(this._drawPool)
  drawPool$: Observable<Pile | null> = this.drawPoolSubject.asObservable()

  constructor(private pileRegistrySvc: PileRegistryService) {
    this.initialize()
  }

  private initialize(): void {
    const registeredPilesSubscription = this.pileRegistrySvc.registeredPiles$
      .pipe(filter((registeredPiles) => registeredPiles.has(dsPieceKind.ELEMENT)))
      .subscribe(() => {
        this._drawPool = this.pileRegistrySvc.get(dsPieceKind.ELEMENT)
        registeredPilesSubscription.unsubscribe();
      });
  }

  get drawPool(): Pile | null {
    return this._drawPool
  }
}
