import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
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
  description: string
}

@Component({
  selector: 'lib-s-eventdialog',
  standalone: true,
  imports: [MatDialogContent, MatIconModule, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatDatepickerModule, NgxMatTimepickerModule, NgxMatTimepickerComponent, NgxMatTimepickerDirective, NgxMatTimepickerModule, MatCheckboxModule, MatMenuModule, MatFormFieldModule, MatSelectModule, MatInputModule, CommonModule],
  templateUrl: './s-eventdialog.component.html',
  styleUrl: './s-eventdialog.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SEventdialogComponent {
  
  viewItems: eventDialog = {
    title: '',
    description: ''
  };

  eventId: string = '';
  timeDuration: string = ''

  constructor(public dialogRef: MatDialogRef<SEventdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this._initialize()
  }

  private _initialize() {
    this.viewItems.title = this.data.event.title;
    this.eventId = this.data.info.event.id;

    this.viewItems.description =  this.data.info.event.extendedProps.description;
    this.data.event.endDate = this._substractOneDay(this.data.event.endDate);
    this.timeDuration =  this._getEventTimeDuration()

  }

  private _substractOneDay(dateInstance: any) {
    const date = new Date(dateInstance);
    // Subtract one day
    const newDate = new Date(date.getTime() - 24 * 60 * 60 * 1000)
     return newDate
  }
  
  private _getEventTimeDuration() {
      return this.data.info.event.allDay ? this._getDurationInDays(this.data.event.startDate, this.data.event.endDate) : this._getDurationInDaysHours(this.data.event.startDate, this.data.event.endDate)
  }

  private _getDurationInDaysHours(startDateStr: string,endDateStr: string): string {
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

  private _getDurationInDays(date1: string, date2: string): string {
    const dateInstance1 = new Date(date1);
    const dateInstance2 = new Date(date2);

    // Reset time to ignore time differences
    dateInstance1.setHours(0, 0, 0, 0);
    dateInstance2.setHours(0, 0, 0, 0);

    // Calculate the difference in days
    const diffInMs = Math.abs(dateInstance2.getTime() - dateInstance1.getTime());
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Define date formatting options
    const optionsWithoutYear: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    const optionsWithYear: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };

    // If more than one day apart
    if (diffInDays > 1) {
        const year1 = dateInstance1.getFullYear();
        const year2 = dateInstance2.getFullYear();

        // If years are different, include years in both dates
        if (year1 !== year2) {
            return `${dateInstance1.toLocaleDateString('en-US', optionsWithYear)} – ${dateInstance2.toLocaleDateString('en-US', optionsWithYear)}`;
        }

        // If years are the same, show only month & day range
        return `${dateInstance1.toLocaleDateString('en-US', optionsWithoutYear)} – ${dateInstance2.toLocaleDateString('en-US', optionsWithoutYear)}, ${year1}`;
    }

    // Otherwise, return a single formatted date
    return dateInstance1.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}


  deleteEvent(){
    this.dialogRef.close({action: 'delete',id: this.eventId});
  }

  inEditEvent() {
    this.dialogRef.close({action: 'edit',id: this.eventId});
  }
}
