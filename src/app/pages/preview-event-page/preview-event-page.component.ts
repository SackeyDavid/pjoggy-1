import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events/events.service';
import { BannerAdsService } from 'src/app/services/banner-ads/banner-ads.service';
import { ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

declare var $:any;

@Component({
  selector: 'app-preview-event-page',
  templateUrl: './preview-event-page.component.html',
  styleUrls: ['./preview-event-page.component.scss']
})
export class PreviewEventPageComponent implements OnInit, AfterViewInit {

  darkMode: boolean = true;

  bannerAdsData: any = [];
  eventsNow: any = [];

  constructor(
    private eventService: EventsService,
    private bannerService: BannerAdsService,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) { 
    // $(document).ready(function(){
    //   $('.autoplay').slick({
    //     infinite: true,
    //     slidesToShow: 2,
    //     slidesToScroll: 1,
    //     autoplay: true,
    //     autoplaySpeed: 2000,
    //     arrow: false
    //   });
    // });
          
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
      

      // setTimeout(() => {
      //   document.querySelector(".autoplay")?.insertBefore(nextText!, document.querySelector(".autoplay")?.firstElementChild!)
      //   activeCard!.className += ' card-next'; 
      //   activeCard!.classList.remove('card-slided-left');
      //   // nextText!.setAttribute('style', 'margin-left: 1.25rem');
      // }, 10000);

      // let char = 0;
      let timer = setInterval(onTick, 10000);

      function onTick() {
        

      }

      function complete() {
        clearInterval(timer);
          
      }

    }
      
   }


  ngOnInit(): void {
    this.getBannerAds();
    this.getEventsHappeningNow();

    // setInterval(this.slideItems, 15000);
    this.darkMode = ((localStorage.getItem('theme') == 'dark') ? true : false);
    if(this.darkMode) this.toggleDarkMode();
    
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

}
