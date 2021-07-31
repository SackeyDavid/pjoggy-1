import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { EventsService } from 'src/app/services/events/events.service';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatetimeFormatterService } from 'src/app/services/datetime-formatter/datetime-formatter.service';

@Component({
  selector: 'app-postpone-event-alert',
  templateUrl: './postpone-event-alert.component.html',
  styleUrls: ['./postpone-event-alert.component.scss']
})
export class PostponeEventAlertComponent implements OnInit {

  id: string = '';
  errMsg: string = '';

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription: any;

  saved: boolean;
  form: FormGroup = new FormGroup({});
  isLoading: boolean;

  
  isDateCorrect: boolean;
  isDateIntervalCorrect: boolean;
  isTimeCorrect: boolean;
  isTimeIntervalCorrect: boolean;
  

  constructor(
    private _snackBar: MatSnackBar,
    public modalRef: MdbModalRef<PostponeEventAlertComponent>,
    private eventsService: EventsService,
    private formBuilder: FormBuilder,
    private dtService: DatetimeFormatterService
  ) { 
    this.saved = false;
    this.isLoading = false;

    
    this.isDateCorrect = true;
    this.isDateIntervalCorrect = true;
    this.isTimeCorrect = true;
    this.isTimeIntervalCorrect = true;
  }

  ngOnInit(): void {
    
    this.initForm();
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
        this.rxTime = time;
      });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  roundTimeQuarterHour() {
    var timeToReturn = new Date();

    timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15 );
    // timeToReturn.setHours(((((timeToReturn.getMinutes() / 105) + .5) | 0) + timeToReturn.getHours()) %24 );
    // Math.round(timeToReturn.getMinutes() / 15) * 15)
    // Math.round(timeToReturn.getMinutes() / 105 + .5)
    return timeToReturn;
  }


  openSnackBar() {
    this._snackBar.open('Event has been successfully postponed', 'x', {
      duration: 3000
    });
  }

  openErrorSnackBar() {
    this._snackBar.open('Oops, event postpone failed', 'x', {
      duration: 3000
    });
  }

  dateValidation(){
    let date = new Date();
    date.setHours(0,0,0,0);
    let today = date.valueOf();
    let sd = Date.parse(this.f.start_date.value);
    let ed = Date.parse(this.f.end_date.value);
    let now = new Date().getTime();
    let st = new Date(this.f.start_time.value).getTime();
    let et = new Date(this.f.end_time.value).getTime();

    console.log(Date.parse(this.f.start_date.value));
    console.log(Date.parse(this.f.end_date.value));
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

  postPoneEvent(){
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

      this.eventsService.postPoneEvent(this.id, data).then(
        res => {
          if (res) {
            console.log(res);
            this.openSnackBar();
            this.modalRef.close();         
            // resolve(true);
            
            // TODO: reload page 
            window.open('/user_events', "_self");
                  
          }
          else {
            this.isLoading = false;
          }
        },
        err => {
          console.log(err);
          this.isLoading = false;
          this.openErrorSnackBar();
          this.modalRef.close()
          this.errMsg = err
          // reject(err);
        }
      );
    }
    else{
      console.log('scrolling to top');
      window.scrollTo(0,0);
    }
  }
    

  getFormData(): any {
    const data = {
      start_date: this.dtService.formatDateTime(this.f.start_date.value, this.f.start_time.value),
      end_date: this.dtService.formatDateTime(this.f.end_date.value, this.f.end_time.value),
      };
    return data;
  }

  
  public get f(): any {
    return this.form.controls;
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      
    });
  }

  

}
