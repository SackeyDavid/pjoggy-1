import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events/events.service';
import { BasicInfoService } from 'src/app/services/basic-info/basic-info.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { UsersFavoritesService } from 'src/app/services/users-favorites/users-favorites.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SocialShareModalComponent } from 'src/app/components/social-share-modal/social-share-modal.component';
import { CancelEventAlertComponent } from 'src/app/components/modals/cancel-event-alert/cancel-event-alert.component';
import { EditEventAlertComponent } from 'src/app/components/modals/edit-event-alert/edit-event-alert.component';
import { DeleteEventAlertComponent } from 'src/app/components/modals/delete-event-alert/delete-event-alert.component';
import { RecoverEventAlertComponent } from 'src/app/components/modals/recover-event-alert/recover-event-alert.component';

@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss']
})
export class UserEventsComponent implements OnInit {

  userEvents: any = [];
  createdEvents: any = [];
  publishedEvents: any = [];
  archivedEvents: any = [];
  cancelledEvents: any = [];

  loading: boolean = false;
  loadIndex = 15;
  draft_loadIndex = 15;
  published_loadIndex = 15;
  cancelled_loadIndex = 15;
  archived_loadIndex = 15;

  errMsg = '';

  userFavorites: any = [];
  userID: string = '';
  user_token: string = '';
  
  users_favorite_event_id_and_fav_id: any = [];
  users_favorite_event_id_and_visibilty: any = [];
  users_favorite_event_ids: any = [];

  modalRef: any;


  constructor(
    private router: Router,
    private eventsService: EventsService, 
    private basicInfoService: BasicInfoService,
    private userFavoriteService: UsersFavoritesService,
    private modalService: MdbModalService
  ) { }

  ngOnInit() {  
    var user_token = sessionStorage.getItem('x_auth_token');
    this.user_token = ((user_token !== null? user_token: ''));
    var user_id: any =  sessionStorage.getItem('user_id');
    // user_id = JSON.parse(user_id)
    // console.log(user_token)
    this.userID = user_id;
   
    this.getUsersFavorites() 

    this.getUserEvents(0);
    this.getAllUserEvents();
    this.getUserEvents(2);
    this.getUserEvents(4);
    this.getUserEvents(3);
  }

