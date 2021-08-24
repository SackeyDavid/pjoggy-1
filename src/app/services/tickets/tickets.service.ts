import { EndpointService } from './../endpoints/endpoint.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private headers: HttpHeaders;
  private getTicketUrl: string;
  private hasTicketUrl: string;
  private deleteTicketUrl: string;
  private editTicketUrl: string;
  private createTicketUrtl: string;
  private getUsersOrderedTicketsUrl: string;

  constructor(private http: HttpClient, private endpoint: EndpointService) {
    this.headers = this.endpoint.headers();
    this.editTicketUrl = this.endpoint.apiHost + '/v1/edit_ticket/';
    this.getTicketUrl = this.endpoint.apiHost + '/get_events_tickets/';
    this.createTicketUrtl = this.endpoint.apiHost + '/v1/create_ticket';
    this.hasTicketUrl = this.endpoint.apiHost + '/v1/hasTicket/';
    this.deleteTicketUrl = this.endpoint.apiHost + '/v1/delete_ticket/';
    this.getUsersOrderedTicketsUrl = this.endpoint.apiHost + '/v1/get_user_ticket/';
  }

  /**
   * Creates a new ticket for an event.
   * @param ticket Ticket
   * @returns 
   */
  createTicket(ticket: any): Promise<any> {
    console.log(this.createTicketUrtl);
    return new Promise((resolve, reject) => {
      const body = {
        'event_id': ticket.eventId,
        'name': ticket.name,
        'quantity': ticket.quantity,
        'price': ticket.price,
        'sales_startdate': ticket.salesStartDate,
        'sales_enddate': ticket.salesEndDate,
        'currency': ticket.currency
      };

      console.log(body);

      this.http.post<any>(this.createTicketUrtl, JSON.stringify(body), { headers: this.headers}).subscribe(
        res => {
          console.log('create_ticket_ok: ', res);
          if (_.toLower(res.message) == 'ok') {
            resolve(res.id);
          }
          else {
            resolve(0);
          }
        },
        err => {
          console.error('create_ticket_error: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Edits an event ticket.
   * @param ticketId Ticket ID.
   * @param ticket Ticket
   * @returns 
   */ 
  editTicket(ticketId: string, ticket: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.editTicketUrl + ticketId;
      const body = {
        'name': ticket.name,
        'quantity': ticket.quantity,
        'price': ticket.price,
        'sales_startdate': ticket.salesStartDate,
        'sales_enddate': ticket.salesEndDate,
        'currency': ticket.currency
      };

      this.http.post<any>(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          console.log('edit_ticket_ok: ', res);
          if (_.toLower(res.message) == 'ok') {
            resolve(true);
          }
          else {
            resolve(false);
          }
        },
        err => {
          console.error('edit_ticket_error: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a list of tickets for an event.
   * @param eventId The event ID.
   * @returns 
   */
  getTickets(eventId: string): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      let tickets: any[] = [];
      const url = this.getTicketUrl + eventId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_tickets_ok: ', res);
          tickets = res;
          resolve(tickets);
        },
        err => {
          console.log('get_tickets_error: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Determines if an event has tickets. 
   * @param eventId Event ID.
   * @returns 
   */
  hasTickets(eventId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.hasTicketUrl + eventId;
      this.http.get<any>(url, { headers: this.headers }).subscribe(
        res => {
          console.log('has_tickets_ok:', res);
          if (_.toLower(res.message) == 'yes')
            resolve(true)
          else 
            resolve(false);
        },
        err => {
          console.log('has_tickets_error: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Deletes a ticket.
   * @param ticketId Ticket ID.
   * @returns 
   */
  deleteTicket(ticketId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.deleteTicketUrl + ticketId;
      this.http.post<any>(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('delete_ticket_ok:', res);
          if (_.toLower(res.message) == 'ok')
            resolve(true)
          else 
            resolve(false);
        },
        err =>{
          console.log('delete_ticket_error: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Get users tickets.
   * @param userID User ID.
   * @returns 
   */
   getUsersOrderedTickets(user_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.getUsersOrderedTicketsUrl + user_id;
      let tickets: any[] = [];

      this.http.get<any>(url, { headers: this.headers }).subscribe(
        res => {
          console.log('get_users_ordered_ticket_ok:', res);
          tickets = res.user_tickets;
          resolve(tickets);
        },
        err =>{
          console.log('get_users_ordered_ticket_error: ', err);
          reject(err);
        }
      );
    });
  }


  /**
   * Get users tickets next page.
   * @param userID User ID.
   * @returns 
   */
   getUserTicketsNextPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let tickets: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      // const url = this.getAllUserEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_user_tickets_next_page_ok: ', res);
          tickets = res.user_tickets;
          resolve(tickets);
        },
        err => {
          console.log('get_user_tickets_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

}
