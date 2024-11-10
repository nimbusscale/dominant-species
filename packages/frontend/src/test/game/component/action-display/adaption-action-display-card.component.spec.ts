import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptionActionDisplayCardComponent } from '../../../../app/game/component/action-display/adaption-action-display-card/adaption-action-display-card.component';
import { AdaptionActionDisplayService } from '../../../../app/game/service/action-display/adaption-action-display.service';
import { of } from 'rxjs';

describe('AdaptionActionDisplayCardComponent', () => {
  let component: AdaptionActionDisplayCardComponent;
  let adaptionActionDisplayServiceMock: jasmine.SpyObj<AdaptionActionDisplayService>;
  let fixture: ComponentFixture<AdaptionActionDisplayCardComponent>;

  beforeEach(async () => {
    adaptionActionDisplayServiceMock = jasmine.createSpyObj([], {
      ready$: of(false),
    });

    await TestBed.configureTestingModule({
      imports: [AdaptionActionDisplayCardComponent],
      providers: [
        { provide: AdaptionActionDisplayService, useValue: adaptionActionDisplayServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdaptionActionDisplayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