  getAllUserEvents(): void {
    this.eventsService.getAllUserEvents().then(
      res => {
        console.log(res);
        this.userEvents = res.all_events;
        this.userEvents.data.sort(function(a: any, b:any){
          return new Date(b.start_date_time).valueOf() - new Date(a.start_date_time).valueOf();
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  getUserEvents(eventStatus: any): void {
    this.eventsService.getUserEvents(eventStatus).then(
      res => {
        console.log(res);
        if (eventStatus == 0) this.createdEvents = res;
        this.createdEvents?.data?.sort(function(a: any, b:any){
          return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf();
        });
 

        if (eventStatus == 2) this.publishedEvents = res;
        this.publishedEvents?.data?.sort(function(a: any, b:any){
          return new Date(a.start_date_time).valueOf() - new Date(b.start_date_time).valueOf();
        });


        if (eventStatus == 3) this.archivedEvents = res;
        this.archivedEvents?.data?.sort(function(a: any, b:any){
          return new Date(a.start_date_time).valueOf() - new Date(b.start_date_time).valueOf();
        });

        
        if (eventStatus == 4) this.cancelledEvents = res;
        this.cancelledEvents?.data?.sort(function(a: any, b:any){
          return new Date(a.start_date_time).valueOf() - new Date(b.start_date_time).valueOf();
        });


      },
      err => {
        console.log(err);
        return null;
      }
    );
  }

  gotoEdit(eventId: any) {
    // this.modalRef = this.modalService.open(EditEventAlertComponent, { data: { id: eventId }});
    console.log(eventId);
    this.saveSelectedEvent(eventId).then(
      ok => {
        if (ok) {
          this.router.navigateByUrl('/edit_event/basic_info');
          this.modalRef.close();
        }
      },   
    );
  }

  gotoPreview(eventId: any) {
    sessionStorage.setItem('preview_event_id', eventId);
    this.router.navigateByUrl('/event_details');
  }

  saveSelectedEvent(eventId: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.basicInfoService.getCreatedEvent(eventId).then(
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

  archiveEvent(eventId: any){
    this.modalRef = this.modalService.open(DeleteEventAlertComponent, { data: { id: eventId }});   
  }

  cancelEvent(eventId: any){
    this.modalRef = this.modalService.open(CancelEventAlertComponent, { data: { id: eventId }});
  }

  recoverEvent(eventId: any){
    this.modalRef = this.modalService.open(RecoverEventAlertComponent, { data: { id: eventId }});
    
  }

  getEventDateFormatted(date: any) {
    // return moment(date).format('ddd, MMM D, YYYY h:mm A');
    return moment(date).format('MMM d, YYYY');
  }

  
  loadMore() {
    this.loading = true
    if(this.loadIndex < this.userEvents.length) {
      this.loadIndex += 15
    }
    
    this.loading = false
  }

  loadLess() {
    this.loading = true
    if(this.loadIndex >= this.userEvents.length) {
      this.loadIndex = 15
    }
    
    this.loading = false
  }

  
  loadMoreDrafts() {
    this.loading = true
    if(this.draft_loadIndex < this.createdEvents.length) {
      this.draft_loadIndex += 15
    }
    
    this.loading = false
  }

  loadLessDrafts() {
    this.loading = true
    if(this.draft_loadIndex >= this.createdEvents.length) {
      this.draft_loadIndex = 15
    }
    
    this.loading = false
  }

  loadMoreCancelled() {
    this.loading = true
    if(this.cancelled_loadIndex < this.cancelledEvents.length) {
      this.cancelled_loadIndex += 15
    }
    
    this.loading = false
  }

  loadLessCancelled() {
    this.loading = true
    if(this.cancelled_loadIndex >= this.cancelledEvents.length) {
      this.cancelled_loadIndex = 15
    }
    
    this.loading = false
  }

  
  loadMorePublished() {
    this.loading = true
    if(this.published_loadIndex < this.publishedEvents.length) {
      this.published_loadIndex += 15
    }
    
    this.loading = false
  }

  loadLessPublished() {
    this.loading = true
    if(this.published_loadIndex >= this.publishedEvents.length) {
      this.published_loadIndex = 15
    }
    
    this.loading = false
  }

  loadMoreArchived() {
    this.loading = true
    if(this.archived_loadIndex < this.archivedEvents.length) {
      this.archived_loadIndex += 15
    }
    
    this.loading = false
  }

  loadLessArchived() {
    this.loading = true
    if(this.archived_loadIndex >= this.archivedEvents.length) {
      this.archived_loadIndex = 15
    }
    
    this.loading = false
  }

  showHideMore(event_id: any) {
    var dots = document.getElementById("dots-"+event_id) as HTMLSpanElement;
    var moreText = document.getElementById("more-"+event_id) as HTMLSpanElement;
    var btnText = document.getElementById("myBtn-"+event_id)  as HTMLSpanElement;

    if (dots?.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "See more"; 
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "See less"; 
      moreText.style.display = "inline";
    }
  }

  showHideMorePublished(event_id: any) {
    var dots = document.getElementById("published-dots-"+event_id) as HTMLSpanElement;
    var moreText = document.getElementById("published-more-"+event_id) as HTMLSpanElement;
    var btnText = document.getElementById("published-myBtn-"+event_id)  as HTMLSpanElement;
    var icons = document.getElementById("published-icons-"+event_id)  as HTMLSpanElement;

    if (dots?.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "See more"; 
      moreText.style.display = "none";
      moreText.style.height = "0";
      icons.style.display = "inline";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "See less"; 
      moreText.style.display = "inline";
      moreText.style.height = "max-content";
      icons.style.display = "none";

    }
  }

  showHideMoreDraft(event_id: any) {
    var dots = document.getElementById("draft-dots-"+event_id) as HTMLSpanElement;
    var moreText = document.getElementById("draft-more-"+event_id) as HTMLSpanElement;
    var btnText = document.getElementById("draft-myBtn-"+event_id)  as HTMLSpanElement;
    var icons = document.getElementById("draft-icons-"+event_id)  as HTMLSpanElement;

    if (dots?.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "See more"; 
      moreText.style.display = "none";
      icons.style.display = "inline";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "See less"; 
      moreText.style.display = "inline";
      icons.style.display = "none";
    }
  }

  showHideMoreCancelled(event_id: any) {
    var dots = document.getElementById("cancelled-dots-"+event_id) as HTMLSpanElement;
    var moreText = document.getElementById("cancelled-more-"+event_id) as HTMLSpanElement;
    var btnText = document.getElementById("cancelled-myBtn-"+event_id)  as HTMLSpanElement;
    var icons = document.getElementById("cancelled-icons-"+event_id)  as HTMLSpanElement;

    if (dots?.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "See more"; 
      moreText.style.display = "none";
      icons.style.display = "inline";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "See less"; 
      moreText.style.display = "inline";
      icons.style.display = "none";
    }
  }

  showHideMoreArchived(event_id: any) {
    var dots = document.getElementById("archived-dots-"+event_id) as HTMLSpanElement;
    var moreText = document.getElementById("archived-more-"+event_id) as HTMLSpanElement;
    var btnText = document.getElementById("archived-myBtn-"+event_id)  as HTMLSpanElement;
    var icons = document.getElementById("archived-icons-"+event_id)  as HTMLSpanElement;

    if (dots?.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "See more"; 
      moreText.style.display = "none";
      icons.style.display = "inline";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "See less"; 
      moreText.style.display = "inline";
      icons.style.display = "none";
    }
  }

  openAllEventsNextPage(url: string) {
    window.scrollTo(0, 0);

    this.eventsService.getAllUsersEventsNextPage(url).then(
      res => {
        console.log(res);
        this.userEvents = res.all_events;
        this.userEvents.data.sort(function(a: any, b:any){
          return new Date(b.start_date_time).valueOf() - new Date(a.start_date_time).valueOf();
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  openDraftedEventsNextPage(url: string) {
    window.scrollTo(0, 0);

    this.eventsService.getDraftedUsersEventsNextPage(url).then(
      res => {
        console.log(res);
        this.createdEvents = res;
        this.createdEvents.data.sort(function(a: any, b:any){
          return new Date(b.start_date_time).valueOf() - new Date(a.start_date_time).valueOf();
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  openPublishedEventsNextPage(url: string) {
    window.scrollTo(0, 0);

    this.eventsService.getPublishedUsersEventsNextPage(url).then(
      res => {
        console.log(res);
        this.publishedEvents = res;
        this.publishedEvents.data.sort(function(a: any, b:any){
          return new Date(b.start_date_time).valueOf() - new Date(a.start_date_time).valueOf();
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  openArchivedEventsNextPage(url: string) {
    window.scrollTo(0, 0);

    this.eventsService.getArchivedUsersEventsNextPage(url).then(
      res => {
        console.log(res);
        this.archivedEvents = res;
        this.archivedEvents.data.sort(function(a: any, b:any){
          return new Date(b.start_date_time).valueOf() - new Date(a.start_date_time).valueOf();
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  openCancelledEventsNextPage(url: string) {
    window.scrollTo(0, 0);

    this.eventsService.getCancelledUsersEventsNextPage(url).then(
      res => {
        console.log(res);
        this.cancelledEvents = res;
        this.cancelledEvents.data.sort(function(a: any, b:any){
          return new Date(b.start_date_time).valueOf() - new Date(a.start_date_time).valueOf();
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  hasBeenAddedToFavorites(event_id: any) {
    return this.users_favorite_event_ids.includes(event_id)
  }

  saveEventAsFavorite(event_id: any): void {
    // console.log(this.user_token )
    if(this.user_token == '') {
      this.router.navigateByUrl('/login')
      
    } else {

      // var favorite_buttons: HTMLCollection = document.getElementsByClassName('favorite-'+event_id);
      var favorite_buttons = document.getElementsByClassName('favorite-'+event_id);

      
      for (let item of favorite_buttons) {
        item.setAttribute('style', 'display: block; fill: rgba(255, 101, 80, 0.4); height: 24px; width: 24px; stroke: rgb(255, 255, 255); stroke-width: 2px; overflow: visible;'); 
        // item.style.fill = 'red';  // This is probably what you need for your SVG items
      }
      
      // document.getElementById('favorite-'+event_id)?.style.setProperty('fill', 'rgba(255, 101, 80, 0.4)');
      
      this.userFavoriteService.addFavoriteEvent(event_id, this.userID).then(
        res => {
          if (res) {
            console.log(res);
            
            // reload data so view reflects changes
            this.getUsersFavorites();
            // this.getEventsInSixHrs();
            // this.getPopularEvents();
            // this.getNewEvents();
            // this.getAllEvents();

          }
          else {
            console.log('didnt add to favorites');
          }
        },
        err => {
          console.log(err);
          // this.isLoading = false;
        }
      );
      
    }
    
  }

  removeEventFromFavorites(event_id: any): void { 
    console.log(event_id)
    
    let favorite_id: any = ''

    for (let i = 0; i < this.users_favorite_event_id_and_fav_id.length; i++) {

      if(this.users_favorite_event_id_and_fav_id[i].event_id == event_id) {
          favorite_id = this.users_favorite_event_id_and_fav_id[i].fav_id

          var favorite_buttons = document.getElementsByClassName('favorite-'+event_id);

      
          for (let item of favorite_buttons) {
            item.setAttribute('style', 'display: block; fill: rgba(0, 0, 0, 0.5); height: 24px; width: 24px; stroke: rgb(255, 255, 255); stroke-width: 2px; overflow: visible;'); 
            // item.style.fill = 'red';  // This is probably what you need for your SVG items
          }
          
      }

      // TODO: low priority; remove duplicates from users_favorite_event_ids
      // var unique_users_favorite_event_ids = [];

      // unique_users_favorite_event_ids = this.users_favorite_event_ids.filter(function(item: any, pos: any) {
      //   return this.users_favorite_event_ids.indexOf(item) == pos;
      // })

      var index = this.users_favorite_event_ids.indexOf(event_id);
      if (index > -1) {
        this.users_favorite_event_ids.splice(index, 1);
      }

    }

      this.userFavoriteService.removeEventFromFavorite(favorite_id).then(
        res => {
          if (res) {
            console.log(res); 

            // reload data so view reflects
            this.getUsersFavorites();
            // this.getEventsInSixHrs();
            // this.getPopularEvents();
            // this.getNewEvents();
            // this.getAllEvents();
            
          }
          else {
            console.log('didnt remove to favorites');
          }
        },
        err => {
          console.log(err);
          // this.isLoading = false;
        }
      );
    
  }

  
  getUsersFavorites (){

    if(this.userID !== '') {
      this.userFavoriteService.getUserFavorites(this.userID).then(
        res => {
          this.userFavorites = res.event;

          for (let i = 0; i < this.userFavorites.data.length; i++) {
            this.users_favorite_event_ids.push(this.userFavorites.data[i].id)
            this.users_favorite_event_id_and_fav_id.push({event_id: this.userFavorites.data[i].id, fav_id: this.userFavorites.data[i].fav_id })
            this.users_favorite_event_id_and_visibilty.push({event_id: this.userFavorites.data[i].id, visibility: this.hasBeenAddedToFavorites(this.userFavorites.data[i].id) })
            
            
          }

          // console.log(this.users_favorite_event_id_and_fav_id)
          // console.log(this.users_favorite_event_id_and_visibilty)
        },
        err => {
          console.log(err);
        }
      );

    }  
  }

  getUsersFavoritesAfterNextPageLoad (){

    if(this.userID !== '') {
      
          for (let i = 0; i < this.userFavorites.data.length; i++) {
            this.users_favorite_event_ids.push(this.userFavorites.data[i].id)
            this.users_favorite_event_id_and_fav_id.push({event_id: this.userFavorites.data[i].id, fav_id: this.userFavorites.data[i].fav_id })
            this.users_favorite_event_id_and_visibilty.push({event_id: this.userFavorites.data[i].id, visibility: this.hasBeenAddedToFavorites(this.userFavorites.data[i].id) })
            
            
          }

          // console.log(this.users_favorite_event_id_and_fav_id)
          // console.log(this.users_favorite_event_id_and_visibilty)
    }
  }

  getEventStartDateFormatted(date: any) {
    return moment(date).format('ddd, MMM D, YYYY h:mm A');
  }

  
  getTicketSalesStatus(ticket_sales_end_date: string) {
    if (ticket_sales_end_date == null) return 1;

    var ticket_end_date = ticket_sales_end_date.split(' ')[0];
    var ticket_end_time = ticket_sales_end_date.split(' ')[1];
    // console.log(ticket_end_date, ticket_end_time);

    let date = new Date();
    date.setHours(0,0,0,0);
    let today = date.valueOf();
    // let sd = Date.parse(this.f.start_date.value);
    let ed = Date.parse(ticket_end_date);    
    let now = new Date().getTime();
    // let st = new Date(this.f.start_time.value).getTime();
    let et = new Date(ticket_end_time).getTime();

    
    if (ed > today && et > now) {
      return 0;
    } else {
      return 1;
    }
  }

  openModal(url: string) {
    this.modalRef = this.modalService.open(SocialShareModalComponent, { data: { url: url }});
  }

  
  getEventDateWithoutTime(date: string) {
    return moment(date).format('YYYY-MM-DD');
  }

  getEventEndDateFormatted(date: any) {
    return moment(date).format('h:mm A');

  }



}
