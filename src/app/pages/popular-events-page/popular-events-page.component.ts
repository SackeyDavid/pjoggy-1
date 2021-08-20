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

declare var $:any;

@Component({
  selector: 'app-popular-events-page',
  templateUrl: './popular-events-page.component.html',
  styleUrls: ['./popular-events-page.component.scss']
})
export class PopularEventsPageComponent implements OnInit, AfterViewInit {

  
  @Output() searchEvent = new EventEmitter<string>();

  formGroup: FormGroup = new FormGroup({});

  darkMode: boolean = true;

  bannerAdsData: any = [];
  eventsNow: any = [];

  popularEvents: any = [];
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
    this.getEventsHappeningNow();

    this.getPopularEvents();
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
    // if(this.darkMode = 1) {
      // this.document.body.classList.remove('dark-theme');
      
      this.document.body.className +=' dark-theme';
      this.darkMode = true;

    // }
    
  }

  toggleLightMode() {
    // if(this.darkMode = 1) {
      this.document.body.classList.remove('dark-theme');
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


  
  previewEvent() {
    this.router.navigateByUrl('/event_details');
    console.log('clicked');
  }

  getPopularEvents(): void {
    this.eventsService.getPopularEvents().then(
      res => {
        console.log(res);
        this.popularEvents = res.events?.data;
        // this.popularEvents.sort(function(a: any, b:any){
        //   return new Date(a.start_date_time).valueOf() - new Date(b.start_date_time).valueOf();
        // });
        // this.popularEvents.splice(4);
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



}
