import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import moment from 'moment';
import _, { toNumber } from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicInfoService } from 'src/app/services/basic-info/basic-info.service';
import { DatetimeFormatterService } from 'src/app/services/datetime-formatter/datetime-formatter.service';


@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss']
})
export class CreateEventModalComponent implements OnInit {
  
  isLoading: boolean;
  saved: boolean;
  form: FormGroup = new FormGroup({});
  categoriesData: any[];
  subCategoriesData: any[];
  tagsString: string;
  tagsList: Array<any>;
  recurringStore: string;

  isDateCorrect: boolean;
  isDateIntervalCorrect: boolean;
  isTimeCorrect: boolean;
  isTimeIntervalCorrect: boolean;

  hosting: any = 1;

  url: string = '';
  currentRoute: string = '';

  formattedAddress = '';
  addressCoordinates = '';


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

  
  quarterHours: any = ["00", "15", "30", "45"];
  times: any = [];

  constructor(
    private _snackBar: MatSnackBar,
    public modalRef: MdbModalRef<CreateEventModalComponent>,
    private formBuilder: FormBuilder,
    private basicInfoService: BasicInfoService,
    private dtService: DatetimeFormatterService
    ) { 
      
        this.isLoading = false;
        this.saved = false;
        this.categoriesData = [];
        this.subCategoriesData = [];
        this.tagsString = '';
        this.tagsList = [];
        this.recurringStore = '0';

        this.isDateCorrect = true;
        this.isDateIntervalCorrect = true;
        this.isTimeCorrect = true;
        this.isTimeIntervalCorrect = true;
    }

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

    
      this.initForm();
      // this.toggleVenueView();
      // this.getCategories();
      // this.disableSubcategory();
      this.setHosting('1');
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

  getEventDateFormatted(date: any) {
    return moment(date).format('MMM DD, YYYY');
  }
  
  getDisplayEventTimeFormatted(date: any) {
    // return moment(date).format('ddd, MMM D, YYYY h:mm A');
    return moment(date).format('h:mm A');
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

  
  public get f(): any {
    return this.form.controls;
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      // description: ['', [Validators.required, Validators.maxLength(250)]],
      // venue: [''],
      // gps: [''],
      start_date: [this.getEventDateFormatted(this.selected), Validators.required],
      end_date: [this.getEventDateFormatted(this.eventEndDate), Validators.required],
      start_time: [this.getDisplayEventTimeFormatted(this.roundTimeQuarterHour()), Validators.required],
      end_time: [this.getDisplayEventTimeFormatted(this.roundTimeQuarterHourEndDate()), Validators.required],
      // recurring: ['0'],
      // type: ['', Validators.required],
      // ticketing: ['', Validators.required],
      // category_id: ['', Validators.required],
      // subcategory_id: ['', Validators.required],
      // tags: [''],
      // venue_tobe_announced: [0],
      // hosting: [this.hosting]
    });

    this.setHostingValidators();
  }

  
  setHosting(value: any): void {
    // this.f.hosting.setValue(value);
    this.form.controls['hosting'].setValue(value);
    // console.log(this.form.controls['hosting'].value)
    this.hosting =  this.form.controls['hosting'].value
    console.log(value)

    console.log(value);
    this.f.hosting.setValue(value);
    this.setHostingValidators();
  }

  setHostingValidators() {
    if (this.f.hosting.value == '1') {
      console.log('...adding physical event validators');
      this.f.venue.setValidators(Validators.required);
      // this.f.gps.setValidators(Validators.required);
      this.f.venue.updateValueAndValidity();
      // this.f.gps.updateValueAndValidity();
    }
    else if (this.f.hosting.value == '0') {
      console.log('...removing physical event validators');
      this.f.venue.clearValidators();
      // this.f.gps.clearValidators();
      this.f.venue.updateValueAndValidity();
      // this.f.gps.updateValueAndValidity();
    }
  }

  dateValidation(){
    let date = new Date();
    date.setHours(0,0,0,0);
    let today = date.valueOf();
    let sd = Date.parse(this.selected);
    let ed = Date.parse(this.eventEndDate);    
    let now = new Date().getTime();
    let st = new Date(this.roundTimeQuarterHour()).getTime();
    let et = new Date(this.roundTimeQuarterHourEndDate()).getTime();

    console.log(Date.parse(this.selected));
    console.log(Date.parse(this.eventEndDate));
    console.log(today);

    // check if event date is greater than today's date
    if (sd >= today) this.isDateCorrect = true;
    else this.isDateCorrect = false;
      
    // check if end date is greater start date
    if (ed >= sd) this.isDateIntervalCorrect = true;
    else this.isDateIntervalCorrect = false;

    // if date is same check time
    if (ed == sd){
      // check if event date is today and
      // check if event time is greater than current time
      if (sd == today) {
        if (st > now) this.isTimeCorrect = true;
        else this.isTimeCorrect = false;
      }

      // check if end date is greater start date
      if (et > st) this.isTimeIntervalCorrect = true;
      else this.isTimeIntervalCorrect = false;
    }
  }


  create(): void {
    console.log(this.getFormData());
    this.saved = true;
    this.dateValidation();
    console.log(this.isDateCorrect);
    console.log(this.isDateIntervalCorrect);

    // TODO: add date time validation variables to if statement

    if (this.form.valid && this.isDateCorrect && this.isDateIntervalCorrect && this.isTimeCorrect && this.isTimeIntervalCorrect) {
      this.isLoading = true;
      const data = this.getFormData();
      console.log(data);
      this.basicInfoService.createBasicEvent(data).then(
        res => {
          if (res) {
            console.log(res);
            console.log(data.recurring);
            this.saveCreatedEvent(res).then(
              ok => {
                if (ok) {
                  this.isLoading = false;
                  if(data.recurring == '1') {
                    window.location.href = '/create_event/schedule';
                  }
                  else {
                    window.location.href = '/create_event/more_details';
                  }
                    // ? this.router.navigateByUrl('/create_event/schedule')
                  //  window.location.href = '/create_event/more_details';
                    // : this.router.navigateByUrl('/create_event/more_details');
                }
              },
              err => {
                // we still navigate but will get the data from the side menu.
                if(data.recurring == '1') {
                  window.location.href = '/create_event/schedule';
                }
                else {
                  window.location.href = '/create_event/more_details';
                }
              }
            );
          }
          else {
            this.isLoading = false;
          }
        },
        err => {
          console.log(err);
          this.isLoading = false;
        }
      );
    }
    else{
      console.log(this.findInvalidControls());
      window.scrollTo(0,0);
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }


  getFormData(): any { 
    const data = {
      title: this.f.title.value,
      description: '',
      venue: null,
      gps: null,
      start_date: this.dtService.formatDateTime(this.selected, this.roundTimeQuarterHour()),
      end_date: this.dtService.formatDateTime(this.eventEndDate, this.roundTimeQuarterHourEndDate()),
      recurring: '0',
      type: '0',
      category_id: '2',
      subcategory_id: '2',
      tags: '',
      // venue_tobe_announced: this.recurringStore,
      hosting: '0',
      ticketing: '0'
    };
    return data;
  }

  saveCreatedEvent(eventId: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.basicInfoService.getCreatedEvent(eventId).then(
        res => {
          console.log(res);
          sessionStorage.removeItem('created_event');
          sessionStorage.setItem('created_event', JSON.stringify(res));
          resolve(true);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }







}
