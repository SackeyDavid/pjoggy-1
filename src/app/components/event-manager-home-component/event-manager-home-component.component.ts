import { ElementRef, Inject } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { CreateEventModalComponent } from '../modal/create-event-modal/create-event-modal.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { EventsService } from 'src/app/services/events/events.service';
import { BasicInfoService } from 'src/app/services/basic-info/basic-info.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { UsersFavoritesService } from 'src/app/services/users-favorites/users-favorites.service';
import { SocialShareModalComponent } from 'src/app/components/social-share-modal/social-share-modal.component';
import { CancelEventAlertComponent } from 'src/app/components/modals/cancel-event-alert/cancel-event-alert.component';
import { EditEventAlertComponent } from 'src/app/components/modals/edit-event-alert/edit-event-alert.component';
import { DeleteEventAlertComponent } from 'src/app/components/modals/delete-event-alert/delete-event-alert.component';
import { RecoverEventAlertComponent } from 'src/app/components/modals/recover-event-alert/recover-event-alert.component';
import { PostponeEventAlertComponent } from 'src/app/components/modals/postpone-event-alert/postpone-event-alert.component';
import { UserAccountService } from 'src/app/services/user-account/user-account.service';
import { DOCUMENT } from '@angular/common';
import { EndpointService } from 'src/app/services/endpoints/endpoint.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import _ from 'lodash';


@Component({
  selector: 'app-event-manager-home-component',
  templateUrl: './event-manager-home-component.component.html',
  styleUrls: ['./event-manager-home-component.component.scss']
})
export class EventManagerHomeComponentComponent implements OnInit {

  
  userAuthenticated: boolean = false;  
  searchQuery: string = '';
  imgSrc: string = '';
  currentUser: any;
  live_search_results: any;
  userID: any;

  userFavorites: any = [];


  darkMode: boolean = false;

  bannerAdsData: any = [];
  eventsNow: any = [];
  
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription: any;

  userEvents: any = [];
  createdEvents: any = [];
  publishedEvents: any = [];
  archivedEvents: any = [];
  cancelledEvents: any = [];
  pastEvents: any = [];
  ongoingEvents: any = [];

  loading: boolean = false;
  loadIndex = 15;
  draft_loadIndex = 15;
  published_loadIndex = 15;
  cancelled_loadIndex = 15;
  archived_loadIndex = 15;

  errMsg = '';

  user_token: string = '';
  
  users_favorite_event_id_and_fav_id: any = [];
  users_favorite_event_id_and_visibilty: any = [];
  users_favorite_event_ids: any = [];

  modalRef: any;

  currentScrollPosition: number = 0;
  scrollAmount: number = 120;

  sCont: any;
  hScroll: any;
  btnScrollLeft: any;
  btnScrollRight: any;





  constructor(
    private elementRef: ElementRef,    
    private router: Router,
    private eventsService: EventsService, 
    private basicInfoService: BasicInfoService,
    private userFavoriteService: UsersFavoritesService,
    private modalService: MdbModalService,
    private userAccountsService: UserAccountService,
    @Inject(DOCUMENT) private document: Document,
    private endpoint: EndpointService,
    private http: HttpClient,
    private _snackBar: MatSnackBar, 
  
  ) { 

  }

  ngAfterViewInit() {
    
    this.elementRef.nativeElement.querySelector('.sidebar')
                                  .addEventListener('click', this.onClick.bind(this));
    
    document.querySelector(".sidebar")?.classList.toggle("close");

    
    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".bx-menu");
    // console.log(sidebarBtn);
    sidebarBtn!.addEventListener("click", ()=>{
      sidebar!.classList.toggle("close");
    });

    this.sCont =  this.elementRef.nativeElement.querySelector("#pills-tab");
    this.hScroll = this.elementRef.nativeElement.querySelector("#horizontal-scroll");
    this.btnScrollLeft =  this.elementRef.nativeElement.querySelector('#btn-scroll-left');
    this.btnScrollRight =  this.elementRef.nativeElement.querySelector('#btn-scroll-right');

