import { EndpointService } from './../endpoints/endpoint.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  headers: HttpHeaders;
  searchUrl: string;

  constructor(private http: HttpClient, private endpoint: EndpointService) {
    this.headers = this.endpoint.headers();
    this.searchUrl = this.endpoint.apiHost + '/search_event/';
  }

  searchEvent(): Promise<any> {
    var url = this.searchUrl + sessionStorage.getItem('search_query');
    return new Promise((resolve, reject) => {
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('search_event_ok: ', res);
          resolve(res);
        },
        err => {
          console.error('search_event_error: ', err);
          reject(err);
        }
      );
    });
  }

  searchEventsPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let search_events: any[] = [];
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_search_events_next_page_ok: ', res);
          search_events = res;
          resolve(search_events);
        },
        err => {
          console.log('get_search_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }


  liveSearch(searchword: string): Promise<any> {
    var url = this.searchUrl + searchword;
    return new Promise((resolve, reject) => {
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('live_search_ok: ', res);
          resolve(res);
        },
        err => {
          console.error('live_search_error: ', err);
          reject(err);
        }
      );
    });
  }

}
