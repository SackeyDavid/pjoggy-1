import { AfterViewInit, Component, OnInit, Injectable, EventEmitter, Inject, Output } from '@angular/core';
import { EventsService } from 'src/app/services/events/events.service';
import { BannerAdsService } from 'src/app/services/banner-ads/banner-ads.service';
import { ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from 'src/app/services/endpoints/endpoint.service';
import { UserAccountService } from 'src/app/services/user-account/user-account.service';
import { SearchService } from 'src/app/services/search/search.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersFavoritesService } from 'src/app/services/users-favorites/users-favorites.service';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import _ from 'lodash';
import { SocialShareModalComponent } from 'src/app/components/social-share-modal/social-share-modal.component';

declare var $:any;

@Component({
  selector: 'app-upcoming-events-page',
  templateUrl: './upcoming-events-page.component.html',
  styleUrls: ['./upcoming-events-page.component.scss']
})
export class UpcomingEventsPageComponent implements OnInit, AfterViewInit {

  
  @Output() searchEvent = new EventEmitter<string>();

  formGroup: FormGroup = new FormGroup({});

  darkMode: boolean = true;

  bannerAdsData: any = [];
  eventsNow: any = [];

  events_in_six_hrs: any = [];
  userAuthenticated: boolean = false;  
  searchQuery: string = '';
  imgSrc: string = '';
  currentUser: any;
  live_search_results: any;
  userID: any;
  
  user_token: any;

  userFavorites: any = [];

  users_favorite_event_id_and_fav_id: any = [];
  users_favorite_event_id_and_visibilty: any = [];
  users_favorite_event_ids: any = [];

  modalRef: any;

  
  loading: boolean = false

  constructor(
    private eventService: EventsService,
    private bannerService: BannerAdsService,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient, 
    private router: Router, 
    private endpoint: EndpointService,
    private userAccountsService: UserAccountService,
    private searchService: SearchService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userFavoriteService: UsersFavoritesService,
    private modalService: MdbModalService,
    private eventsService: EventsService,
  ) { 
    this.initForm(); 
          
  }

  slideItems() {
    let activeCard = document.querySelector(".card-active");
    if (activeCard) {

      activeCard.className += ' card-slided-left';
      // activeCard.className += ' card-next'; 
      activeCard.classList.remove('card-active');
      activeCard!.nextElementSibling!.className += ' card-active';
      activeCard!.nextElementSibling!.classList.remove('card-next');

      setTimeout(() => {
        document.querySelector(".autoplay")?.appendChild(activeCard!)
        
        let nextText = document.querySelector(".autoplay")?.firstElementChild;
        if(nextText) {
          nextText.className += ' card-active'; 
          nextText.classList.remove('card-next');
          activeCard!.className += ' card-next'; 
          activeCard!.classList.remove('card-slided-left');
  
        }
      }, 3180);
      
      let timer = setInterval(onTick, 10000);

      function onTick() {
        

      }

      function complete() {
        clearInterval(timer);
          
      }
    }
      
   }


  ngOnInit(): void {
    this.checkIfUserAuthenticated();
    this.getUser();
    this.getUsersFavorites();
    
    this.getBannerAds();
    this.getEventsInSixHrs();
    // setInterval(this.slideItems, 15000);
    
    this.darkMode = ((localStorage.getItem('theme') == 'dark') ? true : false);
    if(this.darkMode) this.toggleDarkMode();
  }

  ngAfterViewInit() {

    this.elementRef.nativeElement.querySelector('.pp_sidebar')
                                  .addEventListener('click', this.onClick.bind(this));
    
    document.querySelector(".pp_sidebar")?.classList.toggle("close");

    let pp_sidebar = document.querySelector(".pp_sidebar");
    let pp_sidebarBtn = document.querySelector(".bx-menu");
    console.log(pp_sidebarBtn);
    pp_sidebarBtn!.addEventListener("click", ()=>{
      pp_sidebar!.classList.toggle("close");
    });

    
    
  }
  
  menuBtnChange() {
    if(document.querySelector(".pp_sidebar")?.classList.contains("open")){
      document.querySelector(".pp_closeBtn")?.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
    }else {
      document.querySelector(".pp_closeBtn")?.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
    }
  }

  onClick(event: any) {
    document.querySelector(".pp_sidebar")?.classList.toggle("open");
    this.menuBtnChange();//calling the function(optional)
  }

  getBannerAds(): void {
    this.bannerService.getBannerAds().then(
      res => {
        console.log(res);
        this.bannerAdsData = res.banner_ads;
      },
      err => {
        console.log(err);
      }
    );
  }

  getEventsHappeningNow(): void {
    this.eventService.getEventsHappeningNow().then(
      res => {
        console.log(res);
        this.eventsNow = res.events?.data;
      },
      err => {
        console.log(err);
      }
    );
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

  checkIfUserAuthenticated() {
    var user_token = sessionStorage.getItem('x_auth_token');
    this.user_token = ((user_token !== null? user_token: ''));
    
    // var data: any =  sessionStorage.getItem('x_auth_token')
    var user_id: any =  sessionStorage.getItem('user_id')
    this.userID = user_id;
   

    this.userAuthenticated = ((user_token != null)? true : false)
    console.log('user authenticated: ', this.userAuthenticated)
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

  initForm() {
    this.formGroup = this.fb.group({
      'search': ['']
    }) ;
    this.formGroup.get('search')?.valueChanges.subscribe(response => {
      // console.log(this.live_search_results.length);
      if(response.length < 1) {
        document.querySelector("#search-input")?.
            setAttribute('style', 'font-size: .9rem !important;height: calc(2em + 0.75rem + 2px) !important;box-shadow: none !important; border-end-start-radius: 0.55rem !important;border-end-end-radius: 0.55rem !important;border-bottom: none !important;');
            this.live_search_results = null;    
      } else {
        
      this.doLiveSearch(response);
      }
    })
  }

  openSnackBar() {
    this._snackBar.open('Logging out...', 'x', {
      duration: 3000
    });
  }

  
  getDataDiff(startDate: string, endDate: string) {
    var diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
    var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    return { day: days, hour: hours, minute: minutes, second: seconds };
  }



  doLiveSearch(searchword: string){
    this.live_search_results = null;
    this.searchService.liveSearch(searchword).then(
      res => {
        if (res) {
          console.log(res);  
          this.live_search_results = res.events.data;  
          this.live_search_results = this.live_search_results.slice(0, 5);
          if(this.live_search_results.length) {
            document.querySelector("#search-input")?.
            setAttribute('style', 'font-size: 1rem !important;height: calc(3em + 0.75rem + 2px) !important;box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; border-end-start-radius: 0px !important;border-end-end-radius: 0px !important;border-bottom: 1px solid var(--ev-hp_sidebar-border-color) !important;');
          } else {
            document.querySelector("#search-input")?.
            setAttribute('style', 'font-size: .9rem !important;height: calc(2em + 0.75rem + 2px) !important;box-shadow: none !important; border-end-start-radius: 0.55rem !important;border-end-end-radius: 0.55rem !important;border-bottom: none !important;');
            
          }     
        }        
      },
      err => {
        console.log(err);
      }
    );
  }
  

  doSearch(){
    console.log('lets search for ' + this.searchQuery);
    sessionStorage.setItem('search_query', this.searchQuery);
    this.searchEvent.emit(this.searchQuery);
    this.router.navigateByUrl('/search_results');
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


  
  previewEvent(eventId: any) {
    sessionStorage.setItem('preview_event_id', eventId);
    // this.router.navigateByUrl('/event_details');
    window.open('/event_details', "_blank");
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

  hasBeenAddedToFavorites(event_id: any) {
    return this.users_favorite_event_ids.includes(event_id)
  }

  gotoPreview(eventId: any) {
    sessionStorage.setItem('preview_event_id', eventId);
    this.router.navigateByUrl('/event_details');
  }

  openManageEventsPage() {
    window.open('/manage-community', "_blank");
  }

  openFavoritesPage() {
    window.open('/events/favorites', "_blank");

  }

  
  getTicketSalesStatus(ticket_sales_end_date: string) {
    if (ticket_sales_end_date == null) return 1;

    var ticket_end_date = ticket_sales_end_date.split(' ')[0];
    var ticket_end_time = ticket_sales_end_date.split(' ')[1];
    // console.log(ticket_end_date, ticket_end_time);

    let date = new Date();
    date.setHours(0,0,0,0);
    let today = date.valueOf();
    let ed = Date.parse(ticket_end_date);    
    let now = new Date().getTime();
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


  saveEventAsFavorite(event_id: any): void {
    // console.log(this.user_token )
    if(this.user_token == '') {
      window.open('/login', '_self');
      
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

  getEventsInSixHrs(): void {
    this.eventsService.getEventsInSixHours().then(
      res => {
        console.log(res);
        this.events_in_six_hrs = res.events;
        this.events_in_six_hrs.data.sort(function(a: any, b:any){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(a.start_date_time).valueOf() - new Date(b.start_date_time).valueOf();
        });

      },
      err => {
        console.log(err);
      }
    );
  }

  getEventsInSixHrsPage(url: string): void {
    // window.scrollTo(0, 0);
    this.loading = true;
    this.eventsService.getEventsInSixHoursNextPage(url).then(
      res => {
        console.log(res);
        let nextEvents = []
        nextEvents = res.events
        nextEvents.data.sort(function(a: any, b:any){
            return new Date(a.start_date_time).valueOf() - new Date(b.start_date_time).valueOf();
          });
        nextEvents.data.forEach((event: any) => {
          this.events_in_six_hrs.data.push(event);
        });

        // assign id of next events to userfavorites id array
        if(this.userFavorites.data) this.getUsersFavoritesAfterNextPageLoad();

        // get the next_page_url of the new events data and assigned it to the respective category data
        this.events_in_six_hrs.next_page_url = nextEvents.next_page_url
        this.loading = false;
        // this.events_in_six_hrs = res.events;
        // this.events_in_six_hrs.data.sort(function(a: any, b:any){
        //   return new Date(a.start_date_time).valueOf() - new Date(b.start_date_time).valueOf();
        // });
      },
      err => {
        console.log(err);
      }
    );
  }





}
