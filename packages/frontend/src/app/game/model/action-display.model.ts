import { Observable } from 'rxjs';

export interface ActionDisplayServiceWithSetup {
  ready$: Observable<boolean>;
}
