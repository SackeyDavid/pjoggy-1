import { EndpointService } from './../endpoints/endpoint.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private headers: HttpHeaders;
  archiveEventUrl: string;
  cancelEventUrl: string;
  recoverEventUrl: string;
  getUserEventsUrl: string;
  getAllUserEventsUrl: string;
  getCategoriesUrl: string;
  getCategoryEventsUrl: string;
  getEventsByTypeUrl: string
  getAllEventsUrl: string;
  getTodaysEventsUrl: string;
  getEventsByHostingUrl: string;
  getEventsInSixHoursUrl: string; // upcoming events
  getEventsInSixHoursPageUrl: string; // upcoming events
  getPopularEventsUrl: string;
  getPopularEventsPageUrl: string;
  getNewEventsUrl: string;
  getNewEventsPageUrl: string;
  getEventsHappeningNowUrl: string;
  getEventCreatorsPastEventsUrl: string;
  getEventCreatorsOngoingEventsUrl: string;
  postPoneEventUrl: string;

  
  constructor(private http: HttpClient, private endpoint: EndpointService) {
    this.headers = this.endpoint.headers();
    this.archiveEventUrl = this.endpoint.apiHost + '/v1/archive_event/';
    this.cancelEventUrl = this.endpoint.apiHost + '/v1/cancel_event/';
    this.recoverEventUrl = this.endpoint.apiHost + '/v1/recover_event/';
    this.getUserEventsUrl = this.endpoint.apiHost + '/v1/get_user_events_by_status/';
    this.getCategoriesUrl = this.endpoint.apiHost + '/view_categories';
    this.getAllUserEventsUrl = this.endpoint.apiHost + '/v1/get_all_user_events/';
    this.getCategoryEventsUrl = this.endpoint.apiHost + '/get_events_by_category/';
    this.getEventsByTypeUrl = this.endpoint.apiHost + '/get_events_by_type/';
    this.getAllEventsUrl = this.endpoint.apiHost + '/get_events_by_type/1';
    this.getTodaysEventsUrl =  this.endpoint.apiHost + '/get_todays_events';
    this.getEventsByHostingUrl =  this.endpoint.apiHost + '/get_events_by_hosting/';
    this.getEventsInSixHoursUrl = this.endpoint.apiHost + '/events_six_hours';
    this.getEventsInSixHoursPageUrl = this.endpoint.apiHost + '/events_six_hours?page=';
    this.getPopularEventsUrl = this.endpoint.apiHost + '/get_popular_events';
    this.getPopularEventsPageUrl = this.endpoint.apiHost + '/get_popular_events?page=';
    this.getNewEventsUrl = this.endpoint.apiHost + '/get_new_events';
    this.getNewEventsPageUrl = this.endpoint.apiHost + '/get_new_events?page=';
    this.getEventsHappeningNowUrl = this.endpoint.apiHost + '/events_happening_now';
    this.getEventCreatorsPastEventsUrl = this.endpoint.apiHost + '/v1/get_user_past_events/';
    this.getEventCreatorsOngoingEventsUrl = this.endpoint.apiHost + '/v1/get_user_ongoing_events/';
    this.postPoneEventUrl = this.endpoint.apiHost + '/v1/postpone_event/';
  }

  archiveEvent(eventId: any): Promise<any> {    
    const url = this.archiveEventUrl + eventId;
    return new Promise((resolve, reject) => {     
      this.http.post<any>(url, null, { headers: this.headers}).subscribe(
        res => {
          console.log('archive_event_ok: ', res);
          if (_.toLower(res.message) == 'ok') {
            resolve(res.id);            
          }
          else {
            resolve(0);
          }
        },
        err => {
          console.error('archive_event_error: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Postpone an event.
   * @param eventID Event ID.
   * @param start_date Date
   * @param end_date Date
   * @returns 
   */ 
   postPoneEvent(eventID: any, date: any): Promise<any> {
    // console.log(this.createBasicUrl);
    const url = this.postPoneEventUrl + eventID
    return new Promise((resolve, reject) => {
      const body = {
        'start_date': date.start_date,        
        'end_date': date.end_date,        
      };

      console.log(body);

      this.http.post<any>(url, JSON.stringify(body), { headers: this.headers}).subscribe(
        res => {
          console.log('postpone_event_ok: ', res);
          if (_.toLower(res.message) == 'ok') {
            resolve(true);            
          }
          else {
            resolve(false);
          }
        },
        err => {
          console.error('postpone_event_error: ', err);
          reject(err);
        }
      );
    });
  }

  // postPoneEvent(eventId: any): Promise<any> {    
  //   const url = this.postPoneEventUrl + eventId;
  //   return new Promise((resolve, reject) => {     
  //     this.http.post<any>(url, null, { headers: this.headers}).subscribe(
  //       res => {
  //         console.log('postpont_event_ok: ', res);
  //         if (_.toLower(res.message) == 'ok') {
  //           resolve(res.id);            
  //         }
  //         else {
  //           resolve(0);
  //         }
  //       },
  //       err => {
  //         console.error('postpone_event_error: ', err);
  //         reject(err);
  //       }
  //     );
  //   });
  // }

  cancelEvent(eventId: any): Promise<any> {    
    const url = this.cancelEventUrl + eventId;
    return new Promise((resolve, reject) => {     
      this.http.post<any>(url, null, { headers: this.headers}).subscribe(
        res => {
          console.log('cancel_event_ok: ', res);
          if (_.toLower(res.message) == 'ok') {
            resolve(true);            
          }
          else {
            resolve(0);
          }
        },
        err => {
          console.error('cancel_event_error: ', err);
          reject(err);
        }
      );
    });
  }

  recoverEvent(eventId: any): Promise<any> {    
    const url = this.recoverEventUrl + eventId;
    return new Promise((resolve, reject) => {     
      this.http.post<any>(url, null, { headers: this.headers}).subscribe(
        res => {
          console.log('recovr_event_ok: ', res);
          if (_.toLower(res.message) == 'ok') {
            resolve(res.id);            
          }
          else {
            resolve(0);
          }
        },
        err => {
          console.error('recover_event_error: ', err);
          reject(err);
        }
      );
    });
  }

  getUserEvents(status: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      let actual_event_data: any[] = [];
      let next_page_event_data: any[] = [];
      let page_number = 1;
      let last_page = 1;

      // var userId = sessionStorage.getItem('events_user_id');
      var userId = sessionStorage.getItem('user_id');

     
      let url = this.getUserEventsUrl + userId + '/' + status + '?page=' + page_number;

      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          // console.log('get_user_events_ok: ', res);
          events = res;
          actual_event_data = res.all_events;
          last_page = res.all_events.last_page;
          console.log(last_page)

          console.log('get_user_events_' + status +'_ok: ', actual_event_data);
          resolve(actual_event_data);

        },
        err => {
          console.log('get_user_events_error: ', err);
          reject(err);
        }
      );
    });
  }

  getAllUserEvents(): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      var userId = sessionStorage.getItem('events_user_id');
      const url = this.getAllUserEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_all_events_ok: ', res);
          events = res;
          resolve(events);
        },
        err => {
          console.log('get_all_events_error: ', err);
          reject(err);
        }
      );
    });
  }

  getAllEventCreatorsEvents(eUserId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      const url = this.getAllUserEventsUrl + eUserId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_event_creators_all_events_ok: ', res);
          events = res;
          resolve(events);
        },
        err => {
          console.log('get_event_creators_all_events_error: ', err);
          reject(err);
        }
      );
    });
  }

  getAllUsersEventsNextPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      // const url = this.getAllUserEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_users_all_events_next_page_ok: ', res);
          events = res;
          resolve(events);
        },
        err => {
          console.log('get_users_all_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getDraftedUsersEventsNextPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      // const url = this.getAllUserEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_drafted_events_next_page_ok: ', res);
          events = res.all_events;
          resolve(events);
        },
        err => {
          console.log('get_drafted_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getPublishedUsersEventsNextPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      // const url = this.getAllUserEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_published_events_next_page_ok: ', res);
          events = res.all_events;
          resolve(events);
        },
        err => {
          console.log('get_published_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getCancelledUsersEventsNextPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      // const url = this.getAllUserEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_cancelled_events_next_page_ok: ', res);
          events = res.all_events;
          resolve(events);
        },
        err => {
          console.log('get_cancelled_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getArchivedUsersEventsNextPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      // const url = this.getAllUserEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_archived_events_next_page_ok: ', res);
          events = res.all_events;
          resolve(events);
        },
        err => {
          console.log('get_archived_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getPastUsersEventsNextPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      // const url = this.getAllUserEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_past_events_next_page_ok: ', res);
          events = res.all_events;
          resolve(events);
        },
        err => {
          console.log('get_past_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getOngoingUsersEventsNextPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      // const url = this.getAllUserEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_ongoing_events_next_page_ok: ', res);
          events = res.all_events;
          resolve(events);
        },
        err => {
          console.log('get_ongoing_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getCategoryEventsNextPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      // const url = this.getAllUserEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_category_events_next_page_ok: ', res);
          events = res;
          resolve(events);
        },
        err => {
          console.log('get_category_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }
  

  getCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      let categories: any[] = [];
      const url = this.getCategoriesUrl;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_categories_ok: ', res);
          categories = res;
          resolve(categories);
        },
        err => {
          console.log('get_categories_error: ', err);
          reject(err);
        }
      );
    });
  }

  getCategoryEvents(category: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      const url = this.getCategoryEventsUrl + category;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_category_events_ok: ', res);
          events = res;
          resolve(events);
        },
        err => {
          console.log('get_all_category_error: ', err);
          reject(err);
        }
      );
    });
  }

  getEventsByType(category: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      const url = this.getEventsByTypeUrl + category;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_events_by_type_ok: ', res);
          events = res;
          resolve(events);
        },
        err => {
          console.log('get_events_by_type_error: ', err);
          reject(err);
        }
      );
    });
  }


  getAllEvents(): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      this.http.get<any>(this.getAllEventsUrl, { headers: this.headers}).subscribe(
        res => {
          console.log('get_all_events_ok: ', res);
          events = res;
          resolve(events);
        },
        err => {
          console.log('get_events_by_type_error: ', err);
          reject(err);
        }
      );
    });
  }

  getTodaysEvents(): Promise<any> {
    return new Promise((resolve, reject) => {
      let todays_events: any[] = [];
      const url = this.getTodaysEventsUrl;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_today_events_ok: ', res);
          todays_events = res;
          resolve(todays_events);
        },
        err => {
          console.log('get_todays_events_error: ', err);
          reject(err);
        }
      );
    });
  }

  getEventsByHosting(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events_by_hosting: any[] = [];
      const url = this.getEventsByHostingUrl + id;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_events_by_hosting_ok_', id, ': ', res);
          events_by_hosting = res;
          resolve(events_by_hosting);
        },
        err => {
          console.log('get_events_by_hosting_error_', id, ': ', err);
          reject(err);
        }
      );
    });
  }

  getEventsInSixHours(): Promise<any> {
    return new Promise((resolve, reject) => {
      let events_in_six_hrs: any[] = [];
      const url = this.getEventsInSixHoursUrl;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_events_in_six_hrs_ok: ', res);
          events_in_six_hrs = res;
          resolve(events_in_six_hrs);
        },
        err => {
          console.log('get_events_in_six_hrs_error: ', err);
          reject(err);
        }
      );
    });
  }

  getEventsInSixHoursNextPage(url: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let events_in_six_hrs: any[] = [];
      // const url = this.getEventsInSixHoursPageUrl + page;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_events_in_six_hrs_next_page_ok: ', res);
          events_in_six_hrs = res;
          resolve(events_in_six_hrs);
        },
        err => {
          console.log('get_events_in_six_hrs_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getPopularEvents(): Promise<any> {
    return new Promise((resolve, reject) => {
      let popular_events: any[] = [];
      const url = this.getPopularEventsUrl;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_popular_events_ok: ', res);
          popular_events = res;
          resolve(popular_events);
        },
        err => {
          console.log('get_popular_events_error: ', err);
          reject(err);
        }
      );
    });
  }

  getPopularEventsPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let popular_events: any[] = [];
      // const url = this.getPopularEventsPageUrl + page;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_popular_events_next_page_ok: ', res);
          popular_events = res;
          resolve(popular_events);
        },
        err => {
          console.log('get_popular_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getNewEvents(): Promise<any> {
    return new Promise((resolve, reject) => {
      let new_events: any[] = [];
      const url = this.getNewEventsUrl;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_new_events_ok: ', res);
          new_events = res;
          resolve(new_events);
        },
        err => {
          console.log('get_new_events_error: ', err);
          reject(err);
        }
      );
    });
  }

  getNewEventsPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let new_events: any[] = [];
      // const url = this.getNewEventsPageUrl + page;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_new_events_next_page_ok: ', res);
          new_events = res;
          resolve(new_events);
        },
        err => {
          console.log('get_new_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getFavoritesEventsNextPage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let fav_events: any[] = [];
      // const url = this.getNewEventsPageUrl + page;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_favorite_events_next_page_ok: ', res);
          fav_events = res;
          resolve(fav_events);
        },
        err => {
          console.log('get_favorite_events_next_page_error: ', err);
          reject(err);
        }
      );
    });
  }

  getEventsHappeningNow(): Promise<any> {
    return new Promise((resolve, reject) => {
      let events_happening_now: any[] = [];
      const url = this.getEventsHappeningNowUrl;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_events_happening_now_ok: ', res);
          events_happening_now = res;
          resolve(events_happening_now);
        },
        err => {
          console.log('get_events_happening_now_error: ', err);
          reject(err);
        }
      );
    });
  }

  getEventCreatorsPastEvents(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      const url = this.getEventCreatorsPastEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_event_creators_past_events: ', res);
          events = res.all_events;
          resolve(events);
        },
        err => {
          console.log('get_event_creators_past_events: ', err);
          reject(err);
        }
      );
    });
  }

  getEventCreatorsOngoingEvents(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let events: any[] = [];
      // var userId = sessionStorage.getItem('events_user_id');
      const url = this.getEventCreatorsOngoingEventsUrl + userId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_event_creators_ongoing_events: ', res);
          events = res.all_events;
          resolve(events);
        },
        err => {
          console.log('get_event_creators_ongoing_events: ', err);
          reject(err);
        }
      );
    });
  }


   

}











































          // for (let i = 1; i <= last_page; i++) {  
          //   url = this.getUserEventsUrl + userId + '/' + status + '?page=' + page_number++;

          //   this.http.get<any>(url, { headers: this.headers}).subscribe(
          //     res => {

          //       // console.log('get_user_events_page_' + page_number + '_ok: ', res);
          //       next_page_event_data = res.all_events.data;
          //       Array.prototype.push.apply(actual_event_data,next_page_event_data); 

          //     },
          //       err => {
          //         console.log('get_user_events_page_' + i + 'error: ', err);
          //         reject(err);
          //       }
          //     );
          //   // const element = array[i];

            
          // }

          // actual_event_data = actual_event_data.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
          // let event_data: any[] = []; 
          // actual_event_data.map(x => event_data.filter(a => a.id == x.id).length > 0 ? null : event_data.push(x));
