import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";


@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss']
})
export class CreateEventModalComponent implements OnInit {

  selected: Date | null | undefined = new Date();
  eventEndDate: Date | null | undefined = new Date();
  dateTimeClicked: boolean = false;
  startDateClicked: boolean = false;
  endDateClicked: boolean = false;
  startDate = new Date();
  
  time = new Date();
  rxStartTime = new Date();
  rxEndTime = new Date();
  intervalId: any;
  subscription: any;
  url: string = '';

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
    } else {
      this.endDateClicked = true;
      this.startDateClicked = false;
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
}
