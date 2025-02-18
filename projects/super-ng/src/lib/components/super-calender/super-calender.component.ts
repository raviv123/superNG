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
import { SuperDialogComponent } from '../../../public-api';
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

  handleEventClick() {
    console.log('event clicker')
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

  openDialog(event: any, action: string) {
    const dialogRef = this.dialog.open(SuperDialogComponent, {
      data: {
        event: event,
        action: action
      },
      // width: '250px',
    });

    this.afterDialogOpened.emit(dialogRef);

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.addEvent(result.data)
      })
    );
  }

}

interface DropdownOption {
  label: string,
  value: string
}