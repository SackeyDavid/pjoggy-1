import { ElementRef } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";

@Component({
  selector: 'app-event-manager-home-component',
  templateUrl: './event-manager-home-component.component.html',
  styleUrls: ['./event-manager-home-component.component.scss']
})
export class EventManagerHomeComponentComponent implements OnInit {

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription: any;


  constructor(
    private elementRef: ElementRef
  ) { 

    
  }

  ngAfterViewInit() {
    
    this.elementRef.nativeElement.querySelector('#btn')
                                  .addEventListener('click', this.onClick.bind(this));

    // this.elementRef.nativeElement.querySelector('.sidebar')
    // .addEventListener('click', this.onClick.bind(this));

    // this.elementRef.nativeElement.querySelector('.bx-search')
    // .addEventListener('click', this.onClick.bind(this));

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
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
