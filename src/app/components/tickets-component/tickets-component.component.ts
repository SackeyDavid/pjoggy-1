import { Component, OnInit } from '@angular/core';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import moment from 'moment';
import { UserAccountService } from 'src/app/services/user-account/user-account.service';

@Component({
  selector: 'app-tickets-component',
  templateUrl: './tickets-component.component.html',
  styleUrls: ['./tickets-component.component.scss']
})
export class TicketsComponentComponent implements OnInit {

  
  userID: any;
  usersTickets: any = [];

  currentUser: any;
  imgSrc: any;

  constructor(
    private ticketsService: TicketsService, 
    private userAccountsService: UserAccountService, 
    ) { }

  ngOnInit(): void {
    var data: any =  sessionStorage.getItem('x_auth_token')
    var user_id: any =  sessionStorage.getItem('user_id')
    this.userID = user_id;
    if (this.userID) this.getUsersTickets();

    this.getUser();
  }
  
  getUsersTickets(): void {
    this.ticketsService.getUsersOrderedTickets(this.userID).then(
      res => {
        console.log(res);
        this.usersTickets = res;
        this.usersTickets.data.sort(function(a: any, b:any){
          return new Date(b.ticket_reserved_at).valueOf() - new Date(a.ticket_reserved_at).valueOf();
        });
      },
      err => {
        console.log(err);
      }
    );
  }


  getEventDateWithoutTime(date: string) {
    return moment(date).format('YYYY-MM-DD');
  }

  getEventEndDateFormatted(date: any) {
    return moment(date).format('h:mm A');

  }

  getEventDateFormatted(date: any) {
    // return moment(date).format('ddd, MMM D, YYYY h:mm A');
    return moment(date).format('MMM d, YYYY');
  }


  getEventStartDateFormatted(date: any) {
    return moment(date).format('ddd, D MMM YY');
  }

  getEventStartDateFormattedOnlyTime(date: any) {
    return moment(date).format('h:mm A');
  }

  getEventDateWithTime(date: any) {
    return moment(date).format('ddd, MMM D, h:mm A');

  }


  getUser(): void {
    this.userAccountsService.getCurrentUser().then(
      res => {
        console.log(res);
        this.currentUser = res;

        if (res.profile) {
          this.imgSrc = 'http://events369.logitall.biz/storage/profile/' + res.profile
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  openAccountsPage() {
    window.open('/account/profile', '_blank');
  }

  openUsersTicketsNextPage(url: string) {
    window.scrollTo(0, 0);

    this.ticketsService.getUserTicketsNextPage(url).then(
      res => {
        console.log(res);
        this.usersTickets = res;
        this.usersTickets.data.sort(function(a: any, b:any){
          return new Date(b.ticket_reserved_at).valueOf() - new Date(a.ticket_reserved_at).valueOf();
        });
      },
      err => {
        console.log(err);
      }
    );
  }


}
