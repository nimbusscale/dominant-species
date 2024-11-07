import { Injectable } from '@angular/core';
import { AdaptionActionDisplayService } from './adaption-action-display.service';
import { BehaviorSubject, combineLatest, filter, first, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionDisplayManagerService {
  private readySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ready$: Observable<boolean> = this.readySubject.asObservable();

  constructor(private adaptionActionDisplayService: AdaptionActionDisplayService) {
    this.signalReady();
  }

  signalReady(): void {
    const actionDisplayServices = [this.adaptionActionDisplayService];
    const readyObs = actionDisplayServices.map((service) => service.ready$);
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
}
