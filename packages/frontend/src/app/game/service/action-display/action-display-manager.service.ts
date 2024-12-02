import { Injectable } from '@angular/core';
import { AdaptionActionDisplayService } from './adaption-action-display.service';
import { BehaviorSubject, combineLatest, filter, first, map, Observable } from 'rxjs';
import { ActionDisplayService } from '../../model/action-display.model';
import { ActionCompleteCallback, ActionContext } from '../../../engine/model/action.model';

@Injectable({
  providedIn: 'root',
})
export class ActionDisplayManagerService {
  actionDisplayServices: ActionDisplayService[]
  private readySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ready$: Observable<boolean> = this.readySubject.asObservable();

  constructor(private adaptionActionDisplayService: AdaptionActionDisplayService) {
    this.actionDisplayServices = [this.adaptionActionDisplayService];
    this.signalReady();
  }

  signalReady(): void {
    const readyObs = this.actionDisplayServices.map((service) => service.ready$);
    combineLatest(readyObs)
      .pipe(
        map((serviceReady: boolean[]) => serviceReady.every((ready) => ready)),
        filter((serviceReady) => serviceReady),
        first(),
      )
      .subscribe((allReady) => {
        this.readySubject.next(allReady);
      });
  }

  buildActions(actionContext: ActionContext, callback: ActionCompleteCallback): void {
    this.actionDisplayServices.forEach((service) => {
      service.buildActions(actionContext, callback);
    });
  }

  clearActions(): void {
    this.actionDisplayServices.forEach((service) => {
      service.clearActions()
    });
  }
}
