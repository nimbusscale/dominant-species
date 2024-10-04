import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawPoolGameComponent } from './draw-pool-game.component';

describe('DrawPoolGameComponent', () => {
  let component: DrawPoolGameComponent;
  let fixture: ComponentFixture<DrawPoolGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawPoolGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawPoolGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
