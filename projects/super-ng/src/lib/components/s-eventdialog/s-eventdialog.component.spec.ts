import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SEventdialogComponent } from './s-eventdialog.component';

describe('SEventdialogComponent', () => {
  let component: SEventdialogComponent;
  let fixture: ComponentFixture<SEventdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SEventdialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SEventdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
