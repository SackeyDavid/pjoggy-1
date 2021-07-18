import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-delete-event-alert',
  templateUrl: './delete-event-alert.component.html',
  styleUrls: ['./delete-event-alert.component.scss']
})
export class DeleteEventAlertComponent implements OnInit {

  id: string = '';
  errMsg: string = '';

  constructor(
    private _snackBar: MatSnackBar,
    public modalRef: MdbModalRef<DeleteEventAlertComponent>,
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
    console.log('cancel event id', this.id)
  }

  openSnackBar() {
    this._snackBar.open('Event has been successfully archived', 'x', {
      duration: 3000
    });
  }

  openErrorSnackBar() {
    this._snackBar.open('Oops, event archive failed', 'x', {
      duration: 3000
    });
  }

  deleteEvent(){
    return new Promise((resolve, reject) => {
      this.eventsService.archiveEvent(this.id).then(
        res => {
          console.log(res);
          this.openSnackBar();
          this.modalRef.close();         
          resolve(true);
          
          // TODO: reload page 
          window.open('/user_events', "_self");
        },
        err => {
          console.log(err);
          this.openErrorSnackBar();
          this.modalRef.close()
          this.errMsg = err
          reject(err);
        }
      );
    });
  }

}
