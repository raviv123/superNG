import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ComponentRef, EventEmitter, inject, Input, model, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timeGrid';
import { SEventdialogComponent, SuperDialogComponent } from '../../../public-api';
import { SubscriptionUtils } from '../../utils/subscription.utils';



@Component({
  selector: 's-calender',
  standalone: true,
  imports: [FullCalendarModule, MatCardModule, MatDatepickerModule, MatMenuModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatNativeDateModule, CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, SuperDialogComponent],
  templateUrl: './super-calender.component.html',
  styleUrl: './super-calender.component.scss',
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None,

})
export class SuperCalenderComponent extends SubscriptionUtils implements OnInit, AfterViewInit {

  @Output() dateTimeClick = new EventEmitter();
  @Output() initializedSuccess = new EventEmitter();
  @Output() afterDialogOpened = new EventEmitter();


  @Input() readonlyView: boolean = false;
  @Input() availableViews: string[] = ['Month', 'Week', 'Day'];
  @Input() showLeftSidebar: boolean = true;

  @Input() createButtonText: string = 'Create';

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('datepicker') datepicker!: MatCalendar<Date>;

  @Input() events: any[] = [];

  allCalenderViews: DropdownOption[] = [
    { value: 'dayGridMonth', label: 'Month' },
    { value: 'timeGridWeek', label: 'Week' },
    { value: 'timeGridDay', label: 'Day' },
  ];

  calenderViews: DropdownOption[] = [];

  selectedView: string = '';

  calendarOptions: CalendarOptions = {};
  selected = model<Date | null>(null);
  readonly dialog = inject(MatDialog);
  isDayView: boolean = false
  showEventView: boolean = false;

  ngOnInit(): void {
    this.calenderViews = this._getCalendarViews();
    this.selectedView = this.calenderViews[0].value
    this.calendarOptions = this._getCalendarOptions();
  }

  ngAfterViewInit(): void {
    this._addSubscriptions();
    this.initializedSuccess.emit(this);
  }

  private _getCalendarViews(): DropdownOption[] {
    const currentViews = this.availableViews.map(view => view.toLowerCase());
    return this.allCalenderViews.filter(option => currentViews.includes(option.label.toLowerCase()));
  }

  private _addSubscriptions() {
    this.subscription.add(
      this.datepicker._userSelection.subscribe((event) => {
        const selectedDate = this.datepicker.selected as Date;
        const calendarApi = this.calendarComponent.getApi();
        if (selectedDate && this.areSameDates(selectedDate, event.value as Date)) {
          calendarApi.changeView(calendarApi.view.type == 'timeGridDay' ? 'dayGridMonth' : 'timeGridDay');
        }
      })
    );
  }

  private _getCalendarOptions(): CalendarOptions {
    return {
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
      // select: this.handleSelect.bind(this),  // Range selection
      eventClick: this.handleEventClick.bind(this),
      // eventDrop: this.handleEventDrop.bind(this),
      events: this.events
      // { title: 'Meeting', start: '2025-02-07T10:00:00' },
      // { title: 'Conference', start: '2025-02-08', end: '2025-02-10' }
      // ]
    };
  }

  areSameDates(d1: Date, d2: Date): boolean {
    const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());

    return (date1.getTime() - date2.getTime()) === 0;
  }

  onViewChange(event: MatSelectChange) {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.changeView(event.value);
  }

  title: string = '';
  startDate: string = '';
  endDate: string = '';

  handleEventClick(info: any) {

    const event = {
      title: info.event.title,
      startDate: info.event.start ? info.event.start.toLocaleString() : 'N/A',
      endDate: info.event.end ? info.event.end.toLocaleString() : 'N/A'
    }

    // const allDay = info.event.allDay ? 'Yes' : 'No'

    let data = {
      event: event,
      info: info
    }

    const dialogRef = this.dialog.open(SEventdialogComponent, {
      data: data,
      // width: '250px',
    });


    this.subscription.add(
      dialogRef.afterClosed().subscribe(response => {
        if (response.action == 'delete') {
          info.event.remove();
        } else if (response.action == 'edit') {
          this.openDialog(data, response.action, info.event, response.id)
        }
      })
    );

  }

  onDateSelect(event: any) {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(event);
  }

  onCreateClick() {
    const calendarApi = this.calendarComponent.getApi();
    this.openDialog(calendarApi, 'createEventGLobal')
  }

  handleDateClick(event: any) {
    this.dateTimeClick.emit(event);
    if (this.readonlyView) return;

    this.openDialog(event, 'onCalenderClick');
  }


  mergeDateTime(dateStr: string, timeStr: string) {
    const date = new Date(dateStr); // Parse given date string in IST
    const timeParts = timeStr.match(/(\d+):(\d+) (\w{2})/); // Extract time parts

    if (!timeParts) return null; // Return null if time format is incorrect

    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const meridian = timeParts[3];

    // Convert 12-hour format to 24-hour format
    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;

    // Set extracted time into the existing Date object
    date.setHours(hours, minutes, 0, 0);

    // Convert to ISO 8601 format without timezone shift
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
    const hour = String(date.getHours()).padStart(2, '0'); // Ensure 2-digit hours
    const minute = String(date.getMinutes()).padStart(2, '0'); // Ensure 2-digit minutes
    const second = String(date.getSeconds()).padStart(2, '0'); // Ensure 2-digit seconds

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`
  }

  getEventFormattedData(response: any) {
    let eventDetails = {}
    if (response.controls.allDaySelected) {

      const endDate = new Date(response.controls.dateTo);
      endDate.setDate(endDate.getDate() + 1);
      eventDetails = {
        id: Date.now(),
        title: response.controls.title || '(No title)',
        start: response.controls.dateFrom, //this.formatDate(response.controls.dateFrom),
        end: endDate,//response.controls.dateTo,//this.formatDate(response.controls.dateTo),
        allDay: response.controls.allDaySelected,
        extendedProps: {
          description: response.controls.description,
          // department: 'Sales',
          // priority: 'High'
        },
        // description: response.controls.title.description,
      };

    } else {
      // let title = 
      eventDetails = {
        id: Date.now(),
        title: response.controls.title || '(No title)',
        start: this.mergeDateTime(response.controls.date, response.controls.timeFrom),
        end: this.mergeDateTime(response.controls.date, response.controls.timeTo),
        allDay: response.controls.allDaySelected,
        extendedProps: {
          description: response.controls.description,
          // department: 'Sales',
          // priority: 'High'
        }
        // description: response.controls.title.description,
      };
    }
    return eventDetails

  }


  openDialog(event: any, action: string, existingEvent?: any, oldEventId?: any) {
    const dialogRef = this.dialog.open(SuperDialogComponent, {
      data: {
        event: event,
        action: action
      },
      // width: '250px',
    });

    this.afterDialogOpened.emit(dialogRef);

    this.subscription.add(
      dialogRef.afterClosed().subscribe(response => {
        if (!response)
          return;
        if (response.action == 'create') {
          const fromattedData = this.getEventFormattedData(response)
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.addEvent(fromattedData)
        } else if (response.action == 'edit') {
          debugger
          let calendarApi = this.calendarComponent.getApi(); // Get FullCalendar API
          let oldEvent = calendarApi.getEventById(oldEventId); // Find event by ID
          if (oldEvent) { 
            const updatedEvent = this.getEventFormattedData(response)
            oldEvent.remove();
            calendarApi.addEvent(updatedEvent)
          }
          // const fromattedData: any = this.getEventFormattedData(response)
          // existingEvent.setProp('title', fromattedData.title)

        }
      })
    );
  }
}

interface DropdownOption {
  label: string,
  value: string
}