import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperCalenderComponent } from './super-calender.component';

describe('SuperCalenderComponent', () => {
  let component: SuperCalenderComponent;
  let fixture: ComponentFixture<SuperCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
