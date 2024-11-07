// import { Injectable } from '@angular/core';
// import { AdaptionActionDisplayService } from './adaption-action-display.service';
// import { BehaviorSubject, combineLatest, filter, first, map, Observable } from 'rxjs';
// import { ActionDisplayServiceWithSetup } from '../../model/action-display.model';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class ActionDisplayManagerService {
//   private actionDisplaySetupManager: ActionDisplayServiceWithSetup;
//   ready$: Observable<boolean>;
//
//   constructor(private adaptionActionDisplayService: AdaptionActionDisplayService) {
//     this.actionDisplaySetupManager = new ActionDisplaySetupManager([adaptionActionDisplayService]);
//     this.ready$ = this.actionDisplaySetupManager.ready$;
//   }
// }
//
// export class ActionDisplaySetupManager {
//   private actionServicesWithSetup: ActionDisplayServiceWithSetup[];
//   private readySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
//   ready$: Observable<boolean> = this.readySubject.asObservable();
//
//   constructor(actionServicesWithSetup: ActionDisplayServiceWithSetup[]) {
//     this.actionServicesWithSetup = actionServicesWithSetup;
//     this.initialize();
//   }
//
//   private initialize(): void {
//     const readyObs = this.actionServicesWithSetup.map((service) => service.ready$);
//     combineLatest(readyObs)
//       .pipe(
//         map((serviceReady: boolean[]) => serviceReady.every((ready) => ready)),
//         filter((serviceReady) => serviceReady),
//         first(),
//       )
//       .subscribe((allReady) => {
//         this.readySubject.next(allReady);
//       });
//   }
// }
