import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RsvpService } from 'src/app/services/rsvp/rsvp.service';

@Component({
  selector: 'app-rsvp-payment',
  templateUrl: './rsvp-payment.component.html',
  styleUrls: ['./rsvp-payment.component.scss']
})
export class RsvpPaymentComponent implements OnInit {

  eventData: any;
  selectedTicket = 0;

  constructor(private rsvp: RsvpService, private router: Router) { }

  ngOnInit(): void {
    this.getEventData();
  }

  getEventData(){
    this.rsvp.getCreatedEvent().then(
      res => {
        console.log(res);
        this.eventData = res;
        sessionStorage.setItem('created_event', JSON.stringify(res));

        if (res.event[0].ticketing == '0'){
          this.router.navigateByUrl('/rsvp/user');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  selectTicket(ticketId: any){
    this.selectedTicket = ticketId;
  }

}
