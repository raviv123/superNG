import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperDialogComponent } from './s-dialog.component';

describe('SuperDialogComponent', () => {
  let component: SuperDialogComponent;
  let fixture: ComponentFixture<SuperDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
