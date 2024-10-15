import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptionActionDisplayCardComponent } from '../../../../app/game/component/action-display/adaption-action-display-card/adaption-action-display-card.component';

describe('AdaptionActionDisplayCardComponent', () => {
  let component: AdaptionActionDisplayCardComponent;
  let fixture: ComponentFixture<AdaptionActionDisplayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptionActionDisplayCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdaptionActionDisplayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
