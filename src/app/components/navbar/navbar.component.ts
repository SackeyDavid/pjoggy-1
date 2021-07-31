import { Component, OnInit, Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { EndpointService } from 'src/app/services/endpoints/endpoint.service';
import { Router } from '@angular/router';
import _ from 'lodash';
import { UserAccountService } from 'src/app/services/user-account/user-account.service';
import { SearchService } from 'src/app/services/search/search.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersFavoritesService } from 'src/app/services/users-favorites/users-favorites.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userAuthenticated: boolean = false;  
  searchQuery: string = '';
  imgSrc: string = '';
  currentUser: any;
  live_search_results: any;
  userID: any;

  userFavorites: any = [];

  @Output() searchEvent = new EventEmitter<string>();

  formGroup: FormGroup = new FormGroup({});

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private endpoint: EndpointService,
    private userAccountsService: UserAccountService,
    private searchService: SearchService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userFavoriteService: UsersFavoritesService,
    ) 
    { 
      this.initForm()
    }

  ngOnInit(): void {
    this.checkIfUserAuthenticated();
    this.getUser();
    this.getUsersFavorites();
    this.initForm()
    let sessionQuery = sessionStorage.getItem('search_query');
    sessionQuery ? this.searchQuery = sessionQuery : this.searchQuery = '';
  }

  showSearchBar() {
    var brand_element = document.getElementById('brand-name')
    var toggle_elemtent = document.getElementById('toggle-button')
    var searchIcon = document.getElementById('searchIcon')

    if(brand_element) {
      brand_element.style.transition = '2s'
      brand_element.style.transitionProperty = 'display'
      brand_element.style.display = 'none'
    }
    if(toggle_elemtent) {
      toggle_elemtent.style.transition = '2s'
      toggle_elemtent.style.transitionProperty = 'display'
      toggle_elemtent.style.display = 'none'
    }
    if(searchIcon) {
      searchIcon.style.transition = '2s'
      searchIcon.style.transitionProperty = 'display'
      searchIcon.style.display = 'none'
    }

    var divsToHide = document.getElementsByClassName("search-on-mobile-only"); //divsToHide is an array
    console.log(divsToHide)
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].setAttribute('style', 'display: block !important') // or
        divsToHide[i].setAttribute('style', 'display: block !important') // depending on what you're doing
    }

  }

  hideMobileSearch() {
    var divsToHide = document.getElementsByClassName("search-on-mobile-only"); //divsToHide is an array
    console.log(divsToHide)
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].setAttribute('style', 'display: none !important') // or
        divsToHide[i].setAttribute('style', 'display: none !important') // depending on what you're doing
    }

    var brand_element = document.getElementById('brand-name')
    var toggle_elemtent = document.getElementById('toggle-button')
    var searchIcon = document.getElementById('searchIcon')

    if(brand_element) {
      brand_element.style.transition = '2s'
      brand_element.style.transitionProperty = 'display'
      brand_element.style.display = 'block'
    }
    if(toggle_elemtent) {
      toggle_elemtent.style.transition = '2s'
      toggle_elemtent.style.transitionProperty = 'display'
      toggle_elemtent.style.display = 'block'
    }
    if(searchIcon) {
      searchIcon.style.transition = '2s'
      searchIcon.style.transitionProperty = 'display'
      searchIcon.style.display = 'block'
    }

  }

  checkIfUserAuthenticated() {
    var data: any =  sessionStorage.getItem('x_auth_token')
    var user_id: any =  sessionStorage.getItem('user_id')
    this.userID = user_id;
   

    this.userAuthenticated = ((data != null)? true : false)
    console.log('user authenticated: ', this.userAuthenticated)
  }

  // logIn() {
  //   this.router
  // }

  // signUp() {

  // }

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
      if(response.length < 1) this.live_search_results = null;
      this.doLiveSearch(response);
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
    // let sd = Date.parse(this.f.start_date.value);
    let ed = Date.parse(ticket_end_date);    
    let now = new Date().getTime();
    // let st = new Date(this.f.start_time.value).getTime();
    let et = new Date(ticket_end_time).getTime();

    // console.log(Date.parse(ticket_end_date));
    // console.log(Date.parse(ticket_end_time));
    // console.log(today);

    // check if event date is greater than today's date
    // if (sd >= today) this.isDateCorrect = true;
    // else this.isDateCorrect = false;
      
    // check if ticket sale end date  and timeis greater start date  and time 
    
    if (ed > today && et > now) {
      return 0;
    } else {
      return 1;
    }
  }

}
