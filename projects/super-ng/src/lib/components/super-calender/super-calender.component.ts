import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, model, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timeGrid';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SuperDialogComponent } from '../../../public-api';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 's-calender',
  standalone: true,
  imports: [FullCalendarModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, SuperDialogComponent],
  templateUrl: './super-calender.component.html',
  styleUrl: './super-calender.component.scss',
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None,

})
export class SuperCalenderComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('datepicker') datepicker!: MatCalendar<any>;

  @Input() events: any[] = [];

  calendarOptions: CalendarOptions = {};
  selected = model<Date | null>(null);
  readonly dialog = inject(MatDialog);
  isDayView: boolean = false

  ngOnInit(): void {
    this.intialize()
  }

  ngAfterViewInit(): void {
    this.datepicker._userSelection.subscribe((event) => {
      const selectedDate = this.datepicker.selected as Date;
      const calendarApi = this.calendarComponent.getApi();
      if (selectedDate && this.compareDatesOnly(selectedDate, event.value) === 0) {
        calendarApi.changeView(calendarApi.view.type == 'timeGridDay' ? 'dayGridMonth' : 'timeGridDay');
      }
    });
  }

  compareDatesOnly(d1: Date, d2: Date): number {
    const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());

    return date1.getTime() - date2.getTime();
  }

  intialize() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      nowIndicator: true,
      initialView: 'dayGridMonth', // Default to month view
      slotDuration: '01:00:00', // Show one slot per hour
      slotLabelInterval: '01:00:00', // Show labels every 1 hour,
      // slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: true }, // Format time
      // expandRows: true, // Fills available space
      // allDaySlot: false // Remove all-day slot if not needed

      headerToolbar: {
        left: 'today prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      customButtons: {
        today: {
          text: 'Today', // Capitalize text
          click: () => {
            let calendarApi = this.calendarComponent.getApi();
            calendarApi.today();
            const today = new Date();
            this.datepicker.activeDate = today;
          }
        }
      },
      editable: true, // Enables drag & drop
      selectable: true, // Enables selection
      dateClick: this.handleDateClick.bind(this), // Click event
      select: this.handleSelect.bind(this),  // Range selection
      eventClick: this.handleEventClick.bind(this),
      // eventDrop: this.handleEventDrop.bind(this),
      events: this.events
      // { title: 'Meeting', start: '2025-02-07T10:00:00' },
      // { title: 'Conference', start: '2025-02-08', end: '2025-02-10' }
      // ]
    };
  }

  handleEventClick() {
    console.log('event clicker')
  }

  onDateSelect(event: any) {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(event);

  }

  onCreateClick() {
    this.openDialog()
  }

  handleDateClick(arg: any) {
    debugger
    this.openDialog()
  }

  handleSelect(arg: any) {

  }


  triggerDayView() {

  }

  openDialog() {
    const dialogRef = this.dialog.open(SuperDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.addEvent(result.data)
    });
  }

}


