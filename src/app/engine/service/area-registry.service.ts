import { Injectable } from '@angular/core';
import {Area} from "../model/area.model";
import {BehaviorSubject, Observable} from "rxjs";
import {AreaStateService} from "./area-state.service";

@Injectable({
  providedIn: 'root'
})
export class AreaRegistryService {
  private areaById: Map<string, Area> = new Map<string, Area>();
  private registeredAreaIds: Set<string> = new Set<string>();
  private registeredAreasSubject = new BehaviorSubject<Set<string>>(new Set());
  registeredAreas$: Observable<Set<string>> = this.registeredAreasSubject.asObservable();

  constructor(private areaStateSvc: AreaStateService) {}

  public get(id: string): Area {
    const area = this.areaById.get(id);
    if (!area) {
      throw new Error(`Area for kind ${id} is not registered.`);
    } else {
      return area;
    }
  }

  register(areas: Area[]): void {
    areas.forEach((area) => {
      if (!this.registeredAreaIds.has(area.id)) {
        this.areaById.set(area.id, area);
        this.registeredAreaIds.add(area.id);
      } else {
        throw new Error(`Area for id ${area.id} already registered.`);
      }
    });
    this.registeredAreasSubject.next(this.registeredAreaIds);
    this.areaStateSvc.register(areas);
  }
}
