import { EndpointService } from './../endpoints/endpoint.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class RsvpService {

  private headers: HttpHeaders;
  getEventUrl: string;
  getRsvpUrl: string;
  makeCardPaymentUrl: string;
  makeMobilePaymentUrl: string;
  sendRsvpUrl: string;
  getAttendeesUrl: string;
  cancelRsvpUrl: string;

  constructor(private http: HttpClient, private endpoint: EndpointService) {
    this.headers = this.endpoint.headers();
    this.getEventUrl = this.endpoint.apiHost + '/get_event_data/';
    this.getRsvpUrl = this.endpoint.apiHost + '/get_rsvp_form/';
    this.makeCardPaymentUrl = this.endpoint.apiHost + '/v1/rsvp_card_payment';
    this.makeMobilePaymentUrl = this.endpoint.apiHost + '/v1/rsvp_momo_payment';
    this.sendRsvpUrl = this.endpoint.apiHost + '/v1/rsvp';
    this.getAttendeesUrl = this.endpoint.apiHost + '/v1/get_attendees/';
    this.cancelRsvpUrl = this.endpoint.apiHost + '/v1/cancel_rsvp/';

  }

  getCreatedEvent(): Promise<any> {
    return new Promise((resolve, reject) => {
      let event;
      const url = this.getEventUrl + sessionStorage.getItem('preview_event_id');
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_created_event: ', res);
          event = res;
          resolve(event);
        },
        err => {
          console.log('get_created_event_error: ', err);
          reject(err);
        }
      );
    });
  }

  getRsvp(): Promise<any> {
    return new Promise((resolve, reject) => {
      let event;
      const url = this.getRsvpUrl + sessionStorage.getItem('preview_event_id');
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_rsvp: ', res);
          event = res;
          resolve(event);
        },
        err => {
          console.log('get_rsvp_error: ', err);
          reject(err);
        }
      );
    });
  }

  makeCardPayment(cardData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.makeCardPaymentUrl;
      this.http.post<any>(url, cardData, { headers: this.headers}).subscribe(
        res => {
          console.log('make_card_payment_ok: ', res);
          resolve(res);
        },
        err => {
          console.log('make_card_payment_err: ', err);
          reject(err);
        }
      );
    });
  }

  makeMobilePayment(mobileData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.makeMobilePaymentUrl;
      this.http.post<any>(url, mobileData, { headers: this.headers}).subscribe(
        res => {
          console.log('make_mobile_money_payment_ok: ', res);
          resolve(res);
        },
        err => {
          console.log('make_mobile_money_payment_err: ', err);
          reject(err);
        }
      );
    });
  }

  sendRsvp(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.sendRsvpUrl;
      this.http.post<any>(url, data, { headers: this.headers}).subscribe(
        res => {
          console.log('rsvp_ok: ', res);
          resolve(res);
        },
        err => {
          console.log('rsvp_err: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a list of attendees for an event.
   * @param eventId The event ID.
   * @returns 
   */
  getEventAttendees(eventId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let event;
      const url = this.getAttendeesUrl + eventId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_attendees: ', res);
          event = res;
          resolve(event.attendees);
        },
        err => {
          console.log('get_attendees_error: ', err);
          reject(err);
        }
      );
    });
  }

}
