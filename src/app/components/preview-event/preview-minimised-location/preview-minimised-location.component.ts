import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatSnackBar } from '@angular/material/snack-bar';
// import {}  from 'googlemaps'

@Component({
  selector: 'app-preview-minimised-location',
  templateUrl: './preview-minimised-location.component.html',
  styleUrls: ['./preview-minimised-location.component.scss']
})
export class PreviewMinimisedLocationComponent implements OnInit {

  @Input() eventContent?: any;
  @Input() hostingContent?: any;

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap | undefined
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow | undefined

  facebookLinkCopied = false;
  youtubeLinkCopied = false;
  zoomLinkCopied = false;
  zoomIdCopied = false;
  zoomPasswordCopied = false;
  meetLinkCopied = false;
  meetPasswordCopied = false;
  teamsLinkCopied = false;
  teamsPasswordCopied = false;

  zoom = 12;
  // center: google.maps.LatLngLiteral | undefined;
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    maxZoom: 15,
    minZoom: 8,
  };
  markers: any[] = [];
  marker: any = {};
  center: any = {};
  infoContent = '';

  constructor(private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    let latitude = this.eventContent?.gps.split(", ")[0];
    let longitude = this.eventContent?.gps.split(", ")[1];

    this.marker = {
      position: {
        lat: latitude,
        lng: longitude,
      },
      label: {
        color: 'red',
        text: 'Marker label ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      info: 'Marker info ' + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.BOUNCE,
      }
    }

    this.center = {
      lat: latitude,
      lng: longitude
    }
  }

  ngAfterViewInit(): void {
  }

  zoomIn() {
    // if (this.zoom < this.options.maxZoom) this.zoom++
  }

  zoomOut() {
    // if (this.zoom > this.options.minZoom) this.zoom--
  }

  click(event: google.maps.MouseEvent) {
    console.log(event)
  }

  logCenter() {
    console.log(JSON.stringify(this.map?.getCenter()))
  }

  addMarker() {
    let latitude = this.eventContent?.gps.split(", ")[0];
    let longitude = this.eventContent?.gps.split(", ")[1];

    this.markers.push({
      position: {
        lat: latitude,
        lng: longitude,
      },
      label: {
        color: 'red',
        text: 'Marker label ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      info: 'Marker info ' + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.BOUNCE,
      },
    })
  }

  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content
    this.info?.open(marker)
  }

  openSnackBar() {
    this._snackBar.open('Copied to clipboard', 'x', {
      duration: 3000
    });
  }

  copyFacebookLink(){
    this.facebookLinkCopied = true;
    setTimeout(() => { this.facebookLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyYoutubeLink(){
    this.youtubeLinkCopied = true;
    setTimeout(() => { this.youtubeLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyZoomLink(){
    this.zoomLinkCopied = true;
    setTimeout(() => { this.zoomLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyZoomId(){
    this.zoomIdCopied = true;
    setTimeout(() => { this.zoomIdCopied = false }, 3000);
    this.openSnackBar();
  }

  copyZoomPassword(){
    this.zoomPasswordCopied = true;
    setTimeout(() => { this.zoomPasswordCopied = false }, 3000);
    this.openSnackBar();
  }

  copyMeetLink(){
    this.meetLinkCopied = true;
    setTimeout(() => { this.meetLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyMeetPassword(){
    this.meetLinkCopied = true;
    setTimeout(() => { this.meetLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyTeamsLink(){
    this.teamsLinkCopied = true;
    setTimeout(() => { this.teamsLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyTeamsPassword(){
    this.teamsPasswordCopied = true;
    setTimeout(() => { this.teamsPasswordCopied = false }, 3000);
    this.openSnackBar();
  }

  // // Initialize and add the map
  // initMap(): void {
  //   // The location of event
  //   let latitude = this.eventContent.gps.split(", ")[0];
  //   let longitude = this.eventContent.gps.split(", ")[1];
  //   const location = { lat: latitude, lng: longitude };
  //   console.log(latitude, longitude);

  //   // The map, centered at event
  //   const map = new google.maps.Map(
  //     document.getElementById("map") as HTMLElement,
  //     {
  //       zoom: 4,
  //       center: location,
  //     }
  //   );

  //   // The marker, positioned at event
  //   const marker = new google.maps.Marker({
  //     position: location,
  //     map: map,
  //   });
  // }

}
