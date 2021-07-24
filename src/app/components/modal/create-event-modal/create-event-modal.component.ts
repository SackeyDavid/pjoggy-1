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

  
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription: any;

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
    timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes((((timeToReturn.getMinutes() + 7.5)/15 | 0) * 15) %60 );
    timeToReturn.setHours(((((timeToReturn.getMinutes() / 105) + .5) | 0) + timeToReturn.getHours()) %24 );
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

}
