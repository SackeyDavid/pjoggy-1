import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { BasicInfoService } from 'src/app/services/basic-info/basic-info.service';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-edit-event-alert',
  templateUrl: './edit-event-alert.component.html',
  styleUrls: ['./edit-event-alert.component.scss']
})
export class EditEventAlertComponent implements OnInit {
  id: string = '';
  errMsg: string = '';

  constructor(
    private _snackBar: MatSnackBar,
    public modalRef: MdbModalRef<EditEventAlertComponent>,
    private router: Router,
    private basicInfoService: BasicInfoService
  ) { }

  ngOnInit(): void {
    console.log('cancel event id', this.id)
  }

  openSnackBar() {
    this._snackBar.open('redirecting...', 'x', {
      duration: 700
    });
  }

  gotoEdit() {
    this.openSnackBar();
    this.saveSelectedEvent().then(
      ok => {
        if (ok) {
          this.router.navigateByUrl('/edit_event/basic_info');
          this.modalRef.close();
        }
      },   
    );
  }

  saveSelectedEvent(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.basicInfoService.getCreatedEvent(this.id).then(
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
