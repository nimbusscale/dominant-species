import { Injectable } from '@angular/core';
import {Area} from "../model/area.model";
import {GameStateService} from "./game-state.service";
import {skip} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AreaStateService {
  private registeredAreaIds: Set<string> = new Set<string>();
  private areaById: Map<string, Area> = new Map<string, Area>();

  constructor(private gameStateSvc: GameStateService) {
    this.initialize();
  }

  private initialize(): void {
    this.gameStateSvc.area$.subscribe((areaStates) => {
      areaStates.forEach((areaState) => {
        if (this.registeredAreaIds.has(areaState.id)) {
          const area = this.getArea(areaState.id);
          area.setState(areaState);
        }
      });
    });
  }

  private getArea(id: string): Area {
    const area = this.areaById.get(id);
    if (!area) {
      throw new Error(`Area for id ${id} is not registered.`);
    } else {
      return area;
    }
  }

  register(areas: Area[]): void {
    areas.forEach((area) => {
      if (!this.registeredAreaIds.has(area.id)) {
        this.registeredAreaIds.add(area.id);
        this.areaById.set(area.id, area);
        this.gameStateSvc.registerArea(area.state);
        // We skip the first value as we just registered the area and state updates can only happen during a transaction
        area.state$.pipe(skip(1)).subscribe((areaState) => {
          this.gameStateSvc.setArea(areaState);
        });
      } else {
        throw new Error(`Area for id ${area.id} already registered.`);
      }
    });
  }

}
