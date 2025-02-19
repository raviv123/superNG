import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatTimepickerModule, NgxMatTimepickerComponent, NgxMatTimepickerDirective } from 'ngx-mat-timepicker';

interface eventDialog {
  title: string,
  startDate: string,
  endDate: string
}

@Component({
  selector: 'lib-s-eventdialog',
  standalone: true,
  imports: [MatDialogContent, MatIconModule, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatDatepickerModule, NgxMatTimepickerModule, NgxMatTimepickerComponent, NgxMatTimepickerDirective, NgxMatTimepickerModule, MatCheckboxModule, MatMenuModule, MatFormFieldModule, MatSelectModule, MatInputModule, CommonModule],
  templateUrl: './s-eventdialog.component.html',
  styleUrl: './s-eventdialog.component.css'
})
export class SEventdialogComponent {

  info: eventDialog = {
    title: '',
    startDate: '',
    endDate: ''
  };

  constructor(public dialogRef: MatDialogRef<SEventdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this._initialize()
  }

  private _initialize() {

    this.info.title = this.data.event.title;
    this.info.startDate = this.data.event.startDate;
    this.info.endDate = this.data.event.endDate;

    this._transformDataFormat()

  }

  eventDate: string = ''

  private _transformDataFormat() {
    if (this.data.info.event.allDay) {
      this.eventDate = this._convertFormattedDate(this.data.event.startDate)
    } else {
      this.eventDate = this._convertFormatIntoHoursFormat(this.data.event.startDate, this.data.event.endDate)
    }
  }
  private _convertFormatIntoHoursFormat(startDateStr: string,endDateStr: string): string {
    // Convert strings to Date objects
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Format the date (e.g., "Friday, January 10")
    const formattedDate = startDate.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });

    // Format the time (e.g., "3:00 – 4:00am")
    const startTime = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    });
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    });

    // Combine everything into the final format
    return `${formattedDate}⋅${startTime} – ${endTime}`;
  }

  private _convertFormattedDate(date: string) {
    const dateInstance = new Date(date); // Convert to Date object

    // Format the output
    const options: any = { weekday: 'long', month: 'long', day: 'numeric' };
    return dateInstance.toLocaleDateString('en-US', options);
  }

  deleteEvent(){

  }


}
