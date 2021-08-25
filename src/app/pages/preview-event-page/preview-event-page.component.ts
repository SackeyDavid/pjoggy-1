import { AfterViewInit, Component, OnInit, Output, Injectable, EventEmitter, Inject, HostListener } from '@angular/core';
import { EventsService } from 'src/app/services/events/events.service';
import { BannerAdsService } from 'src/app/services/banner-ads/banner-ads.service';
import { ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, Subscription } from 'rxjs'
import { EndpointService } from 'src/app/services/endpoints/endpoint.service';
import _ from 'lodash';
import { UserAccountService } from 'src/app/services/user-account/user-account.service';
import { SearchService } from 'src/app/services/search/search.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersFavoritesService } from 'src/app/services/users-favorites/users-favorites.service';
import { SocialShareModalComponent } from 'src/app/components/social-share-modal/social-share-modal.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Meta, Title } from '@angular/platform-browser';
// import * as Vibrant from 'node-vibrant';
// import Vibrant = require('node-vibrant');

declare var $:any;

@Component({
  selector: 'app-preview-event-page',
  templateUrl: './preview-event-page.component.html',
  styleUrls: ['./preview-event-page.component.scss']
})
export class PreviewEventPageComponent implements OnInit, AfterViewInit {

  userAuthenticated: boolean = false;  
  searchQuery: string = '';
  imgSrc: string = '';
  currentUser: any;
  live_search_results: any;
  userID: any;
  
  user_token: any;

  userFavorites: any = [];

  eventHost: any;
  eventHostImgSrc: any;
  

  @Output() searchEvent = new EventEmitter<string>();

  formGroup: FormGroup = new FormGroup({});

  darkMode: boolean = false;

  bannerAdsData: any = [];
  eventsNow: any = [];
  users_favorite_event_id_and_fav_id: any = [];
  users_favorite_event_id_and_visibilty: any = [];
  users_favorite_event_ids: any = [];

  modalRef: any;

  events_in_six_hrs: any = [];
  events_events_in_six_hrs_empty: boolean = false
  popularEvents: any = [];
  newEvents: any = [];

  dataUrl: string;

  dataContent: any;
  eventContent: any;
  speakersContent: any;
  scheduleContent: any;
  pricingContent: any;
  organisersContent: any;
  sponsorsContent: any;
  galleryContent: any;
  hostingContent: any;

  eventDisplay: Boolean = false;
  speakersDisplay: Boolean = false;
  scheduleDisplay: Boolean = false;
  pricingDisplay: Boolean = false;
  organisersDisplay: Boolean = false;
  sponsorsDisplay: Boolean = false;
  galleryDisplay: Boolean = false;

  isDataReady = false;

  string_from_url: string = '';

  id: string = '';


  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;
  
  public timeDifference: any;
  public secondsToDday: any;
  public minutesToDday: any;
  public hoursToDday: any;
  public daysToDday: any;
  
  public fixed: boolean = false;
  private subscription: Subscription | undefined;

