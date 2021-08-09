import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events/events.service';
import { BannerAdsService } from 'src/app/services/banner-ads/banner-ads.service';
import { ElementRef } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  
  bannerAdsData: any = [];
  eventsNow: any = [];

  constructor(
    private eventService: EventsService,
    private bannerService: BannerAdsService,
    private elementRef: ElementRef
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

  ngOnInit(): void {
    this.getBannerAds();
    this.getEventsHappeningNow();
  }

  ngAfterViewInit() {

    this.elementRef.nativeElement.querySelector('.sidebar')
                                  .addEventListener('click', this.onClick.bind(this));
    
    document.querySelector(".sidebar")?.classList.toggle("close");

    
    // let arrow = document.querySelectorAll(".arrow");
    // for (var i = 0; i < arrow.length; i++) {
    //   arrow[i].addEventListener("click", (e)=>{
    //  let arrowParent = e; //selecting main parent of arrow
    //  arrowParent.classList.toggle("showMenu");
    //   });
    // }
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

}
