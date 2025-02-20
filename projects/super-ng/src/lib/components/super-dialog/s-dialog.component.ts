import { Component, Inject, Output, output, ViewChild, viewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// import { MatTypographyModule } from '@angular/material/core';
import { NgxMatTimepickerComponent, NgxMatTimepickerDirective, NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 's-dialog',
  standalone: true,
  imports: [MatDialogContent, MatIconModule, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatDatepickerModule, NgxMatTimepickerModule, NgxMatTimepickerComponent, NgxMatTimepickerDirective, NgxMatTimepickerModule, MatCheckboxModule, MatMenuModule, MatFormFieldModule, MatSelectModule, MatInputModule, CommonModule],
  templateUrl: './s-dialog.component.html',
  styleUrl: './s-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SuperDialogComponent {

  controls = {
    timeFrom: '',
    timeTo: '',
    dateFrom: '',
    dateTo: '',
    date: '',
    eventReps: '',
    allDaySelected: false,
    description: '',
    title: ''
  }

  // allDaySelected: boolean = false;
  allDayChecked: boolean = false;

  repeatEventsOptions: any[] = [
    { value: 'notRepeat', label: 'Does not repeat' },
    { value: 'daily', label: 'Daily' }
  ];

  constructor(public dialogRef: MatDialogRef<SuperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.Initialize()
  }

  Initialize() {
    if (this.data.action == 'onCalenderClick') {
      if (this.data.event.view.type == 'dayGridMonth') {
        this.controls.allDaySelected = true;
      }

      this.controls.eventReps = 'notRepeat';

      const timeFrom = this.formatTime(this.data.event.dateStr);
      const timeTo = this.formatTime(this.data.event.dateStr, true);

      if (this.controls.allDaySelected) {
        this.controls.dateFrom = this.data.event.date;
        this.controls.dateTo = this.data.event.date;
        this.controls.date = this.data.event.date;
        this.controls.timeFrom = "10:00 AM";
        this.controls.timeTo = "11:00 AM";
      } else {
        this.controls.dateFrom = this.data.event.date;
        this.controls.dateTo = this.data.event.date;
        this.controls.date = this.data.event.date;
        this.controls.timeFrom = timeFrom;
        this.controls.timeTo = timeTo;
      }
    }
    else if (this.data.action == 'createEventGLobal') {
      // if (this.data.event.view.type == 'dayGridMonth') {
      this.controls.allDaySelected = false;
      this.controls.eventReps = 'notRepeat';
      // allDayChecked
      // }

      const currentDate = this.data.event.getDate();
      const formattedDate = currentDate.toISOString().split('T')[0];

      if (this.controls.allDaySelected) {
        this.controls.dateFrom = formattedDate;
        this.controls.dateTo = formattedDate;
        this.controls.date = formattedDate;
        this.controls.timeFrom = "08:00 AM";
        this.controls.timeTo = "09:00 AM";
      } else {
        this.controls.dateFrom = formattedDate;
        this.controls.dateTo = formattedDate;
        this.controls.date = formattedDate;
        this.controls.timeFrom = "08:00 AM";
        this.controls.timeTo = "09:00 AM";
      }
        
    }
  }

  closeDialog() {
    this.dialogRef.close({ data: { title: 'Meeting', start: '2025-02-15T10:00:00' }, controls: this.controls });
  }

  timeSlots: any[] = this.generateTimeSlots();

  generateTimeSlots(): { value: string; viewValue: string }[] {
    const times: { value: string; viewValue: string }[] = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const period = hour < 12 ? 'AM' : 'PM';
        let displayHour = hour % 12 || 12; // Convert 0 to 12 for AM/PM format
        const h = displayHour.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');

        const time12HourFormat = `${h}:${m} ${period}`;
        times.push({ value: time12HourFormat, viewValue: time12HourFormat });
      }
    }

    return times;
  }

  // selectTime(time: string) {
  //   this.TimeFrom = time;
  // }

  onTimeSlotFromChange(event: any) {
    this.controls.timeFrom = event.value;
  }

  onTimeSlotToChange(event: any) {
    this.controls.timeTo = event.value;

  }


  onFromDateChange(event: any) {
    this.controls.dateFrom = event.value
  }

  onToDateChange(event: any) {
    this.controls.dateTo = event.value
  }

  onCheckboxChange(event: any) {
    // this.dateFrom = this.data.event.dateStr;
    if (event.checked) {
      this.controls.allDaySelected = true;
    } else {
      this.controls.allDaySelected = false;
    }
  }

  formatTime(dateTime: string, plusOneHours: boolean = false): string {
    const date = new Date(dateTime);

    if (plusOneHours)
      date.setHours(date.getHours() + 1);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? 'AM' : 'PM';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12 || 12;

    // Format hours and minutes properly
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

    return formattedTime;
  }

  selectEventReps(event: any) {
    this.controls.eventReps = event.value;
  }
}