  activeTab: string = 'overview';

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
    private title: Title,
    private meta: Meta
  ) { 
    this.initForm(); 

    // get id from email redirect
      // this would only work if the user is redirecting from the email
      this.string_from_url = decodeURI(this.router.url);

      var ind1 = this.string_from_url.indexOf('=');
      var ind2 = this.string_from_url.indexOf('&', ind1 + 1);


      this.id = this.string_from_url.substring(ind1+1, ind2);
      console.log(this.id)

      // end of email redirect get id from url

      // if id is in the url then assign it to dataUrl variable
      if(this.id.length > 0) {
        // sessionStorage.setItem('preview_event_id', this.id);
        this.dataUrl = 'http://events369.logitall.biz/api/get_event_data/' + this.id;
        console.log('http://events369.logitall.biz/api/get_event_data/', this.id)
      } else {

        // get id from session Storage instead if the url has no id
        // console.log('preview_event_id: ', sessionStorage.getItem('preview_event_id'));
        this.dataUrl = 'http://events369.logitall.biz/api/get_event_data/' + sessionStorage.getItem('preview_event_id');

      }


          
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
      let number = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      if (number > 100) {
          this.fixed = true;
      } else if (this.fixed && number < 10) {
          this.fixed = false;
      }
  }

  
  ngOnInit(): void {
    this.checkIfUserAuthenticated();
    this.getUser();
    this.getUsersFavorites();
    // this.onWindowScroll();
    this.initForm();
    let sessionQuery = sessionStorage.getItem('search_query');
    sessionQuery ? this.searchQuery = sessionQuery : this.searchQuery = '';

    this.getBannerAds();
    this.getEventsHappeningNow();

    // setInterval(this.slideItems, 15000);
    this.darkMode = ((localStorage.getItem('theme') == 'dark') ? true : false);
    if(this.darkMode) this.toggleDarkMode();

    this.string_from_url = decodeURI(this.router.url);

    var ind1 = this.string_from_url.indexOf('=');
    var ind2 = this.string_from_url.indexOf('&', ind1 + 1);


    this.id = this.string_from_url.substring(ind1+1, ind2);
    console.log(this.id)

    if(this.id.length > 0 ) {
      // sessionStorage.setItem('preview_event_id', this.id);
      this.dataUrl = 'http://events369.logitall.biz/api/get_event_data/' + this.id;
      // console.log(this.dataUrl, sessionStorage.getItem('preview_event_id'))
    }

    // get event data before view initialized : fix for 14-Jul-2021 bug
    this.getData();


    
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private getTimeDifference () {
    let dateNow = new Date();
    let dDay = new Date(this.eventContent.start_date_time);

    this.timeDifference = dDay.getTime() - dateNow.getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  allocateTimeUnits(timeDifference: any) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  ngAfterViewInit() {

    this.elementRef.nativeElement.querySelector('.sidebar')
                                  .addEventListener('click', this.onClick.bind(this));
    
    document.querySelector(".sidebar")?.classList.toggle("close");

    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".bx-menu");
    console.log(sidebarBtn);
    sidebarBtn!.addEventListener("click", ()=>{
      sidebar!.classList.toggle("close");
    });

    
    
    this.getData();   
    
    $(document).ready(() => {

      setTimeout(() => {
        
     
      var fixmeTop = $('.fixme').offset().top;       // get initial position of the element
      console.log(fixmeTop)
      $('.workspace-nav').scroll(function() {                  // assign scroll event listener
        // alert('Hi');
          var currentScroll = $('.workspace-nav').scrollTop(); // get current position

          if (currentScroll >= fixmeTop) {           // apply position: fixed if you
            // alert('Hi')
              $('.fixme').css({                      // scroll to that element or below it
                  position: 'sticky',
                  top: '-1.5rem',
                  // left: '0'
              });
             
          } else {                                   // apply position: static
            // alert('No')
              $('.fixme').css({                      // if you scroll above it
                  position: 'static'
              });
              document.querySelector('#overview')?.classList.remove('pt-5');
              document.querySelector('#overview')?.classList.remove('pb-5');
              document.querySelector('#overview')!.className += ' pb-3';
              document.querySelector('#overview')!.nextElementSibling!.classList.remove('pt-3');
              
          }

      });

    }, 2000);


    });

    
    
  }



  dataCall() {
    return this.http.get(this.dataUrl);
    

  }

  getData() {
    this.dataCall()
      .subscribe(
        res => {
          console.log(res);
          this.dataContent = res;

          this.eventContent = this.dataContent.event[0];
          this.speakersContent = this.dataContent.hosts;
          this.scheduleContent = this.dataContent.schedule;
          this.pricingContent = this.dataContent.tickets;
          this.organisersContent = this.dataContent.organizers;
          this.sponsorsContent = this.dataContent.sponsors;
          this.galleryContent = this.dataContent.images;
          this.hostingContent = this.dataContent.hosted_on_links;

          console.log(this.hostingContent);
          this.displayOptions();
          this.isDataReady = true;
          this.title.setTitle(this.eventContent.title);
          this.meta.updateTag({ name: 'description', content: this.eventContent.description });
          this.meta.updateTag({ property: "og:image", content: this.eventContent.banner_image });
          this.meta.updateTag({ property: "og:type", content: this.eventContent.type + ' event' });
          this.meta.updateTag({ property: "og:title", content: this.eventContent.title });
          this.meta.updateTag({ property: "og:description", content: this.eventContent.description });
          this.meta.updateTag({ property: "og:url", content: this.eventContent.event_url });
          this.meta.updateTag({ property: "og:start_time", content: this.eventContent.start_date_time });
          // this.meta.updateTag({ property: "og:image", content: this.eventContent.banner_image });

          
          if(this.eventContent) {

            this.subscription = interval(1000)
            .subscribe(x => { this.getTimeDifference(); });
            this.getEventHost();
          }
      
        },
        err => {
          console.log(err)
        }
      );
  }

  displayOptions(){
    if (Object.keys(this.pricingContent)?.length > 0) this.pricingDisplay = true;
    if (Object.keys(this.eventContent)?.length > 0) this.eventDisplay = true;
    if (Object.keys(this.speakersContent)?.length > 0) this.speakersDisplay = true;
    if (Object.keys(this.scheduleContent)?.length > 0) this.scheduleDisplay = true;
    if (Object.keys(this.organisersContent)?.length > 0) this.organisersDisplay = true;
    if (Object.keys(this.sponsorsContent)?.length > 0) this.sponsorsDisplay = true;
    if (Object.keys(this.galleryContent)?.length > 0) this.galleryDisplay = true;

    console.log({
      speakers: this.speakersDisplay,
      schedule: this.scheduleDisplay,
      pricing: this.pricingDisplay,
      organizers: this.organisersDisplay,
      sponsors: this.sponsorsDisplay,
      gallery: this.galleryDisplay
    });
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

  stringToHslColor(str: string, s: number, l: number) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    var h = hash % 360;
    return 'hsl('+h+', '+s+'%, '+l+'%)';
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


  toggleDarkMode() {
    // if(this.darkMode = 1) {
      // this.document.body.classList.remove('dark-theme');
      
      this.document.body.className +=' dark-theme';
      localStorage.setItem('theme', 'dark');
      this.darkMode = true;

    // }
    
  }

  toggleLightMode() {
    // if(this.darkMode = 1) {
      this.document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      // this.darkMode = 0;
    // } else {
    //   this.document.body.className +=' dark-theme';
      this.darkMode = false;

    // }
    
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

  getEventDateFormatted(date: any) {
    // return moment(date).format('ddd, MMM D, YYYY h:mm A');
    return moment(date).format('ddd, MMM D, YYYY - h:mm A');
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

  
  getEventsHappeningNow(): void {
    this.eventService.getEventsHappeningNow().then(
      res => {
        console.log(res);
        this.eventsNow = res.events?.data;
        this.eventsNow?.sort(function(a: any, b:any){
          return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf();
        });
 
        this.eventsNow.splice(4);
      },
      err => {
        console.log(err);
      }
    );
  }

  getDataDiff(startDate: string, endDate: string) {
    var diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
    var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    return { day: days, hour: hours, minute: minutes, second: seconds };
  }

  hasBeenAddedToFavorites(event_id: any) {
    return this.users_favorite_event_ids.includes(event_id)
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

  openModal(url: string) {
    this.modalRef = this.modalService.open(SocialShareModalComponent, { data: { url: url }});
  }

  getEventHost(): void {
    this.userAccountsService.getAnyUser(this.eventContent?.user_id).then(
      res => {
        console.log(res);
        this.eventHost = res;
        

        if (res.user.profile) {
          this.eventHostImgSrc = 'http://events369.logitall.biz/storage/profile/' + res.user.profile;
        }
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
  
  getEventStartDateFormatted(date: any) {
    return moment(date).format('MMM D, h:mm A');
  }

  gotoSpeakers() {
    this.activeTab = 'speakers';
    document.querySelector('#speakers')?.scrollIntoView({ behavior: 'smooth' });
    $('.workspace-nav').css({                      // if you scroll above it
      position: 'relative',
      left: '1.5rem'
    });
  }

  gotoSchedule() {
    this.activeTab = 'schedule';
    document.querySelector('#schedule')?.scrollIntoView({ behavior: 'smooth' });
    $('.workspace-nav').css({                      // if you scroll above it
      position: 'relative',
      left: '1.5rem'
    });
  }

  gotoHosts() {
    this.activeTab = 'hosts';
    document.querySelector('#hosts')?.scrollIntoView({ behavior: 'smooth' });
    
    $('.workspace-nav').css({                      // if you scroll above it
      position: 'relative',
      left: '1.5rem'
    });
  }

  gotoSponsors() {
    this.activeTab = 'sponsors';
    document.querySelector('#sponsors')?.scrollIntoView({ behavior: 'smooth' });
    $('.workspace-nav').css({                      // if you scroll above it
      position: 'relative',
      left: '1.5rem'
    });
  }
  
  gotoOverview() {
    this.activeTab = 'overview';
    document.querySelector('#overview')?.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('#overview')?.classList.remove('pb-3');
    document.querySelector('#overview')!.className += ' pb-5';
    document.querySelector('#overview')!.nextElementSibling!.className += ' pt-3';
    $('.workspace-nav').css({                      // if you scroll above it
      position: 'relative',
      left: '1.5rem'
    });
  }

  isEventLive(startdate: any, enddate: any) {
    var today = new Date();
    if(today > new Date(startdate) && today < new Date(enddate)) {
      return true;
    }
    else {
      return false;
    }
  }

  isEventPast(startdate: any, enddate: any) {
    var today = new Date();
    if(today > new Date(startdate) && today > new Date(enddate)) {
      return true;
    }
    else {
      return false;
    }
  }


  openRSVPForm() {
    window.open('/rsvp/user');

  }

  
  openCategoriesPage(category_id: string) {
    sessionStorage.setItem('preview_category_id', category_id);
    window.open('/events/events-by-category', '_blank')
  }

}
