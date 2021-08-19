import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import moment from 'moment';
import _, { toNumber } from 'lodash';


@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss']
})
export class CreateEventModalComponent implements OnInit {

  selected: any = new Date();
  eventEndDate: any = new Date();
  eventStartTime: any;
  eventEndTime: any;

  dateTimeClicked: boolean = false;
  startDateClicked: boolean = false;
  endDateClicked: boolean = false;
  startTimeClicked: boolean = false;
  endTimeClicked: boolean = false;
  today = new Date();
  datesToBeHighlighted: any;
  
  time = new Date();
  rxStartTime = new Date();
  rxEndTime = new Date();
  intervalId: any;
  subscription: any;
  url: string = '';

  
  quarterHours: any = ["00", "15", "30", "45"];
  times: any = [];

  constructor(
    private _snackBar: MatSnackBar,
    public modalRef: MdbModalRef<CreateEventModalComponent>
    ) { }

  ngOnInit(): void {
  // Using Basic Interval
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Using RxJS Timer
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxStartTime = new Date();
        this.rxEndTime = new Date();
      });

      // document.querySelector('.modal')!.className += ' right';
      this.getQuarterHours();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        return '';
      } else {
        return 'weekend-dates';
      }
    };
  }

  roundTimeQuarterHour() {
    var timeToReturn = new Date();

    timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15 );
    // timeToReturn.setHours(((((timeToReturn.getMinutes() / 105) + .5) | 0) + timeToReturn.getHours()) %24 );
    // Math.round(timeToReturn.getMinutes() / 15) * 15)
    // Math.round(timeToReturn.getMinutes() / 105 + .5)
    if(this.eventStartTime > timeToReturn) return this.eventStartTime;
    if(timeToReturn > this.eventStartTime) {
      this.eventStartTime = timeToReturn;
      return timeToReturn;
    }
    return timeToReturn;
  }

  getCurrentTimeQuarterHour() {
    var timeToReturn = new Date();

    timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15 );
    // timeToReturn.setHours(((((timeToReturn.getMinutes() / 105) + .5) | 0) + timeToReturn.getHours()) %24 );
    // Math.round(timeToReturn.getMinutes() / 15) * 15)
    // Math.round(timeToReturn.getMinutes() / 105 + .5)
    // if(this.eventStartTime) return this.eventStartTime;
    return timeToReturn;
  }

  getCurrentEventEndTimeQuarterHour() {
    var timeToReturn = new Date();
    
    timeToReturn.setHours(timeToReturn.getHours() + 1);
    timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15 );
    return timeToReturn;
  }

  getCurrentEventEndMinumumTimeQuarterHour() {
    var timeToReturn = new Date();
    
    // timeToReturn.setHours(timeToReturn.getHours() + 1);
    timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15 );
    timeToReturn.setMinutes(timeToReturn.getMinutes() + 15);
    return timeToReturn;
  }

  roundTimeQuarterHourEndDate() {
    var timeToReturn = new Date();
    timeToReturn.setHours(timeToReturn.getHours() + 1);
    timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15 );
    // timeToReturn.setHours(((((timeToReturn.getMinutes() / 105) + .5) | 0) + timeToReturn.getHours()) %24 );
    // Math.round(timeToReturn.getMinutes() / 15) * 15)
    // Math.round(timeToReturn.getMinutes() / 105 + .5)
    if(this.eventEndTime) return this.eventEndTime;
    if(timeToReturn > this.eventEndTime) {
      this.eventEndTime = timeToReturn;
      // return timeToReturn;
    }
    return timeToReturn;
  }

  
  openSnackBar() {
    this._snackBar.open('Copied to clipboard', 'x', {
      duration: 3000
    });
  }

  close() {
    console.log('clivked')
    this.modalRef.close()
  }

  showCalendar(type: string) {
    this.dateTimeClicked = true;
    if(type == 'start') {
      this.startDateClicked = true;
      this.endDateClicked = false;
      this.startTimeClicked = false;
      this.endTimeClicked = false;
      if(this.startDateClicked) {
        setTimeout(() => {
          document.querySelector('#startDateContainer')!.className += ' slide-in-from-left';
          
        }, 100);
      }

    } else {
      
      this.endDateClicked = true;
      this.startDateClicked = false;
      this.startTimeClicked = false;
      this.endTimeClicked = false;
      if(this.endDateClicked) {
        setTimeout(() => {
          document.querySelector('#endDateContainer')!.className += ' slide-in-from-left';
          
        }, 100);
      }
    }
  }

  showTimePicker(type: string) {
    this.dateTimeClicked = true;
    if(type == 'start') {
      this.startTimeClicked = true;
      this.endTimeClicked = false;
      this.startDateClicked = false;
      this.endDateClicked = false;
      if(this.startTimeClicked) {
        setTimeout(() => {
          document.querySelector('#startTimeContainer')!.className += ' slide-in-from-left';
          // location.href = '#';
          // location.href = '#currentTime';
          // document.getElementById("currentTime")!.scrollIntoView();
          var currentTime = document.getElementById('currentTime');
          var topPos = currentTime!.offsetTop;
    
          document.querySelector('.time-picker-container')!.scrollTop = topPos-198;
          
        }, 100);
      }

    } else {
      
      this.endTimeClicked = true;
      this.startTimeClicked = false;
      this.startDateClicked = false;
      this.endDateClicked = false;
      if(this.endTimeClicked) {
        setTimeout(() => {
          document.querySelector('#endTimeContainer')!.className += ' slide-in-from-left';

          var currentTime = document.getElementById('nextcurrentTime');
          var topPos = currentTime!.offsetTop;
    
          document.querySelector('.time-picker-container')!.scrollTop = topPos-230;
          
        }, 100);
      }
    }
  }

  changeStartDate(event: any) {
    this.selected = event;
    this.rxStartTime = this.selected!;
  }

  changeEndDate(event: any) {
    this.eventEndDate = event;
    this.rxEndTime = this.eventEndDate!;
  }

  getQuarterHours() {
    for(var i = 0; i < 24; i++){
      for(var j = 0; j < 4; j++){
        if( i < 12) {
          this.times.push((i < 1 ? '12': i) + ":" + this.quarterHours[j] + ' am');

        }
         else {
          this.times.push(( i == 12? '12': i%12) + ":" + this.quarterHours[j] + ' pm');

        }
      }
    }
  }

  getEventTimeFormatted(date: any) {
    // return moment(date).format('ddd, MMM D, YYYY h:mm A');
    return moment(date).format('h:mm a');
  }

  returnIndexOfCurrentTime(time: any) {
    for(var i = 0; i < this.times.length; i++) {
      if(this.times[i] == time) {
        break;
        
      } else {
        continue;
      }
    }

    return i;
  }

  changeStartTime(newTime: any) {
    if(newTime.split(' ')[1] == 'am') {
      this.eventStartTime = new Date();
      
      this.eventStartTime.setHours( (newTime.split(' ')[0].split(':')[0] == 12? 0: newTime.split(' ')[0].split(':')[0]));
      this.eventStartTime.setMilliseconds(Math.round(  this.eventStartTime.getMilliseconds() / 1000) * 1000);
      this.eventStartTime.setSeconds(Math.ceil(  this.eventStartTime.getSeconds() / 60) * 60);
      this.eventStartTime.setMinutes(Math.ceil(  newTime.split(' ')[0].split(':')[1] ));

    } else {
      this.eventStartTime = new Date();

      this.eventStartTime.setHours( (newTime.split(' ')[0].split(':')[0] == 12 ? 0: 12) + toNumber(newTime.split(' ')[0].split(':')[0]));
      this.eventStartTime.setMilliseconds(Math.round(  this.eventStartTime.getMilliseconds() / 1000) * 1000);
      this.eventStartTime.setSeconds(Math.ceil(  this.eventStartTime.getSeconds() / 60) * 60);
      this.eventStartTime.setMinutes(Math.ceil(  newTime.split(' ')[0].split(':')[1] ) );

    }
  }

  changeEndTime(newTime: any) {
    if(newTime.split(' ')[1] == 'am') {
      this.eventEndTime = new Date();
      
      this.eventEndTime.setHours( (newTime.split(' ')[0].split(':')[0] == 12? 0: newTime.split(' ')[0].split(':')[0]));
      this.eventEndTime.setMilliseconds(Math.round(  this.eventEndTime.getMilliseconds() / 1000) * 1000);
      this.eventEndTime.setSeconds(Math.ceil(  this.eventEndTime.getSeconds() / 60) * 60);
      this.eventEndTime.setMinutes(Math.ceil(  newTime.split(' ')[0].split(':')[1] ));

    } else {
      this.eventEndTime = new Date();
      
      this.eventEndTime.setHours( (newTime.split(' ')[0].split(':')[0] == 12 ? 0: 12) + toNumber(newTime.split(' ')[0].split(':')[0]));
      this.eventEndTime.setMilliseconds(Math.round(  this.eventEndTime.getMilliseconds() / 1000) * 1000);
      this.eventEndTime.setSeconds(Math.ceil(  this.eventEndTime.getSeconds() / 60) * 60);
      this.eventEndTime.setMinutes(Math.ceil(  newTime.split(' ')[0].split(':')[1] ) );

    }
  }
}
