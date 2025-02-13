import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperNGComponent } from './super-ng.component';

describe('SuperNGComponent', () => {
  let component: SuperNGComponent;
  let fixture: ComponentFixture<SuperNGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperNGComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperNGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