    this.btnScrollLeft!.style.opacity = "0";

    



  }

  menuBtnChange() {
    if(document.querySelector(".sidebar")?.classList.contains("open")){
      document.querySelector(".closeBtn")?.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
    }else {
      document.querySelector(".closeBtn")?.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
    }
  }

  onClick(event: any) {
    document.querySelector(".sidebar")?.classList.toggle("open");
    this.menuBtnChange();//calling the function(optional)
  }

  ngOnInit(): void {   
    this.checkIfUserAuthenticated();
    this.getUser();
    this.getUsersFavorites();
    // this.initForm();
    let sessionQuery = sessionStorage.getItem('search_query');
    sessionQuery ? this.searchQuery = sessionQuery : this.searchQuery = '';

    // this.getBannerAds();
    // this.getEventsHappeningNow();

    // setInterval(this.slideItems, 15000);
    
    this.darkMode = ((localStorage.getItem('theme') == 'dark') ? true : false);
    if(this.darkMode) this.toggleDarkMode();

    // this.openEventCreate(); 
    // Using Basic Interval

    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Using RxJS Timer
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = time;
      });

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
      this.getEventCreatorsPastEvents();
      this.getEventCreatorsOngoingEvents();


  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  checkIfUserAuthenticated() {
    var data: any =  sessionStorage.getItem('x_auth_token')
    var user_id: any =  sessionStorage.getItem('user_id')
    this.userID = user_id;
   

    this.userAuthenticated = ((data != null)? true : false)
    console.log('user authenticated: ', this.userAuthenticated)
  }


  getUser(): void {
    this.userAccountsService.getCurrentUser().then(
      res => {
        console.log(res);
        this.currentUser = res;

        if (res.profile) {
          this.imgSrc =  res.profile
        }
      },
      err => {
        console.log(err);
      }
    );
  }


  openEventCreate() {
    this.modalRef = this.modalService.open(CreateEventModalComponent);

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

  getEventCreatorsPastEvents() {
    this.eventsService.getEventCreatorsPastEvents(this.userID).then(
      res => {
        console.log(res);
        this.pastEvents = res;
        this.pastEvents.data.sort(function(a: any, b:any){
          return new Date(b.start_date_time).valueOf() - new Date(a.start_date_time).valueOf();
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  
  getEventCreatorsOngoingEvents() {
    this.eventsService.getEventCreatorsOngoingEvents(this.userID).then(
      res => {
        console.log(res);
        this.ongoingEvents = res;
        this.ongoingEvents.data.sort(function(a: any, b:any){
          return new Date(b.start_date_time).valueOf() - new Date(a.start_date_time).valueOf();
        });
      },
      err => {
        console.log(err);
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
    // this.router.navigateByUrl('/event_details');
    window.open('/event_details', "_blank");
    // window.href = '/event_details'
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

  postPoneEvent(eventId: any){
    this.modalRef = this.modalService.open(PostponeEventAlertComponent, { data: { id: eventId }});   
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

  showHideMorePast(event_id: any) {
    var dots = document.getElementById("past-dots-"+event_id) as HTMLSpanElement;
    var moreText = document.getElementById("past-more-"+event_id) as HTMLSpanElement;
    var btnText = document.getElementById("past-myBtn-"+event_id)  as HTMLSpanElement;
    var icons = document.getElementById("past-icons-"+event_id)  as HTMLSpanElement;

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

  showHideMoreOngoing(event_id: any) {
    var dots = document.getElementById("ongoing-dots-"+event_id) as HTMLSpanElement;
    var moreText = document.getElementById("ongoing-more-"+event_id) as HTMLSpanElement;
    var btnText = document.getElementById("ongoing-myBtn-"+event_id)  as HTMLSpanElement;
    var icons = document.getElementById("ongoing-icons-"+event_id)  as HTMLSpanElement;

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

  openPastEventsNextPage(url: string) {
    window.scrollTo(0, 0);

    this.eventsService.getPastUsersEventsNextPage(url).then(
      res => {
        console.log(res);
        this.pastEvents = res;
        this.pastEvents.data.sort(function(a: any, b:any){
          return new Date(b.start_date_time).valueOf() - new Date(a.start_date_time).valueOf();
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  openOngoingEventsNextPage(url: string) {
    window.scrollTo(0, 0);

    this.eventsService.getOngoingUsersEventsNextPage(url).then(
      res => {
        console.log(res);
        this.ongoingEvents = res;
        this.ongoingEvents.data.sort(function(a: any, b:any){
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
    return moment(date).format('ddd, D MMM YY');
  }

  getEventStartDateFormattedOnlyTime(date: any) {
    return moment(date).format('h:mm A');
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

  // scrollHorizontally(index: any) {

  // }

  scrollHorizontally(val: number) {
    console.log(val)
    
    console.log(this.sCont!.offsetWidth, this.hScroll!.offsetWidth, (val + this.scrollAmount))
    // this.currentScrollPosition = 0;
    // this.scrollAmount = 320;
    
    
    this.btnScrollLeft!.style.opacity = "1";
    
    // const scrollHorizontally = (val: any) => {

    let maxScroll = -this.sCont!.offsetWidth + this.hScroll!.offsetWidth;
    console.log(maxScroll)

    if(val < 0) {
      this.currentScrollPosition -= this.scrollAmount;

    } else {
      this.currentScrollPosition += this.scrollAmount;

    }
    console.log('scroll pos', this.currentScrollPosition)

    if(this.currentScrollPosition >= 0) {
      this.currentScrollPosition = 0;
      this.btnScrollLeft!.style.opacity = "0";

    } else {
      this.btnScrollLeft!.style.opacity = "1";
    }

    if(this.currentScrollPosition <= maxScroll) {
      this.currentScrollPosition = maxScroll;
      this.btnScrollRight!.style.opacity = "0";
    } else {
      this.btnScrollRight!.style.opacity = "1";
    }

    this.sCont!.style!.left = this.currentScrollPosition + "px";
    // }
    console.log(this.sCont!.offsetWidth, this.currentScrollPosition)
  }

  
  toggleDarkMode() {
      this.document.body.className +=' dark-theme';
      localStorage.setItem('theme', 'dark');
      this.darkMode = true;
    
  }

  toggleLightMode() {
      this.document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      this.darkMode = false;

  }

  logout(e: any){
    e.preventDefault();
    // sessionStorage.removeItem('x_auth_token');
    // window.location.href = '/'
    this.openSnackBar();
    
    const apiUrl = 'http://events369.logitall.biz/api/v1/';
    this.http.get<any>(apiUrl + 'logout', { headers: this.endpoint.headers() }).subscribe(
      res =>  {
        console.log(res);
        if (_.toLower(res.message) == 'ok') {
          sessionStorage.removeItem('x_auth_token');
          sessionStorage.removeItem('user_id');

          // this.router.navigateByUrl('/');
          
          window.location.href = '/';
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  
  openSnackBar() {
    this._snackBar.open('Logging out...', 'x', {
      duration: 3000
    });
  }

  
  previewEvent() {
    this.router.navigateByUrl('/event_details');
    console.log('clicked');
  }
  
  gotoHomePage() {
    window.open('/', '_self');
  }


}























































































// this.sidebar = this.elementRef.nativeElement.querySelector(".sidebar");
    // this.closeBtn = this.elementRef.nativeElement.querySelector("#btn");
    // this.searchBtn = this.elementRef.nativeElement.querySelector(".bx-search");

    // this.closeBtn?.addEventListener("click", ()=>{
    //   console.log('clicked')
    //   this.sidebar?.classList.toggle("open");
    //   menuBtnChange();//calling the function(optional)
    // });

    // this.searchBtn?.addEventListener("click", ()=>{ // Sidebar open when you click on the search iocn
    //   this.sidebar?.classList.toggle("open");
    //   menuBtnChange(); //calling the function(optional)
    // });

    // // following are the code to change sidebar button(optional)
    // function menuBtnChange() {
    // if(this.sidebar?.classList.contains("open")){
    //   this.closeBtn?.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
    // }else {
    //   this.closeBtn?.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
    // }
    // }
