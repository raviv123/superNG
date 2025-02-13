import { Component, Inject, Output, output, ViewChild, viewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
// import { MatTypographyModule } from '@angular/material/core';
import { NgxMatTimepickerComponent, NgxMatTimepickerDirective, NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 's-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatDatepickerModule,NgxMatTimepickerModule, NgxMatTimepickerComponent,NgxMatTimepickerDirective,NgxMatTimepickerModule, MatMenuModule,CommonModule ],
  templateUrl: './s-dialog.component.html',
  styleUrl: './s-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SuperDialogComponent {

  mytime: any
  TimeFrom: string = '';
  timeTo: string = '';

  constructor( public dialogRef: MatDialogRef<SuperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  closeDialog() {
    this.dialogRef.close({data: { title: 'Meeting', start: '2025-02-15T10:00:00' }});
  }

  // timeSlots: string[] = this.generateTimeSlots();

  // generateTimeSlots(): string[] {
  //   const times: string[] = [];
  //   for (let hour = 0; hour < 24; hour++) {
  //     for (let minutes = 0; minutes < 60; minutes += 30) {
  //       const h = hour.toString().padStart(2, '0');
  //       const m = minutes.toString().padStart(2, '0');
  //       times.push(`${h}:${m}`);
  //     }
  //   }
  //   return times;
  // }

  // selectTime(time: string) {
  //   this.TimeFrom = time;
  // }

}
