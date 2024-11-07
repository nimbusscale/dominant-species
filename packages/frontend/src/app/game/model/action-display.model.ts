import { Observable } from 'rxjs';

export interface ActionDisplayService {
  ready$: Observable<boolean>;
}
