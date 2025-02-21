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

  popupState: string = ''

  // allDaySelected: boolean = false;
  allDayChecked: boolean = false;

  repeatEventsOptions: any[] = [
    { value: 'notRepeat', label: 'Does not repeat' },
    { value: 'daily', label: 'Daily' }
  ];

  timeSlots: any[] = this._generateTimeSlots();


  constructor(public dialogRef: MatDialogRef<SuperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this._initialize()
  }

  private _initialize() {
    if (this.data.action == 'onCalenderClick') {
      this.popupState ='create';
      if (this.data.event.view.type == 'dayGridMonth') {
        this.controls.allDaySelected = true;
      }

      this.controls.eventReps = 'notRepeat';

      const timeFrom = this._convertIntoformattedTime(this.data.event.dateStr);
      const timeTo = this._convertIntoformattedTime(this.data.event.dateStr, true);

      debugger

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
      this.popupState ='create';
      this.controls.allDaySelected = false;
      this.controls.eventReps = 'notRepeat';

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
    } else if (this.data.action == 'edit') {
      debugger
      this.popupState ='edit';
      this.controls.allDaySelected = this.data.event.info.event.allDay;
      const { timeFrom, timeTo } = this._fetchTimeFromDateInstance(this.data.event.info.event.start, this.data.event.info.event.end);
      const endDate = this._substractOneDay(this.data.event.info.event.end);
      this.controls.eventReps = 'notRepeat';
      this.controls.title = this.data.event.info.event.title;
      
      

      if (this.data.event.info.event.allDay) {
        this.controls.dateFrom = this.data.event.info.event.start;
        this.controls.dateTo = endDate as any;
        this.controls.date = this.data.event.info.event.start;
        this.controls.timeFrom = "08:00 AM";
        this.controls.timeTo = "09:00 AM";
      } else {
        this.controls.dateFrom = this.data.event.info.event.start;
        this.controls.dateTo = endDate as any;
        this.controls.date = this.data.event.info.event.start;
        this.controls.timeFrom = timeFrom;
        this.controls.timeTo = timeTo;
      }

    }

    console.log(this.controls)
  }

  private _substractOneDay(dateInstance: any) {
    const date = new Date(dateInstance);
    // Subtract one day
    const newDate = new Date(date.getTime() - 24 * 60 * 60 * 1000)
     return newDate
  }


  private _fetchTimeFromDateInstance(start: any, end: any) {
    const startDate = new Date(start);
    const endDate = new Date(start);

    return { timeFrom: startDate.toLocaleTimeString(), timeTo: endDate.toLocaleTimeString() }
  }


  private _convertIntoformattedTime(dateTime: string, plusOneHours: boolean = false): string {
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

  private _generateTimeSlots(): { value: string; viewValue: string }[] {
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

  closeDialog() {
    this.dialogRef.close({ action: this.popupState, controls: this.controls });
  }

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
    this.controls.allDaySelected = event.checked;
  }

  selectEventReps(event: any) {
    this.controls.eventReps = event.value;
  }
}
