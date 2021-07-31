import { Component, OnInit } from '@angular/core';
import { RsvpService } from 'src/app/services/rsvp/rsvp.service';

@Component({
  selector: 'app-rsvp-user',
  templateUrl: './rsvp-user.component.html',
  styleUrls: ['./rsvp-user.component.scss']
})
export class RsvpUserComponent implements OnInit {

  constructor(private rsvp: RsvpService) { }

  ngOnInit(): void {
    this.getRsvpForm();
  }

  getRsvpForm(){
    this.rsvp.getRsvp().then(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

}
