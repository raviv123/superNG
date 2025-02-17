import { Component, Inject, Output, output, ViewChild, viewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
// import { MatTypographyModule } from '@angular/material/core';
import { NgxMatTimepickerComponent, NgxMatTimepickerDirective, NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon'

@Component({
  selector: 's-dialog',
  standalone: true,
  imports: [MatDialogContent,MatIconModule, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatDatepickerModule,NgxMatTimepickerModule, NgxMatTimepickerComponent,NgxMatTimepickerDirective,NgxMatTimepickerModule,MatCheckboxModule, MatMenuModule,MatFormFieldModule, MatSelectModule, MatInputModule,CommonModule ],
  templateUrl: './s-dialog.component.html',
  styleUrl: './s-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SuperDialogComponent {

  mytime: any
  timeFrom: string = '';
  timeTo: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  date: string = '';

  allDaySelected: boolean = false;
  allDayChecked: boolean = false;

  foods: any[] = [
    {value: 'steak-0', viewValue: '10:00AM'},
    {value: 'pizza-1', viewValue: '10:00AM'},
    {value: 'tacos-2', viewValue: '10:00AM'},
  ];

  constructor( public dialogRef: MatDialogRef<SuperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.Initialize()
    }

    Initialize() {
      debugger
      const date = new Date(this.data.event.dateStr);
      if(this.data.event.view.type == 'dayGridMonth') {
        this.allDaySelected = true;
        // allDayChecked
        
      }
      const timeFrom = date.toLocaleTimeString("en-US", { hour12: false });
      date.setHours(date.getHours() + 1);
      const timeTo = date.toLocaleTimeString("en-US", { hour12: false });
      
      if(this.allDaySelected) {
        this.dateFrom = this.data.event.dateStr;
        this.dateTo = this.data.event.dateStr;
        this.date = this.data.event.dateStr;
        this.timeFrom = "10:00:00";
        this.timeTo = "11:00:00";
      } else {
        this.dateFrom = this.data.event.dateStr;
        this.dateTo = this.data.event.dateStr;
        this.date = this.data.event.dateStr;
        this.timeFrom = timeFrom;
        this.timeTo = timeTo;
      }
    }

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

  onCheckboxChange(event: any) {
    debugger
    this.dateFrom = this.data.event.dateStr;
    if(event.checked) {
      this.allDaySelected = true;
    } else {
      this.allDaySelected = false;
    }
  }
}
