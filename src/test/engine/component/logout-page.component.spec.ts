import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutPageComponent } from '../../../app/engine/component/logout-page/logout-page.component';

describe('LogoutPageComponent', () => {
  let component: LogoutPageComponent;
  let fixture: ComponentFixture<LogoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
