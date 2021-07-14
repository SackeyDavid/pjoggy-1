import { Component, OnInit, ViewChild } from '@angular/core';
import { EventsService } from 'src/app/services/events/events.service';
import { UsersFavoritesService } from 'src/app/services/users-favorites/users-favorites.service';
import moment from 'moment';
import { OwlCarousel } from 'ngx-owl-carousel';
import { Router } from '@angular/router';
import { UpcomingEventsComponent } from 'src/app/components/upcoming-events/upcoming-events.component';
import { SocialShareModalComponent } from 'src/app/components/social-share-modal/social-share-modal.component';
// import { HappeningNowService } from 'src/app/services/happening-now/happening-now.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

declare var $: any;

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {

  modalRef: any;

  categories: any;
  allEvents: any;
  onlineEvents: any;
  todaysEvents: any;
  categoryEvents: any[] = [];
  slideConfig: any;

  // eventsToday: any = []
  events_in_six_hrs: any = [];
  events_events_in_six_hrs_empty: boolean = false
  popularEvents: any = [];
  newEvents: any = [];

  userFavorites: any = [];
  userID: string = '';
  user_token: string = '';
  sliderOptions: any;
  
  users_favorite_event_ids: any = []

  loading: boolean = true;
  loadIndex = [12, 12, 12]

  favorites_loadIndex = 8
  online_events_loadIndex = 8
  todays_events_loadIndex = 8

  
  users_favorite_event_id_and_fav_id: any = [];
  users_favorite_event_id_and_visibilty: any = [];

  @ViewChild('upcomingSlider') upcomingSlider: OwlCarousel | undefined;
  @ViewChild('popularSlider') popularSlider: OwlCarousel | undefined;
  @ViewChild('newSlider') newSlider: OwlCarousel | undefined;

  constructor(
    private router: Router,
    private eventsService: EventsService,
    private userFavoriteService: UsersFavoritesService,
    // private eventsHappeningNow: HappeningNowService,
    private modalService: MdbModalService
    ) { 
      this.getEventsInSixHrs();
      this.getPopularEvents();
      this.getNewEvents();
      this.getAllEvents();
      this.getOnlineEvents();
      this.getTodaysEvents();
      this.getUsersFavorites();


      
      $(document).ready(function(){ 

      $(".save_live_event_div").on("click", function(this: HTMLDivElement){
        // alert('Hi')
        $(this).find('svg').get(0).style.setProperty('fill', 'rgba(255, 101, 80, 0.4)');
        // .css('fill','rgba(255, 101, 80, 0.4);');
        console.log($(this).find('svg'))
        });

      });



    }

  ngOnInit(): void {
    var user_token = sessionStorage.getItem('x_auth_token')
    this.user_token = ((user_token !== null? user_token: ''))
    var user_id: any =  sessionStorage.getItem('user_id')
    // user_id = JSON.parse(user_id)
    // console.log(user_token)
    this.userID = user_id;
   
    this.getCategories();
    this.getUsersFavorites()  
    console.log(this.users_favorite_event_ids);
    
    this.initCarousel();
  }

  initCarousel() {
    var screenSize = window.innerWidth;
    console.log(screenSize);

    var owlItems = 4;

    if(screenSize > 900) owlItems = 4;
    else if(screenSize < 750 && screenSize > 600) owlItems = 3;
    else if(screenSize < 600 && screenSize > 450) owlItems = 2;
    else if(screenSize < 450) owlItems = 1;

    this.sliderOptions = {
      items: owlItems,
      margin: 20,
      dots: false,      
      responsive:{        
        450: { items: 1 },
        600: { items: 2 },
        750: { items: 3 },
        900: { items: 4 }
      }
    };
  }

  toCamelCase(sentenceCase: any) {
    var out = "";
    sentenceCase.split(" ").forEach(function (el: any, idx: any) {
        var add = el.toLowerCase();
        out += (idx === 0 ? add : add[0].toUpperCase() + add.slice(1));
    });
    // TODO: leak
    // console.log(out);
    return out;
  }

  formatTabPaneId(category: any){
    let camelCase = this.toCamelCase(category);
    let id = '#' + camelCase;
    // console.log(id);
    return id;
  }

  upcomingSliderNext(){
    this.upcomingSlider?.trigger('next.owl.carousel');
  }

  upcomingSliderPrev(){
    this.upcomingSlider?.trigger('prev.owl.carousel');
  }

  popularSliderNext(){
    this.popularSlider?.trigger('next.owl.carousel');
  }

  popularSliderPrev(){
    this.popularSlider?.trigger('prev.owl.carousel');
  }

  newSliderNext(){
    this.newSlider?.trigger('next.owl.carousel');
  }

  newSliderPrev(){
    this.newSlider?.trigger('prev.owl.carousel');
  }

  gotoPreview(eventId: any) {
    sessionStorage.setItem('preview_event_id', eventId);
    // this.router.navigateByUrl('/event_details');
    window.open('/event_details', "_blank");
  }
  
  getAllEvents(): void {
    this.eventsService.getAllEvents().then(
      res => {
        console.log(res);
        this.allEvents = res.events?.data;
      },
      err => {
        console.log(err);
      }
    );
  }

  getOnlineEvents(): void {
    this.eventsService.getEventsByHosting('0').then(
      res => {
        console.log(res);
        this.onlineEvents = res.events;
      },
      err => {
        console.log(err);
      }
    );
  }

  getTodaysEvents(): void {
    this.eventsService.getTodaysEvents().then(
      res => {
        console.log(res);
        this.todaysEvents = res.events;
      },
      err => {
        console.log(err);
      }
    );
  }

  getCategories(): void {
    this.eventsService.getCategories().then(
      res => {
        console.log(res);
        this.categories = res.categories;

        this.getCategoryEvents();
      },
      err => {
        console.log(err);
      }
    );
  }

  getCategoryEvents(): void {
    for(let i=0; i<this.categories.length; i++) {
      var categoryId = this.categories[i].id;
      this.eventsService.getCategoryEvents(categoryId).then(
        res => {
          console.log(res);
          this.categoryEvents[i] = res.events;
          this.loadIndex[i] = 12
          console.log(this.categoryEvents[i].data)
        },
        err => {
          console.log(err);
        }
      );
    }

    console.log(this.categoryEvents, this.loadIndex)
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

  hasBeenAddedToFavorites(event_id: any) {
    return this.users_favorite_event_ids.includes(event_id)
  }


  getEventsInSixHrs(): void {
    this.eventsService.getEventsInSixHours().then(
      res => {
        console.log(res);
        this.events_in_six_hrs = res.events?.data;
        this.events_events_in_six_hrs_empty = ((this.events_in_six_hrs.length > 0)? false: true)
        this.events_in_six_hrs.sort(function(a: any, b:any){
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

  getPopularEvents(): void {
    this.eventsService.getPopularEvents().then(
      res => {
        console.log(res);
        this.popularEvents = res.events?.data;
      },
      err => {
        console.log(err);
      }
    );
  }

  getNewEvents(): void {
    this.eventsService.getNewEvents().then(
      res => {
        console.log(res);
        this.newEvents = res.events?.data;
      },
      err => {
        console.log(err);
      }
    );
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

  
  loadMore(url: string, index: any) {    
    this.loading = true

    this.eventsService.getCategoryEventsNextPage(url).then(
      res => {
        console.log(res);

        let nextEvents = []
        nextEvents = res.events
        nextEvents.data.forEach((event: any) => {
          this.categoryEvents[index].data.push(event);
        });

        // assign id of next events to userfavorites id array
        if(this.userFavorites.data) this.getUsersFavoritesAfterNextPageLoad();

        // get the next_page_url of the new events data and assigned it to the respective category data
        this.categoryEvents[index].next_page_url = nextEvents.next_page_url
        // console.log(this.categoryEvents[index])

        
        // this.categoryEvents[index].data.sort(function(a: any, b:any){
        //   return new Date(a.start_date_time).valueOf() - new Date(b.start_date_time).valueOf();
        // });
      },
      err => {
        console.log(err);
      }
    );


    // console.log(categoryId);
    // this.router.navigateByUrl('/events/events-by-category/'+ categoryId);
    
    
    this.loading = false
  }

  loadLess(categoryId: any) {
    this.loading = true
    if(this.loadIndex[categoryId] >= this.categoryEvents[categoryId].length) {
      this.loadIndex[categoryId] -= 12
    }
    
    this.loading = false
  }

  loadMoreFavorites(url: string) {

    this.loading = true
    
    this.eventsService.getCategoryEventsNextPage(url).then(
      res => {
        console.log(res);

        let nextEvents = []
        nextEvents = res.event
        nextEvents.data.forEach((event: any) => {
          this.userFavorites.data.push(event);
        });

        // assign id of next events to userfavorites id array
        if(this.userFavorites.data) this.getUsersFavoritesAfterNextPageLoad();

        // get the next_page_url of the new events data and assigned it to the respective category data
        this.userFavorites.next_page_url = nextEvents.next_page_url

        
      },
      err => {
        console.log(err);
      }
    );

    this.loading = false
  }

  loadMoreOnlineEvents(url: string) {

    this.loading = true
    
    this.eventsService.getCategoryEventsNextPage(url).then(
      res => {
        console.log(res);

        let nextEvents = []
        nextEvents = res.event
        nextEvents.data.forEach((event: any) => {
          this.onlineEvents.data.push(event);
        });

        // assign id of next events to userfavorites id array
        if(this.userFavorites.data) this.getUsersFavoritesAfterNextPageLoad();

        // get the next_page_url of the new events data and assigned it to the respective category data
        this.onlineEvents.next_page_url = nextEvents.next_page_url

        
      },
      err => {
        console.log(err);
      }
    );

    this.loading = false
  }

  loadMoreTodaysEvents(url: string) {

    this.loading = true
    
    this.eventsService.getCategoryEventsNextPage(url).then(
      res => {
        console.log(res);

        let nextEvents = []
        nextEvents = res.event
        nextEvents.data.forEach((event: any) => {
          this.todaysEvents.data.push(event);
        });

        // assign id of next events to userfavorites id array
        if(this.userFavorites.data) this.getUsersFavoritesAfterNextPageLoad();

        // get the next_page_url of the new events data and assigned it to the respective category data
        this.todaysEvents.next_page_url = nextEvents.next_page_url

        
      },
      err => {
        console.log(err);
      }
    );

    this.loading = false
  }

  loadLessFavorites() {
    this.loading = true
    if(this.favorites_loadIndex >= this.userFavorites.length) {
      this.favorites_loadIndex = 8
    }
    
    this.loading = false
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

  openModal(url: string) {
    this.modalRef = this.modalService.open(SocialShareModalComponent, { data: { url: url }});
  }
 
}
