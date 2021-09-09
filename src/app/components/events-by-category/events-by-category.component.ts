import { Component, ElementRef, Inject, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlCarousel } from 'ngx-owl-carousel';
import { EventsService } from 'src/app/services/events/events.service';
import { UsersFavoritesService } from 'src/app/services/users-favorites/users-favorites.service';
import moment from 'moment';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SocialShareModalComponent } from 'src/app/components/social-share-modal/social-share-modal.component';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from 'src/app/services/endpoints/endpoint.service';
import { UserAccountService } from 'src/app/services/user-account/user-account.service';
import { SearchService } from 'src/app/services/search/search.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import _ from 'lodash';


@Component({
  selector: 'app-events-by-category',
  templateUrl: './events-by-category.component.html',
  styleUrls: ['./events-by-category.component.scss']
})
export class EventsByCategoryComponent implements OnInit, AfterViewInit {

  
  @Output() searchEvent = new EventEmitter<string>();

  formGroup: FormGroup = new FormGroup({});

  darkMode: boolean = true;
  
  userAuthenticated: boolean = false;  
  searchQuery: string = '';
  imgSrc: string = '';
  currentUser: any;
  live_search_results: any;
  
  user_token: any;
  modalRef: any;

  events_in_six_hrs: any = []
  
  userFavorites: any = []
  userID: string = '';
  sliderOptions: any;
  
  users_favorite_event_id_and_fav_id: any = [];
  users_favorite_event_id_and_visibilty: any = [];
  users_favorite_event_ids: any = [];
  

  loading: boolean = false
  
  string_from_url: string = '';

  id: any;
  categoryEvents: any;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
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
  ) { }

  ngOnInit(): void {
    // scroll page to top
    // window.scrollTo(0, 0);
    this.getUser();
    this.checkIfUserAuthenticated();
    // this.id = this.route.snapshot.params['id'];
    this.id = sessionStorage.getItem('preview_category_id')!;
    console.log(this.id)
    if(this.id) this.getCategoryEvents();

    
    var user_id: any =  sessionStorage.getItem('user_id')
    console.log(user_id)
    this.userID = user_id;
    
    this.getUsersFavorites()  
    console.log(this.users_favorite_event_ids);
    
    this.initForm();

    
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


  getCategoryEvents() {
    this.eventsService.getCategoryEvents(this.id).then(
      res => {
        console.log(res);
        this.categoryEvents = res.events;
      },
      err => {
        console.log(err);
      }
    );
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


  getEventsByCategoryNextPage(page: any): void {
    this.loading = true;
    // window.scrollTo(0, 0);
    this.eventsService.getCategoryEventsNextPage(page).then(
      res => {
        let nextEvents = [];
        nextEvents = res.events;
        nextEvents.data.sort(function(a: any, b:any){
            return new Date(a.start_date_time).valueOf() - new Date(b.start_date_time).valueOf();
          });
        nextEvents.data.forEach((event: any) => {
          this.categoryEvents.data.push(event);
        });

        // assign id of next events to userfavorites id array
        if(this.userFavorites.data) this.getUsersFavoritesAfterNextPageLoad();

        // get the next_page_url of the new events data and assigned it to the respective category data
        this.categoryEvents.next_page_url = nextEvents.next_page_url
        

        this.loading = false;
      },
      err => {
        console.log(err);
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


  gotoPreview(eventId: any) {
    sessionStorage.setItem('preview_event_id', eventId);
    this.router.navigateByUrl('/event_details');
  }

  
  getUsersFavorites (){

    if(this.userID !== '') {
      this.userFavoriteService.getUserFavorites(this.userID).then(
        res => {
          console.log(res);
          this.userFavorites = res.event.data;
        },
        err => {
          console.log(err);
        }
      );

    }


    for (let i = 0; i < this.userFavorites.length; i++) {
      this.users_favorite_event_ids.push(this.userFavorites[i].id)
      
    }
  }

  // getEventStartDateFormatted(date: any) {
  //   return moment(date).format('ddd, MMM D, YYYY h:mm A');
  // }

  hasBeenAddedToFavorites(event_id: any) {
    return this.users_favorite_event_ids.includes(event_id)
  }

  
  saveEventAsFavorite(event_id: any): void {
    if(this.userID == null) {
      this.router.navigateByUrl('/login')
      
    } else {

      this.userFavoriteService.addFavoriteEvent(event_id, this.userID).then(
        res => {
          if (res) {
            console.log(res);
  
            
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
      }
      
    }
    console.log(this.users_favorite_event_id_and_fav_id)
      console.log(favorite_id)

      this.userFavoriteService.removeEventFromFavorite(favorite_id).then(
        res => {
          if (res) {
            console.log(res); 
            
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


  getTicketSalesStatus(ticket_sales_end_date: string) {
    if (ticket_sales_end_date == null) return 1;
    
    var ticket_end_date = ticket_sales_end_date.split(' ')[0];
    var ticket_end_time = ticket_sales_end_date.split(' ')[1];

    let date = new Date();
    date.setHours(0,0,0,0);
    let today = date.valueOf();
    // let sd = Date.parse(this.f.start_date.value);
    let ed = Date.parse(ticket_end_date);    
    let now = new Date().getTime();
    // let st = new Date(this.f.start_time.value).getTime();
    let et = new Date(ticket_end_time).getTime();
      
    // check if ticket sale end date  and timeis greater start date  and time 
    
    if (ed > today && et > now) {
      return 0;
    } else {
      return 1;
    }
  }

  openModal(url: string) {
    this.modalRef = this.modalService.open(SocialShareModalComponent, { data: { url: url }});
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

  
  openCategoriesPage(category_id: string) {
    sessionStorage.setItem('preview_category_id', category_id);
    window.open('/events/events-by-category', '_blank')
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


}
